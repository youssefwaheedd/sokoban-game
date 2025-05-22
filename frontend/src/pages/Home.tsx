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
import { useAuth } from "@/context/AuthContext";
import { Map } from "@/constants/interfaces/game";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [maps, setMaps] = useState<Map[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchMaps();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Available Maps</h1>
            <p className="text-gray-600 mt-2">Choose a map to start playing</p>
          </div>
          {user?.role === "ADMIN" && (
            <Button
              onClick={() => navigate("/admin")}
              className="bg-primary-purple hover:bg-purple-700"
            >
              Admin Dashboard
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-purple"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {maps.map((map) => (
              <Card
                key={map.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/game/${map.id}`)}
              >
                <CardHeader>
                  <CardTitle className="text-xl">{map.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {map.description || "No description available"}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Created by: {map.createdBy.username}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button
                    className="w-full bg-primary-purple hover:bg-purple-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/game/${map.id}`);
                    }}
                  >
                    Play Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
