import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import {
  createRound,
  deleteRound,
  getRounds,
  updateRound,
} from "../api/rounds";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatDateTime } from "../utils/dates";
import Spinner from "./Spinner";
import StatusBadge from "./StatusBadge";
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";
import RoundForm from "./RoundForm";

export default function RoundsSection({ game }) {
  const { user } = useAuth();
  const toast = useToast();

  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const canManage =
    user && (user.id === game.created_by || user.role === "admin");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRounds(game.id);
        setRounds(data);
      } catch (err) {
        setError(err.response?.data?.error ?? "Failed to load rounds");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [game.id]);

  const playerName = (id) =>
    game.players.find((p) => p.id === id)?.username ?? (id ? `#${id}` : "—");

  const handleCreate = async () => {
    setCreating(true);
    try {
      const created = await createRound(game.id);
      setRounds([...rounds, created]);
      toast.success(`Round ${created.round_number} created`);
    } catch (err) {
      toast.error(err.response?.data?.error ?? "Failed to create round");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (data) => {
    const updated = await updateRound(game.id, editing.id, data);
    setRounds(rounds.map((r) => (r.id === updated.id ? updated : r)));
    setEditing(null);
    toast.success(`Round ${updated.round_number} updated`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteRound(game.id, toDelete.id);
      setRounds(rounds.filter((r) => r.id !== toDelete.id));
      toast.success(`Round ${toDelete.round_number} deleted`);
    } catch (err) {
      toast.error(err.response?.data?.error ?? "Failed to delete round");
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2>Rounds</h2>
        {canManage && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={creating || game.status === "finished"}
            title={
              game.status === "finished"
                ? "Finished games cannot get new rounds"
                : undefined
            }
          >
            <Plus size={18} aria-hidden="true" />
            {creating ? "Creating..." : "New round"}
          </button>
        )}
      </div>

      {loading ? (
        <Spinner label="Loading rounds..." />
      ) : error ? (
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      ) : rounds.length === 0 ? (
        <p className="empty">No rounds yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Status</th>
                <th scope="col">Started</th>
                <th scope="col">Ended</th>
                <th scope="col">Found by</th>
                <th scope="col">
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rounds.map((round) => (
                <tr key={round.id}>
                  <td>{round.round_number}</td>
                  <td>
                    <StatusBadge status={round.status} />
                  </td>
                  <td>{formatDateTime(round.started_at)}</td>
                  <td>{formatDateTime(round.ended_at)}</td>
                  <td>{playerName(round.found_by)}</td>
                  <td>
                    <div className="actions table-actions">
                      <Link
                        to={`/games/${game.id}/rounds/${round.id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        <Eye size={16} aria-hidden="true" />
                        View
                      </Link>
                      {canManage && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditing(round)}
                        >
                          <Pencil size={16} aria-hidden="true" />
                          Edit
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setToDelete(round)}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={editing !== null}
        title={editing ? `Edit round ${editing.round_number}` : ""}
        onClose={() => setEditing(null)}
      >
        {editing && (
          <RoundForm
            round={editing}
            players={game.players}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmModal
        open={toDelete !== null}
        title="Delete round?"
        message={
          toDelete
            ? `Round ${toDelete.round_number} and all its events will be deleted. This cannot be undone.`
            : ""
        }
        busy={deleting}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </section>
  );
}
