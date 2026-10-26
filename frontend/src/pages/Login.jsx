import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiBaseCandidates } from "../utils/apiBase";
import BiometricFaceScanner from "../components/BiometricFaceScanner";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [moduleType, setModuleType] = useState("investigator");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginAgainstAnyBackend = async (path, payload) => {
    let lastError = "Unable to reach server. Please try again.";
    for (const base of getApiBaseCandidates()) {
      try {
        const response = await fetch(`${base}${path}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        return { data, base };
      } catch {
        lastError = `Unable to reach ${base}`;
      }
    }
    return { data: { success: false, message: lastError }, base: null };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint =
        moduleType === "admin"
          ? "/api/admin/auth/login/"
          : "/api/auth/login/";
      const { data, base } = await loginAgainstAnyBackend(endpoint, { username, password });

      if (data.success) {
        if (base) window.localStorage.setItem("api_base", base);
        navigate(moduleType === "admin" ? "/admin/dashboard" : "/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Unable to reach server. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-visual" aria-hidden="true">
          <p className="auth-kicker">AI INVESTIGATION SYSTEM</p>
          <BiometricFaceScanner />
        </section>

        <form className="auth-form" onSubmit={handleLogin}>
          <p className="auth-form-kicker">Secure Entry</p>
          <h2 className="auth-form-title">
            {moduleType === "admin" ? "Admin Login" : "Investigator Login"}
          </h2>

          <div className="auth-role-toggle" role="tablist" aria-label="Select module">
            <button
              type="button"
              role="tab"
              aria-selected={moduleType === "investigator"}
              className={`auth-role-btn ${moduleType === "investigator" ? "auth-role-btn-active" : ""}`}
              onClick={() => {
                setModuleType("investigator");
                setError("");
              }}
            >
              Investigator Module
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={moduleType === "admin"}
              className={`auth-role-btn ${moduleType === "admin" ? "auth-role-btn-active" : ""}`}
              onClick={() => {
                setModuleType("admin");
                setError("");
              }}
            >
              Admin Module
            </button>
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <label className="auth-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder={moduleType === "admin" ? "Enter admin username" : "Enter investigator ID"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="auth-input"
            required
          />

          <label className="auth-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder={moduleType === "admin" ? "Enter admin password" : "Enter access key"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />

          <button type="submit" className="auth-button">
            {moduleType === "admin" ? "Open Admin Dashboard" : "Access Dashboard"}
          </button>

          <p className="auth-hint">
            Authorized personnel only. All login attempts are monitored and logged.
          </p>
        </form>
      </div>
    </div>
  );
}
