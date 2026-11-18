import { useEffect, useState } from "react";
import { getGames } from "../api/games.js";
import { Link } from "react-router";
import { Clock, Users } from "lucide-react";
import Spinner from "../components/Spinner";
import StatusBadge from "../components/StatusBadge";
import zoneMap from "../assets/zone-map.svg";

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

  if (loading) return <Spinner label="Loading games..." />;
  if (error)
    return (
      <p className="alert alert-error" role="alert">
        {error}
      </p>
    );

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Games</h1>
          <p className="page-subtitle">Hide-and-seek games in Kaunas</p>
        </div>
      </div>

      {games.length === 0 ? (
        <p className="empty">No games yet.</p>
      ) : (
        <ul className="card-grid">
          {games.map((item, index) => (
            <li key={item.id} style={{ "--i": index }}>
              <Link to={`/games/${item.id}`} className="game-card">
                <img src={zoneMap} alt="" className="game-card-img" />
                <div className="game-card-body">
                  <div className="game-card-title">
                    <h2>{item.name}</h2>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="meta">
                    <Users size={16} aria-hidden="true" />
                    Up to {item.max_players} players
                  </p>
                  <p className="meta">
                    <Clock size={16} aria-hidden="true" />
                    {item.head_start_min} min head start
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
