import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import {
  LayoutGrid,
  LogIn,
  LogOut,
  MapPinned,
  Menu,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    try {
      await logout();
    } finally {
      navigate("/games");
    }
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/games" className="brand" onClick={closeMenu}>
          <MapPinned size={28} aria-hidden="true" />
          <span>Trakio</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav
          id="main-nav"
          className={`main-nav${menuOpen ? " open" : ""}`}
          aria-label="Main"
        >
          <NavLink to="/games" className="nav-link" onClick={closeMenu}>
            <LayoutGrid size={18} aria-hidden="true" />
            Games
          </NavLink>

          {user ? (
            <>
              <span className="nav-user">
                <UserRound size={18} aria-hidden="true" />
                {user.role}
              </span>
              <button type="button" className="nav-link" onClick={handleLogout}>
                <LogOut size={18} aria-hidden="true" />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link" onClick={closeMenu}>
                <LogIn size={18} aria-hidden="true" />
                Login
              </NavLink>
              <NavLink to="/register" className="nav-link" onClick={closeMenu}>
                <UserPlus size={18} aria-hidden="true" />
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
