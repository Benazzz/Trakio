import { useEffect, useState } from "react";
import { getGames } from "../api/games.js";
import { Link } from "react-router";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getGames();
        setGames(res.data);
      } catch (err) {
        setError(err.response?.data?.error ?? "Failed to load games");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {games.map((item) => (
        <li key={item.id}>
          <Link to={`/games/${item.id}`}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}
