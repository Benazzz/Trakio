import { useEffect, useState } from "react";
import { getZones } from "../api/zones";

export default function GameForm(props) {
  const { initialValues, onSubmit, onCancel, isEdit } = props;

  const [values, setValues] = useState(initialValues);
  const [zones, setZones] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadZones = async () => {
      try {
        const data = await getZones();
        setZones(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error ?? "Failed to load zones");
      }
    };
    loadZones();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues({ ...values, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: values.name,
      is_public: values.is_public,
      max_players: Number(values.max_players),
      head_start_min: Number(values.head_start_min),
    };
    if (isEdit) data.is_locked = values.is_locked;
    else data.zone_id = Number(values.zone_id);
    setError(null);
    setSubmitting(true);

    try {
      await onSubmit(data);
    } catch (err) {
      setError(
        err.response?.data?.details?.[0]?.message ??
          err.response?.data?.error ??
          "Failed to submit",
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
        <label htmlFor="name">Name</label>
        <input
          className="input"
          type="text"
          id="name"
          name="name"
          maxLength={100}
          value={values.name}
          onChange={handleChange}
          required
        />
      </div>

      {!isEdit && (
        <div className="form-field">
          <label htmlFor="zone_id">Zone</label>
          <select
            className="input"
            id="zone_id"
            name="zone_id"
            value={values.zone_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a zone</option>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.city} · {zone.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="max_players">Max players</label>
          <input
            className="input"
            type="number"
            id="max_players"
            name="max_players"
            min={2}
            max={20}
            value={values.max_players}
            onChange={handleChange}
            required
          />
          <span className="field-hint">2-20</span>
        </div>
        <div className="form-field">
          <label htmlFor="head_start_min">Head start (min)</label>
          <input
            className="input"
            type="number"
            id="head_start_min"
            name="head_start_min"
            min={1}
            value={values.head_start_min}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <label className="checkbox">
        <input
          type="checkbox"
          name="is_public"
          checked={values.is_public}
          onChange={handleChange}
        />
        Public game
      </label>

      {isEdit && (
        <label className="checkbox">
          <input
            type="checkbox"
            name="is_locked"
            checked={values.is_locked}
            onChange={handleChange}
          />
          Locked lobby
        </label>
      )}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : isEdit ? "Save" : "Create game"}
        </button>
      </div>
    </form>
  );
}
