import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";
import Logo from "../components/Logo";

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      await registerUser(name, email, password);
      setError("");
      navigate("/login");
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
        
        <h1>Create an Account</h1>
        <p className="authSubtitle">Join RateTheShow and start sharing your ratings.</p>

        <form className="authForm" onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Walter White"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="primaryButton fullWidth" disabled={loading}>
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        {error && <p className="errorText">{error}</p>}

        <p className="authSwitchText">
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
