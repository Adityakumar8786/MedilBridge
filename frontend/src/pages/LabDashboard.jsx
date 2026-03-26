import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function LabDashboard({ lang }) {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    patientId: "", testName: "", testDate: "", notes: "",
    results: [{ parameter: "", value: "", unit: "", normalRange: "" }],
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/lab/reports").then(({ data }) => setReports(data));
  }, []);

  const addRow = () =>
    setForm({ ...form, results: [...form.results, { parameter: "", value: "", unit: "", normalRange: "" }] });

  const updateRow = (i, field, val) => {
    const rows = [...form.results];
    rows[i][field] = val;
    setForm({ ...form, results: rows });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/lab/report", form);
      setMessage("✅ Report submitted and locked permanently.");
      const { data } = await axios.get("/lab/reports");
      setReports(data);
      setForm({ patientId: "", testName: "", testDate: "", notes: "",
        results: [{ parameter: "", value: "", unit: "", normalRange: "" }] });
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Error submitting"));
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>🧪 Lab Dashboard</h2>
      <p style={styles.sub}>Welcome, {user?.name}. Submit raw test data below. Once submitted, data is locked.</p>

      <div style={styles.card}>
        <h3 style={{ color: "#00d4ff", marginBottom: 16 }}>Submit New Lab Report</h3>
        {message && <div style={styles.msg}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Patient User ID" value={form.patientId}
            onChange={e => setForm({ ...form, patientId: e.target.value })} required />
          <input style={styles.input} placeholder="Test Name" value={form.testName}
            onChange={e => setForm({ ...form, testName: e.target.value })} required />
          <input style={styles.input} type="date" value={form.testDate}
            onChange={e => setForm({ ...form, testDate: e.target.value })} required />
          <textarea style={{ ...styles.input, height: 60 }} placeholder="Notes (optional)"
            value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />

          <h4 style={{ color: "#ccc" }}>Test Parameters</h4>
          {form.results.map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              {["parameter", "value", "unit", "normalRange"].map(field => (
                <input key={field} style={{ ...styles.input, flex: 1, marginBottom: 0 }}
                  placeholder={field} value={row[field]}
                  onChange={e => updateRow(i, field, e.target.value)} />
              ))}
            </div>
          ))}
          <button type="button" onClick={addRow} style={styles.secondaryBtn}>+ Add Row</button>
          <button type="submit" style={styles.btn}>🔒 Submit & Lock Report</button>
        </form>
      </div>

      <div style={styles.card}>
        <h3 style={{ color: "#00d4ff", marginBottom: 16 }}>Submitted Reports</h3>
        {reports.length === 0 ? <p style={{ color: "#888" }}>No reports yet.</p> :
          reports.map(r => (
            <div key={r._id} style={styles.reportRow}>
              <span style={styles.lock}>🔒</span>
              <div>
                <strong style={{ color: "#fff" }}>{r.testName}</strong>
                <p style={{ color: "#888", margin: "2px 0" }}>Patient: {r.patientId?.name || r.patientId}</p>
                <p style={{ color: "#555", fontSize: 12 }}>Submitted: {new Date(r.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
      </div>
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
  btn: { width: "100%", padding: 12, background: "#00d4ff", color: "#000",
    border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", marginTop: 8 },
  secondaryBtn: { padding: "8px 16px", background: "transparent", border: "1px solid #555",
    color: "#ccc", borderRadius: 6, cursor: "pointer", marginBottom: 12 },
  msg: { padding: 10, borderRadius: 8, marginBottom: 16, background: "#00d4ff11", color: "#00d4ff" },
  reportRow: { display: "flex", gap: 12, alignItems: "flex-start",
    padding: "12px 0", borderBottom: "1px solid #222" },
  lock: { fontSize: 20, marginTop: 2 },
};