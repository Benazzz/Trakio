import { useState } from "react";
import { register } from "../api/auth";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(userInput.email, userInput.username, userInput.password);
      await login(userInput.email, userInput.password);
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
    <>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userInput.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          minLength={2}
          maxLength={50}
          value={userInput.username}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          minLength={8}
          maxLength={72}
          value={userInput.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>
      <Link to="/login">Already have an account? Log in</Link>
    </>
  );
}
