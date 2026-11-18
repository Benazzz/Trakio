import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const [userInput, setUserInput] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(userInput.email, userInput.password);
      toast.success("Logged in");
      navigate("/games");
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to login");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Log in</h1>
          <p>Welcome back to Trakio</p>
        </div>

        {error && (
          <p className="alert alert-error" role="alert">
            {error}
          </p>
        )}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              className="input"
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={userInput.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              className="input"
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={userInput.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </section>
  );
}
