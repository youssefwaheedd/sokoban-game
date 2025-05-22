import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Score {
  id: number;
  steps: number;
  user: {
    username: string;
  };
  createdAt: string;
}

interface LeaderboardProps {
  mapId: number;
}

export default function Leaderboard({ mapId }: LeaderboardProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [mapId]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`http://localhost:3000/maps/${mapId}`, {
        credentials: "include",
      });
      const data = await response.json();
      setScores(data.scores);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Steps</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((score, index) => (
              <TableRow key={score.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{score.user.username}</TableCell>
                <TableCell>{score.steps}</TableCell>
                <TableCell>
                  {new Date(score.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {scores.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No scores yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
