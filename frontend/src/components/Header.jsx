import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/games");
    }
  };

  return (
    <header>
      <nav>
        <Link to="/games">Games</Link>

        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link> <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
