import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import "../style/signup.css";

const Signup = ({ onSignup, onSwitchToLogin }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "cashier"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (error) setError("");
  };

  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Invalid email address.");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    setTimeout(() => {
      onSignup && onSignup({
        name: form.name,
        email: form.email,
        role: form.role
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit} autoComplete="off">
        <div className="auth-logo">
          <span className="logo-circle">SH</span>
          <h1>Join Smart POS</h1>
          <p>Create your account</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-field">
          <User className="auth-icon" size={20} />
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            aria-label="Full name"
            required
          />
        </div>
        <div className="auth-field">
          <Mail className="auth-icon" size={20} />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            aria-label="Email address"
            required
          />
        </div>
        <div className="auth-field">
          <Lock className="auth-icon" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            aria-label="Password"
            required
          />
          <button
            type="button"
            className="show-hide-btn"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <div className="auth-field">
          <Lock className="auth-icon" size={20} />
          <input
            type={showConfirm ? "text" : "password"}
            name="confirm"
            placeholder="Confirm password"
            value={form.confirm}
            onChange={handleChange}
            disabled={loading}
            aria-label="Confirm password"
            required
          />
          <button
            type="button"
            className="show-hide-btn"
            onClick={() => setShowConfirm((v) => !v)}
            tabIndex={-1}
            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirm ? "🙈" : "👁️"}
          </button>
        </div>
        <div className="auth-field">
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            disabled={loading}
            aria-label="Role"
            className="auth-select"
          >
            <option value="cashier">Cashier</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>
        <div className="auth-links">
          <a href="#" onClick={e => { e.preventDefault(); onSwitchToLogin && onSwitchToLogin(); }}>
            Already have an account? Sign in
          </a>
        </div>
      </form>
    </div>
  );
};

export default Signup;