import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { deleteGame, getGame, updateGame } from "../api/games.js";
import Spinner from "../components/Spinner";
import StatusBadge from "../components/StatusBadge";
import zoneMap from "../assets/zone-map.svg";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import GameForm from "../components/GameForm";
import RoundsSection from "../components/RoundsSection.jsx";

export default function GamePage() {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { gameId } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

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

  const canModify =
    user && (user.id === game.created_by || user.role === "admin");

  const handleUpdate = async (data) => {
    const updated = await updateGame(game.id, data);
    setGame({ ...game, ...updated });
    setShowEdit(false);
    toast.success("Game updated");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteGame(game.id);
      toast.success("Game deleted");
      navigate("/games");
    } catch (err) {
      toast.error(err.response?.data?.error ?? "Failed to delete game");
      setShowDelete(false);
    } finally {
      setDeleting(false);
    }
  };

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

            {canModify && (
              <div className="actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEdit(true)}
                >
                  <Pencil size={16} aria-hidden="true" />
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setShowDelete(true)}
                >
                  <Trash2 size={16} aria-hidden="true" />
                  Delete
                </button>
              </div>
            )}
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
      <RoundsSection game={game} />

      <Modal
        open={showEdit}
        title="Edit game"
        onClose={() => setShowEdit(false)}
      >
        <GameForm
          isEdit
          initialValues={{
            name: game.name,
            zone_id: game.zone_id,
            max_players: game.max_players,
            head_start_min: game.head_start_min,
            is_public: game.is_public,
            is_locked: game.is_locked,
          }}
          onSubmit={handleUpdate}
          onCancel={() => setShowEdit(false)}
        />
      </Modal>

      <ConfirmModal
        open={showDelete}
        title="Delete game?"
        message={`"${game.name}" and all its rounds and events will be deleted. This cannot be undone.`}
        busy={deleting}
        onConfirm={handleDelete}
        onClose={() => setShowDelete(false)}
      />
    </section>
  );
}
