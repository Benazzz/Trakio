import { useEffect, useState } from "react";
import { createGame, getGames } from "../api/games.js";
import { Link, useNavigate } from "react-router";
import { Clock, Users, Plus } from "lucide-react";
import Spinner from "../components/Spinner";
import StatusBadge from "../components/StatusBadge";
import zoneMap from "../assets/zone-map.svg";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import Modal from "../components/Modal.jsx";
import GameForm from "../components/GameForm.jsx";

const EMPTY_GAME = {
  name: "",
  zone_id: "",
  max_players: 4,
  head_start_min: 15,
  is_public: true,
  is_locked: false,
};

const PAGE_SIZE = 4;

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [status, setStatus] = useState("");
  const [publicOnly, setPublicOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const params = { page, limit: PAGE_SIZE };
    if (status) params.status = status;
    if (publicOnly) params.is_public = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getGames(params);
        setGames(res.data);
        setTotal(res.total);
      } catch (err) {
        setError(err.response?.data?.error ?? "Failed to load games");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status, publicOnly, page]);

  const handleCreate = async (data) => {
    const created = await createGame(data);
    setShowCreate(false);
    toast.success("Game created");
    navigate(`/games/${created.id}`);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

   return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Games</h1>
          <p className="page-subtitle">Hide-and-seek games in Kaunas</p>
        </div>
        {user && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowCreate(true)}
          >
            <Plus size={18} aria-hidden="true" />
            New game
          </button>
        )}
      </div>

      <div className="filter-bar">
        <div className="form-field">
          <label htmlFor="status-filter">Status</label>
          <select
            className="input"
            id="status-filter"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All</option>
            <option value="lobby">Lobby</option>
            <option value="active">Active</option>
            <option value="finished">Finished</option>
          </select>
        </div>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={publicOnly}
            onChange={(e) => {
              setPublicOnly(e.target.checked);
              setPage(1);
            }}
          />
          Public only
        </label>
      </div>

      {loading ? (
        <Spinner label="Loading games..." />
      ) : error ? (
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      ) : games.length === 0 ? (
        <p className="empty">No games match these filters.</p>
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

      {totalPages > 1 && (
        <nav className="pagination" aria-label="Pagination">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={page === 1 || loading}
            onClick={() => setPage(page - 1)}
          >
            {"<"} Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={page >= totalPages || loading}
            onClick={() => setPage(page + 1)}
          >
            Next {">"}
          </button>
        </nav>
      )}

      <Modal
        open={showCreate}
        title="New game"
        onClose={() => setShowCreate(false)}
      >
        <GameForm
          initialValues={EMPTY_GAME}
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </section>
  );
}
