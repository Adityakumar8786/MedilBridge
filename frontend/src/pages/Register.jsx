import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "patient",
    labName: "", registrationNumber: "", city: "", state: "",
    age: "", gender: "", bloodGroup: "", govId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = { name: form.name, email: form.email, password: form.password, role: form.role };
      if (form.role === "patient") {
        payload.age = form.age;
        payload.gender = form.gender;
        payload.bloodGroup = form.bloodGroup;
        payload.govId = form.govId;
      }
      if (form.role === "lab") {
        payload.labName = form.labName;
        payload.registrationNumber = form.registrationNumber;
        payload.city = form.city;
        payload.state = form.state;
      }
      await axios.post("/auth/register", payload);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏥 Create Account</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Full Name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input style={styles.input} placeholder="Email" type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input style={styles.input} placeholder="Password" type="password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />

          <select style={styles.input} value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="lab">Lab</option>
            <option value="government">Government</option>
          </select>

          {form.role === "patient" && (
            <>
              <input style={styles.input} placeholder="Age" type="number" value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })} />
              <select style={styles.input} value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input style={styles.input} placeholder="Blood Group (e.g. A+)" value={form.bloodGroup}
                onChange={e => setForm({ ...form, bloodGroup: e.target.value })} />
              <input style={styles.input} placeholder="Govt ID (Aadhaar/Voter ID)" value={form.govId}
                onChange={e => setForm({ ...form, govId: e.target.value })} />
            </>
          )}

          {form.role === "lab" && (
            <>
              <input style={styles.input} placeholder="Lab Name" value={form.labName}
                onChange={e => setForm({ ...form, labName: e.target.value })} />
              <input style={styles.input} placeholder="Registration Number" value={form.registrationNumber}
                onChange={e => setForm({ ...form, registrationNumber: e.target.value })} />
              <input style={styles.input} placeholder="City" value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })} />
              <input style={styles.input} placeholder="State" value={form.state}
                onChange={e => setForm({ ...form, state: e.target.value })} />
            </>
          )}

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 16, color: "#888" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "#0f0f1a" },
  card: { background: "#1a1a2e", padding: 40, borderRadius: 12, width: 400,
    boxShadow: "0 8px 32px rgba(0,212,255,0.1)" },
  title: { color: "#00d4ff", textAlign: "center", marginBottom: 24 },
  input: { width: "100%", padding: "10px 14px", marginBottom: 12, borderRadius: 8,
    border: "1px solid #333", background: "#0f0f1a", color: "#fff",
    fontSize: 14, boxSizing: "border-box" },
  btn: { width: "100%", padding: 12, background: "#00d4ff", color: "#000",
    border: "none", borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: "pointer" },
  error: { background: "#ff444422", color: "#ff4444", padding: 10,
    borderRadius: 8, marginBottom: 16, textAlign: "center" },
};