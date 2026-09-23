import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import Logo from "../components/Logo";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await loginUser(email, password);
      window.dispatchEvent(new Event("authChange"));
      setError("");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authLogoWrapper">
          <Logo />
        </div>

        <h1>Welcome to RateTheShow</h1>
        <p className="authSubtitle">Log in to review, rate, and track your favorite series.</p>

        <form className="authForm" onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="formGroup">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="primaryButton fullWidth" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {error && <p className="errorText">{error}</p>}

        <p className="authSwitchText">
          Don't have an account? <Link to="/register">Create one now</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
