import { Link } from "react-router";

export default function Header() {
  return (
    <header>
      <nav>
        <Link to="/games">Games</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
}
