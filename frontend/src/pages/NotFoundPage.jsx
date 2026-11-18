import { Link } from "react-router";
import { MapPinOff } from "lucide-react";

export default function NotFoundPage() {
  return (
    <section className="empty-state">
      <MapPinOff size={56} aria-hidden="true" />
      <h1>Page not found</h1>
      <p>This place isn’t on our map.</p>
      <Link to="/games" className="btn btn-primary">
        Back to games
      </Link>
    </section>
  );
}
