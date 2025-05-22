import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Map } from "@/constants/interfaces/game";
import Navbar from "@/components/Navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";

const TEMPLATES = {
  beginner: {
    name: "Beginner's Challenge",
    description: "A simple map for new players to learn the basics",
    layout: {
      width: 8,
      height: 8,
      grid: [
        "WWWWWWWW",
        "W......W",
        "W..T.B.W",
        "W..P.B.W",
        "W..T.B.W",
        "W......W",
        "W......W",
        "WWWWWWWW",
      ],
    },
  },
  intermediate: {
    name: "Box Maze",
    description:
      "A medium difficulty map with boxes arranged in a maze-like pattern",
    layout: {
      width: 10,
      height: 10,
      grid: [
        "WWWWWWWWWW",
        "W........W",
        "W.B..B...W",
        "W..T.T...W",
        "W.B..B...W",
        "W..T.T...W",
        "W........W",
        "W...P....W",
        "W........W",
        "WWWWWWWWWW",
      ],
    },
  },
  advanced: {
    name: "Box Surplus",
    description:
      "A challenging map with more boxes than targets, requiring strategic box placement",
    layout: {
      width: 12,
      height: 12,
      grid: [
        "WWWWWWWWWWWW",
        "W..........W",
        "W.B......B.W",
        "W.B......B.W",
        "W..T....T..W",
        "W..........W",
        "W..........W",
        "W.B......B.W",
        "W..........W",
        "W..........W",
        "W....P.....W",
        "WWWWWWWWWWWW",
      ],
    },
  },
  expert: {
    name: "Box Overload",
    description:
      "An expert-level map with significantly more boxes than targets",
    layout: {
      width: 14,
      height: 14,
      grid: [
        "WWWWWWWWWWWWWW",
        "W............W",
        "W.B........B.W",
        "W..B......B..W",
        "W...T....T...W",
        "W....B..B....W",
        "W.....BB.....W",
        "W.....BB.....W",
        "W....B..B....W",
        "W...T....T...W",
        "W..B......B..W",
        "W.B........B.W",
        "W.....P......W",
        "WWWWWWWWWWWWWW",
      ],
    },
  },
};

export default function AdminDashboard() {
  const [maps, setMaps] = useState<Map[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMap, setNewMap] = useState({
    name: "",
    description: "",
    layout: "",
  });
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [mapToDelete, setMapToDelete] = useState<Map | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      navigate("/");
      return;
    }
    fetchMaps();
  }, [user, navigate]);

  const fetchMaps = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/maps", {
        credentials: "include",
      });
      const data = await response.json();
      setMaps(data);
    } catch (error) {
      console.error("Failed to fetch maps:", error);
      toast({
        title: "Error",
        description: "Failed to fetch maps",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMap = async () => {
    try {
      setIsCreating(true);

      // Validate layout before sending
      let parsedLayout;
      try {
        parsedLayout = JSON.parse(newMap.layout);
      } catch (e) {
        console.error("Parse error:", e);
        toast({
          title: "Invalid Layout",
          description: "The layout must be a valid JSON string",
          variant: "destructive",
        });
        return;
      }

      // Validate layout structure
      if (
        !parsedLayout.width ||
        !parsedLayout.height ||
        !Array.isArray(parsedLayout.grid)
      ) {
        console.error("Invalid layout structure:", parsedLayout);
        toast({
          title: "Invalid Layout",
          description: "Layout must include width, height, and grid array",
          variant: "destructive",
        });
        return;
      }

      const requestBody = {
        name: newMap.name,
        description: newMap.description,
        layout: parsedLayout,
      };

      const response = await fetch("http://localhost:3000/maps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to create map");
      }

      toast({
        title: "Success",
        description: "Map created successfully",
      });

      setNewMap({ name: "", description: "", layout: "" });
      fetchMaps();
    } catch (error) {
      console.error("Error creating map:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create map",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteMap = async () => {
    if (!mapToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3000/maps/${mapToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete map");
      }

      toast({
        title: "Success",
        description: "Map deleted successfully",
      });

      setMapToDelete(null);
      fetchMaps();
    } catch (error) {
      console.error("Failed to delete map:", error);
      toast({
        title: "Error",
        description: "Failed to delete map",
        variant: "destructive",
      });
    }
  };

  const handleTemplateSelect = (value: string) => {
    setSelectedTemplate(value);
    if (value in TEMPLATES) {
      setNewMap({
        name: TEMPLATES[value].name,
        description: TEMPLATES[value].description,
        layout: JSON.stringify(TEMPLATES[value].layout),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage your Sokoban maps</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Create New Map Section */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Map</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template
                </label>
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">
                      Beginner's Challenge
                    </SelectItem>
                    <SelectItem value="intermediate">Box Maze</SelectItem>
                    <SelectItem value="advanced">Box Surplus</SelectItem>
                    <SelectItem value="expert">Box Overload</SelectItem>
                    <SelectItem value="custom">Custom Map</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Map Name
                </label>
                <Input
                  value={newMap.name}
                  onChange={(e) =>
                    setNewMap({ ...newMap, name: e.target.value })
                  }
                  placeholder="Enter map name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  value={newMap.description}
                  onChange={(e) =>
                    setNewMap({ ...newMap, description: e.target.value })
                  }
                  placeholder="Enter map description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Layout
                </label>
                <Textarea
                  value={newMap.layout}
                  onChange={(e) =>
                    setNewMap({ ...newMap, layout: e.target.value })
                  }
                  placeholder="Enter map layout"
                  className="font-mono"
                  rows={10}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleCreateMap}
                disabled={isCreating}
                className="w-full bg-primary-purple hover:bg-purple-700"
              >
                {isCreating ? "Creating..." : "Create Map"}
              </Button>
            </CardFooter>
          </Card>

          {/* Existing Maps Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Existing Maps</h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-purple"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {maps.map((map) => (
                  <Card key={map.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{map.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-2">
                        {map.description || "No description"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created by: {map.createdBy.username}
                      </p>
                    </CardContent>
                    <CardFooter className="border-t pt-4 gap-2">
                      <Button
                        variant="destructive"
                        onClick={() => setMapToDelete(map)}
                        className="flex-1"
                      >
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog
        open={!!mapToDelete}
        onOpenChange={() => setMapToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the map
              "{mapToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMap}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
