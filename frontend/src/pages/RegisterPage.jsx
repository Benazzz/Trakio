import { useState } from "react";
import { register } from "../api/auth";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function RegisterPage() {
  const [userInput, setUserInput] = useState({
    email: "",
    username: "",
    password: "",
  });
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
      await register(userInput.email, userInput.username, userInput.password);
      await login(userInput.email, userInput.password);
      toast.success("Account created");
      navigate("/games");
    } catch (err) {
      setError(
        err.response?.data?.details?.[0]?.message ??
          err.response?.data?.error ??
          "Failed to register",
      );
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
          <h1>Create account</h1>
          <p>Join a game in your city</p>
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
            <label htmlFor="username">Username</label>
            <input
              className="input"
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              minLength={2}
              maxLength={50}
              value={userInput.username}
              onChange={handleChange}
              required
            />
            <span className="field-hint">2–50 characters</span>
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              className="input"
              type="password"
              id="password"
              name="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              value={userInput.password}
              onChange={handleChange}
              required
            />
            <span className="field-hint">At least 8 characters</span>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={submitting}
          >
            {submitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
}
