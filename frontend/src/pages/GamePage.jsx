import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getGame } from "../api/games.js";

export default function GamePage() {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { gameId } = useParams();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getGame(gameId);
        setGame(data);
      } catch (err) {
        setError(err.response?.data?.error ?? "Failed to load game");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [gameId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Link to="/games">← Back to games</Link>
      <h1>{game.name}</h1>
      <p>
        Zone: {game.zone.city}, {game.zone.name}
      </p>
      <p>Created by: {game.creator.username}</p>
      <p>Status: {game.status}</p>
      <p>
        Players ({game.players.length}/{game.max_players}):
      </p>
      <ul>
        {game.players.map((player) => (
          <li key={player.id}>{player.username}</li>
        ))}
      </ul>
    </>
  );
}