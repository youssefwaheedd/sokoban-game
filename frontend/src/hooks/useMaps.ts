import { useState, useEffect } from "react";
import { Map } from "@/constants/interfaces/game";

export const useMaps = () => {
  const [maps, setMaps] = useState<Map[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const response = await fetch("http://localhost:3000/maps", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch maps");
        }
        const data = await response.json();
        setMaps(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch maps");
      } finally {
        setLoading(false);
      }
    };

    fetchMaps();
  }, []);

  return { maps, loading, error };
};
