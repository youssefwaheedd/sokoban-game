import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Leaderboard from "@/components/Leaderboard";
import GameBoard from "@/components/GameBoard";
import { GameProvider } from "@/context/GameContext";
import { Map } from "@/constants/interfaces/game";
import Navbar from "@/components/Navbar";

export default function Game() {
  const [map, setMap] = useState<Map | null>(null);
  const [steps, setSteps] = useState(0);
  const [isScoreSubmitted, setIsScoreSubmitted] = useState(false);
  const { mapId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchMap();
  }, [mapId]);

  const fetchMap = async () => {
    try {
      const response = await fetch(`http://localhost:3000/maps/${mapId}`, {
        credentials: "include",
      });
      const data = await response.json();
      setMap(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load map",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const handleGameComplete = async (finalSteps: number) => {
    if (isScoreSubmitted) return; // Prevent multiple submissions

    try {
      const response = await fetch(
        `http://localhost:3000/maps/${mapId}/score`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ steps: finalSteps }),
        }
      );

      if (response.ok) {
        setIsScoreSubmitted(true); // Mark score as submitted
        toast({
          title: "Success",
          description: "Score submitted successfully!",
        });
        // Refresh the leaderboard
        if (map) {
          fetchMap();
        }
      } else {
        throw new Error("Failed to submit score");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit score",
        variant: "destructive",
      });
    }
  };

  if (!map) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <GameProvider>
              <GameBoard onGameComplete={handleGameComplete} />
            </GameProvider>
          </div>
          <div className="w-full md:w-80">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
                <Leaderboard mapId={map.id} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
