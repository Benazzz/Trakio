import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { getGame } from "../api/games.js";
import Spinner from "../components/Spinner";
import StatusBadge from "../components/StatusBadge";
import zoneMap from "../assets/zone-map.svg";

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

  if (loading) return <Spinner label="Loading game..." />;
  if (error)
    return (
      <section className="page">
        <Link to="/games" className="back-link">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to games
        </Link>
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      </section>
    );

  return (
    <section className="page">
      <Link to="/games" className="back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to games
      </Link>

      <article className="detail-card">
        <img
          src={zoneMap}
          alt={`Map of ${game.zone.name}`}
          className="detail-img"
        />
        <div className="detail-body">
          <div className="detail-title">
            <div>
              <h1>{game.name}</h1>
              <div className="badge-row">
                <StatusBadge status={game.status} />
                <span className="badge">
                  {game.is_public ? "public" : "private"}
                </span>
                {game.is_locked && <span className="badge">locked</span>}
              </div>
            </div>
          </div>

          <dl className="info-grid">
            <div>
              <dt>Zone</dt>
              <dd>
                {game.zone.city} · {game.zone.name}
              </dd>
            </div>
            <div>
              <dt>Created by</dt>
              <dd>{game.creator.username}</dd>
            </div>
            <div>
              <dt>Players</dt>
              <dd>
                {game.players.length} / {game.max_players}
              </dd>
            </div>
            <div>
              <dt>Head start</dt>
              <dd>{game.head_start_min} min</dd>
            </div>
          </dl>

          <div>
            <h2 className="section-label">Players</h2>
            <ul className="chip-list">
              {game.players.map((player) => (
                <li key={player.id} className="chip">
                  {player.username}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </section>
  );
}
