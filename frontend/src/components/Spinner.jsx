export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="loader" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
