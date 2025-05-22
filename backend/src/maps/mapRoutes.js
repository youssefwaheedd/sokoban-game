import express from "express";
import { PrismaClient } from "@prisma/client";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get all maps
router.get("/", async (req, res) => {
  try {
    const maps = await prisma.map.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        layout: true,
        createdAt: true,
        createdBy: {
          select: {
            username: true,
          },
        },
      },
    });
    res.json(maps);
  } catch (error) {
    console.error("Error fetching maps:", error);
    res.status(500).json({ error: "Failed to fetch maps" });
  }
});

// Get map by ID with leaderboard
router.get("/:id", async (req, res) => {
  try {
    const map = await prisma.map.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        scores: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            steps: "asc",
          },
          take: 10,
        },
        createdBy: {
          select: {
            username: true,
          },
        },
      },
    });
    if (!map) {
      return res.status(404).json({ error: "Map not found" });
    }
    res.json(map);
  } catch (error) {
    console.error("Error fetching map:", error);
    res.status(500).json({ error: "Failed to fetch map" });
  }
});

// Create new map (admin only)
router.post("/", isAdmin, async (req, res) => {
  try {
    const { name, description, layout } = req.body;

    // Validate required fields
    if (!name || !layout) {
      return res.status(400).json({
        error: "Missing required fields",
        details: {
          name: !name ? "Name is required" : null,
          layout: !layout ? "Layout is required" : null,
        },
      });
    }

    // Validate layout format
    let parsedLayout;
    try {
      parsedLayout = typeof layout === "string" ? JSON.parse(layout) : layout;
    } catch (e) {
      console.error("Layout parse error:", e);
      return res.status(400).json({
        error: "Invalid layout format",
        details: "Layout must be a valid JSON object",
      });
    }

    // Validate layout structure
    if (
      !parsedLayout.width ||
      !parsedLayout.height ||
      !Array.isArray(parsedLayout.grid)
    ) {
      console.error("Invalid layout structure:", parsedLayout);
      return res.status(400).json({
        error: "Invalid layout structure",
        details: "Layout must include width, height, and grid array",
      });
    }

    // Validate grid dimensions
    if (parsedLayout.grid.length !== parsedLayout.height) {
      console.error("Grid height mismatch:", {
        gridLength: parsedLayout.grid.length,
        height: parsedLayout.height,
      });
      return res.status(400).json({
        error: "Invalid grid dimensions",
        details: "Grid height doesn't match specified height",
      });
    }

    for (const row of parsedLayout.grid) {
      if (row.length !== parsedLayout.width) {
        console.error("Grid width mismatch:", {
          rowLength: row.length,
          width: parsedLayout.width,
        });
        return res.status(400).json({
          error: "Invalid grid dimensions",
          details: "Grid width doesn't match specified width",
        });
      }
    }

    // Count and validate game elements
    let playerCount = 0;
    let boxCount = 0;
    let targetCount = 0;

    // Check first and last rows for walls
    for (let x = 0; x < parsedLayout.width; x++) {
      if (
        parsedLayout.grid[0][x] !== "W" ||
        parsedLayout.grid[parsedLayout.height - 1][x] !== "W"
      ) {
        return res.status(400).json({
          error: "Invalid map layout",
          details: "First and last rows must be walls (W)",
        });
      }
    }

    // Check first and last columns for walls
    for (let y = 0; y < parsedLayout.height; y++) {
      if (
        parsedLayout.grid[y][0] !== "W" ||
        parsedLayout.grid[y][parsedLayout.width - 1] !== "W"
      ) {
        return res.status(400).json({
          error: "Invalid map layout",
          details: "First and last columns must be walls (W)",
        });
      }
    }

    // Count and validate game elements
    for (let y = 0; y < parsedLayout.height; y++) {
      for (let x = 0; x < parsedLayout.width; x++) {
        const cell = parsedLayout.grid[y][x];
        switch (cell) {
          case "P":
            playerCount++;
            break;
          case "B":
            boxCount++;
            break;
          case "T":
            targetCount++;
            break;
          case "W":
          case ".":
            break;
          default:
            return res.status(400).json({
              error: "Invalid map layout",
              details: `Invalid character '${cell}' at position (${x}, ${y})`,
            });
        }
      }
    }

    // Validate game elements
    if (playerCount !== 1) {
      return res.status(400).json({
        error: "Invalid map layout",
        details: `Map must have exactly one player (P), found ${playerCount}`,
      });
    }

    if (boxCount === 0) {
      return res.status(400).json({
        error: "Invalid map layout",
        details: "Map must have at least one box (B)",
      });
    }

    if (targetCount === 0) {
      return res.status(400).json({
        error: "Invalid map layout",
        details: "Map must have at least one target (T)",
      });
    }

    // Create the map
    const map = await prisma.map.create({
      data: {
        name,
        description: description || "",
        layout: JSON.stringify(parsedLayout),
        creatorId: req.user.id,
      },
    });

    res.status(201).json(map);
  } catch (error) {
    console.error("Error creating map:", error);
    res.status(500).json({
      error: "Failed to create map",
      details: error.message,
    });
  }
});

// Delete map (admin only)
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    // First delete all scores associated with this map
    await prisma.score.deleteMany({
      where: { mapId: parseInt(req.params.id) },
    });

    // Then delete the map
    await prisma.map.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting map:", error);
    res.status(500).json({ error: "Failed to delete map" });
  }
});

// Submit score for a map
router.post("/:id/score", async (req, res) => {
  try {
    const { steps } = req.body;
    const mapId = parseInt(req.params.id);

    if (!steps || typeof steps !== "number") {
      return res.status(400).json({ error: "Invalid steps value" });
    }

    // Check if user already has a score for this map
    const existingScore = await prisma.score.findUnique({
      where: {
        userId_mapId: {
          userId: req.user.id,
          mapId,
        },
      },
    });

    let score;
    if (existingScore) {
      // Update score if new score is better
      if (steps < existingScore.steps) {
        score = await prisma.score.update({
          where: { id: existingScore.id },
          data: { steps },
        });
      } else {
        score = existingScore;
      }
    } else {
      // Create new score
      score = await prisma.score.create({
        data: {
          steps,
          userId: req.user.id,
          mapId,
        },
      });
    }

    res.status(201).json(score);
  } catch (error) {
    console.error("Error submitting score:", error);
    res.status(500).json({ error: "Failed to submit score" });
  }
});

export default router;
