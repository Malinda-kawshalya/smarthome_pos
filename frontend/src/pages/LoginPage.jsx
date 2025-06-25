import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import "../style/login.css";

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (error) setError("");
  };

  const validate = () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Invalid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    // Simulate API call
    setTimeout(() => {
      // Demo: Accept only admin@smartpos.com / admin123
      if (form.email === "admin@smartpos.com" && form.password === "admin123") {
        onLogin && onLogin({ email: form.email, role: "admin" });
      } else {
        setError("Invalid credentials.");
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit} autoComplete="off">
        <div className="auth-logo">
          <span className="logo-circle">SH</span>
          <h1>Smart POS</h1>
          <p>Smart Home Solutions</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
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
        <div className="auth-remember">
          <input
            type="checkbox"
            name="remember"
            id="remember"
            checked={form.remember}
            onChange={handleChange}
            disabled={loading}
          />
          <label htmlFor="remember">Remember me</label>
        </div>
        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <div className="auth-links">
          <a href="#" tabIndex={-1} onClick={e => { e.preventDefault(); alert("Password reset coming soon."); }}>
            Forgot password?
          </a>
          <span> | </span>
          <a href="#" onClick={e => { e.preventDefault(); onSwitchToSignup && onSwitchToSignup(); }}>
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;