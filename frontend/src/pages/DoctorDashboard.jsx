import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ findings: "", prescription: "", followUpDate: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/doctor/reports").then(({ data }) => setReports(data));
  }, []);

  const handleDiagnose = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/doctor/diagnosis", { labReportId: selected._id, ...form });
      setMessage("✅ Diagnosis added successfully.");
      setSelected(null);
      setForm({ findings: "", prescription: "", followUpDate: "" });
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Error"));
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>🩺 Doctor Dashboard</h2>
      <p style={styles.sub}>Welcome Dr. {user?.name}. View lab reports (read-only) and add your diagnosis.</p>

      {message && <div style={styles.msg}>{message}</div>}

      {selected ? (
        <div style={styles.card}>
          <h3 style={{ color: "#00d4ff" }}>Add Diagnosis for: {selected.testName}</h3>
          <div style={styles.readonlyBox}>
            <strong style={{ color: "#aaa" }}>🔬 Lab Data (Read-Only)</strong>
            {selected.results?.map((r, i) => (
              <p key={i} style={{ color: "#ccc", margin: "4px 0" }}>
                {r.parameter}: <strong>{r.value} {r.unit}</strong> (Normal: {r.normalRange})
              </p>
            ))}
          </div>
          <form onSubmit={handleDiagnose}>
            <textarea style={{ ...styles.input, height: 80 }} placeholder="Findings / Diagnosis *"
              value={form.findings} onChange={e => setForm({ ...form, findings: e.target.value })} required />
            <textarea style={{ ...styles.input, height: 60 }} placeholder="Prescription"
              value={form.prescription} onChange={e => setForm({ ...form, prescription: e.target.value })} />
            <input style={styles.input} type="date" value={form.followUpDate}
              onChange={e => setForm({ ...form, followUpDate: e.target.value })} />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" style={styles.btn}>Submit Diagnosis</button>
              <button type="button" onClick={() => setSelected(null)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div style={styles.card}>
          <h3 style={{ color: "#00d4ff", marginBottom: 16 }}>Lab Reports</h3>
          {reports.map(r => (
            <div key={r._id} style={styles.reportRow}>
              <div>
                <strong style={{ color: "#fff" }}>{r.testName}</strong>
                <p style={{ color: "#888", margin: "2px 0" }}>Patient: {r.patientId?.name}</p>
                <p style={{ color: "#555", fontSize: 12 }}>{new Date(r.testDate).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setSelected(r)} style={styles.btn}>Add Diagnosis</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: 800, margin: "0 auto", padding: "24px 16px" },
  heading: { color: "#00d4ff", marginBottom: 4 },
  sub: { color: "#888", marginBottom: 24 },
  card: { background: "#1a1a2e", borderRadius: 12, padding: 24, marginBottom: 24 },
  input: { width: "100%", padding: "9px 12px", marginBottom: 10, borderRadius: 8,
    border: "1px solid #333", background: "#0f0f1a", color: "#fff", fontSize: 14, boxSizing: "border-box" },
  btn: { padding: "8px 18px", background: "#00d4ff", color: "#000",
    border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" },
  cancelBtn: { padding: "8px 18px", background: "transparent", border: "1px solid #555",
    color: "#ccc", borderRadius: 8, cursor: "pointer" },
  readonlyBox: { background: "#0f0f1a", borderRadius: 8, padding: 14, marginBottom: 16,
    border: "1px solid #333" },
  reportRow: { display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 0", borderBottom: "1px solid #222" },
  msg: { padding: 10, borderRadius: 8, marginBottom: 16, background: "#00d4ff11", color: "#00d4ff" },
};