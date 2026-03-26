import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

export default function Login({ lang }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/auth/login", form);
      login(data.token, data.user);
      const roleRoutes = {
        patient: "/patient",
        doctor: "/doctor",
        lab: "/lab",
        government: "/government",
      };
      navigate(roleRoutes[data.user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏥 MedilBridge Login</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Email" type="email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input style={styles.input} placeholder="Password" type="password"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={styles.btn} type="submit">Login</button>
        </form>
        <p style={{ textAlign: "center", marginTop: 16, color: "#888" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "#0f0f1a" },
  card: { background: "#1a1a2e", padding: 40, borderRadius: 12, width: 380,
    boxShadow: "0 8px 32px rgba(0,212,255,0.1)" },
  title: { color: "#00d4ff", textAlign: "center", marginBottom: 24 },
  input: { width: "100%", padding: "10px 14px", marginBottom: 14, borderRadius: 8,
    border: "1px solid #333", background: "#0f0f1a", color: "#fff",
    fontSize: 14, boxSizing: "border-box" },
  btn: { width: "100%", padding: 12, background: "#00d4ff", color: "#000",
    border: "none", borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: "pointer" },
  error: { background: "#ff444422", color: "#ff4444", padding: 10,
    borderRadius: 8, marginBottom: 16, textAlign: "center" },
};