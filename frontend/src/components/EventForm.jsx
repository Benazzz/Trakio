import { useState } from "react";

export default function EventForm({
  event,
  templates,
  players,
  onSubmit,
  onCancel,
}) {
  const isEdit = Boolean(event);

  const [values, setValues] = useState(
    isEdit
      ? {
          status: event.status,
          answer: event.answer ?? "",
          resolved_by: event.resolved_by ?? "",
        }
      : { template_id: "" },
  );
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const questions = templates.filter((t) => t.type === "question");
  const tasks = templates.filter((t) => t.type === "task");

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const data = isEdit
      ? {
          status: values.status,
          answer: values.answer.trim() || null,
          resolved_by: values.resolved_by ? Number(values.resolved_by) : null,
        }
      : { template_id: Number(values.template_id) };

    try {
      await onSubmit(data);
    } catch (err) {
      setError(
        err.response?.data?.details?.[0]?.message ??
          err.response?.data?.error ??
          "Failed to save event",
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

      {!isEdit && (
        <div className="form-field">
          <label htmlFor="template_id">Question or task</label>
          <select
            className="input"
            id="template_id"
            name="template_id"
            value={values.template_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a template</option>
            <optgroup label="Questions">
              {questions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Tasks">
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </optgroup>
          </select>
          <span className="field-hint">
            Templates for this zone and general ones
          </span>
        </div>
      )}

      {isEdit && (
        <>
          <div className="form-field">
            <label htmlFor="event-status">Status</label>
            <select
              className="input"
              id="event-status"
              name="status"
              value={values.status}
              onChange={handleChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="answered">Answered</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="answer">Answer</label>
            <textarea
              className="input"
              id="answer"
              name="answer"
              maxLength={500}
              rows={4}
              value={values.answer}
              onChange={handleChange}
            />
            <span className="field-hint">
              {values.answer.length}/500 characters
            </span>
          </div>

          <div className="form-field">
            <label htmlFor="resolved_by">Resolved by</label>
            <select
              className="input"
              id="resolved_by"
              name="resolved_by"
              value={values.resolved_by}
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
        </>
      )}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save" : "Add event"}
        </button>
      </div>
    </form>
  );
}
