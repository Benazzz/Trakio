import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { CircleHelp, Flag, Pencil, Plus, Trash2 } from "lucide-react";
import { getGame } from "../api/games";
import { getRound } from "../api/rounds";
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "../api/events";
import { getEventTemplates } from "../api/eventTemplates";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatDateTime } from "../utils/dates";
import Spinner from "../components/Spinner";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import EventForm from "../components/EventForm";

export default function RoundPage() {
  const { gameId, roundId } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [game, setGame] = useState(null);
  const [round, setRound] = useState(null);
  const [events, setEvents] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [gameData, roundData, eventsData] = await Promise.all([
          getGame(gameId),
          getRound(gameId, roundId),
          getEvents(gameId, roundId),
        ]);
        const templatesData = await getEventTemplates(gameData.zone_id);
        setGame(gameData);
        setRound(roundData);
        setEvents(eventsData);
        setTemplates(templatesData);
      } catch (err) {
        setError(err.response?.data?.error ?? "Failed to load round");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [gameId, roundId]);

  if (loading) return <Spinner label="Loading round..." />;
  if (error)
    return (
      <section className="page">
        <Link to={`/games/${gameId}`} className="back-link">
          ← Back to game
        </Link>
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      </section>
    );

  const isAdmin = user?.role === "admin";
  const canEdit = (event) =>
    user && (user.id === event.created_by || isAdmin);
  const canCreate = user && round.status === "active";

  const templateOf = (id) => templates.find((t) => t.id === id);
  const playerName = (id) =>
    game.players.find((p) => p.id === id)?.username ?? (id ? `#${id}` : "—");

  const handleCreate = async (data) => {
    const created = await createEvent(gameId, roundId, data);
    setEvents([...events, created]);
    setShowCreate(false);
    toast.success("Event added");
  };

  const handleUpdate = async (data) => {
    const payload = {
      ...data,
      resolved_at:
        data.status === "pending"
          ? null
          : (editing.resolved_at ?? new Date().toISOString()),
    };
    const updated = await updateEvent(gameId, roundId, editing.id, payload);
    setEvents(events.map((e) => (e.id === updated.id ? updated : e)));
    setEditing(null);
    toast.success("Event updated");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEvent(gameId, roundId, toDelete.id);
      setEvents(events.filter((e) => e.id !== toDelete.id));
      toast.success("Event deleted");
    } catch (err) {
      toast.error(err.response?.data?.error ?? "Failed to delete event");
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  return (
    <section className="page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/games">Games</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/games/${game.id}`}>{game.name}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Round {round.round_number}</span>
      </nav>

      <div className="panel">
        <div className="panel-main">
          <div className="panel-title">
            <h1>Round {round.round_number}</h1>
            <StatusBadge status={round.status} />
          </div>
          <dl className="inline-meta">
            <div>
              <dt>Started</dt>
              <dd>{formatDateTime(round.started_at)}</dd>
            </div>
            <div>
              <dt>Ended</dt>
              <dd>{formatDateTime(round.ended_at)}</dd>
            </div>
            <div>
              <dt>Found by</dt>
              <dd>{playerName(round.found_by)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="section">
        <div className="section-header">
          <h2>Events</h2>
          {user && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreate(true)}
              disabled={!canCreate}
              title={
                canCreate ? undefined : "Events can only be added to an active round"
              }
            >
              <Plus size={18} aria-hidden="true" />
              New event
            </button>
          )}
        </div>

        {events.length === 0 ? (
          <p className="empty">No questions or tasks in this round yet.</p>
        ) : (
          <ul className="list">
            {events.map((event, index) => {
              const template = templateOf(event.template_id);
              const isQuestion = template?.type === "question";
              return (
                <li
                  key={event.id}
                  className="list-item"
                  style={{ "--i": index }}
                >
                  <span className="list-icon">
                    {isQuestion ? (
                      <CircleHelp size={20} aria-label="Question" />
                    ) : (
                      <Flag size={20} aria-label="Task" />
                    )}
                  </span>
                  <div className="list-content">
                    <h3 className="list-title">
                      {template?.name ?? `Template #${event.template_id}`}
                    </h3>
                    <p className="list-meta">
                      <span>{isQuestion ? "Question" : "Task"}</span>
                      <StatusBadge status={event.status} />
                      <span>by {playerName(event.created_by)}</span>
                      {event.resolved_by && (
                        <span>· resolved by {playerName(event.resolved_by)}</span>
                      )}
                    </p>
                    {event.answer && (
                      <p className="answer">“{event.answer}”</p>
                    )}
                  </div>
                  {(canEdit(event) || isAdmin) && (
                    <div className="actions">
                      {canEdit(event) && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditing(event)}
                        >
                          <Pencil size={16} aria-hidden="true" />
                          Edit
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setToDelete(event)}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Modal
        open={showCreate}
        title="New event"
        onClose={() => setShowCreate(false)}
      >
        <EventForm
          templates={templates}
          players={game.players}
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>

      <Modal
        open={editing !== null}
        title="Edit event"
        onClose={() => setEditing(null)}
      >
        {editing && (
          <EventForm
            event={editing}
            templates={templates}
            players={game.players}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmModal
        open={toDelete !== null}
        title="Delete event?"
        message="This question or task will be removed from the round. This cannot be undone."
        busy={deleting}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </section>
  );
}
