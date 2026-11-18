import { useState } from "react";
import { fromLocalInput, toLocalInput } from "../utils/dates";

/*
  Raundo redagavimo forma (PUT reikalauja visų 4 laukų).
  Props: round – redaguojamas raundas, players – žaidimo žaidėjai (found_by sąrašui).
*/
export default function RoundForm({ round, players, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    status: round.status,
    started_at: toLocalInput(round.started_at),
    ended_at: toLocalInput(round.ended_at),
    found_by: round.found_by ?? "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const data = {
      status: values.status,
      started_at: fromLocalInput(values.started_at),
      ended_at: fromLocalInput(values.ended_at),
      found_by: values.found_by ? Number(values.found_by) : null,
    };

    try {
      await onSubmit(data);
    } catch (err) {
      setError(
        err.response?.data?.details?.[0]?.message ??
          err.response?.data?.error ??
          "Failed to save round",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && (
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-field">
        <label htmlFor="round-status">Status</label>
        <select
          className="input"
          id="round-status"
          name="status"
          value={values.status}
          onChange={handleChange}
          required
        >
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="finished">Finished</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="started_at">Started at</label>
          <input
            className="input"
            type="datetime-local"
            id="started_at"
            name="started_at"
            value={values.started_at}
            onChange={handleChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="ended_at">Ended at</label>
          <input
            className="input"
            type="datetime-local"
            id="ended_at"
            name="ended_at"
            min={values.started_at || undefined}
            value={values.ended_at}
            onChange={handleChange}
          />
          <span className="field-hint">Must be after the start time</span>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="found_by">Found by</label>
        <select
          className="input"
          id="found_by"
          name="found_by"
          value={values.found_by}
          onChange={handleChange}
        >
          <option value="">— Nobody yet —</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.username}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
