import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function GovDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("/gov/stats").then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <div style={{ padding: 40, color: "#888", textAlign: "center" }}>Loading stats...</div>;

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>🏛️ Government Dashboard</h2>
      <p style={styles.sub}>Aggregated public health data only. No personal information exposed.</p>

      <div style={styles.statRow}>
        {[
          { label: "Total Patients", value: stats.totalPatients, icon: "👤" },
          { label: "Lab Reports", value: stats.totalReports, icon: "🧪" },
          { label: "Diagnoses", value: stats.totalDiagnoses, icon: "🩺" },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statIcon}>{s.icon}</div>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <h3 style={{ color: "#00d4ff", marginBottom: 12 }}>Top Diagnoses / Disease Frequency</h3>
        {stats.diseaseFrequency?.map((d, i) => (
          <div key={i} style={styles.barRow}>
            <span style={styles.barLabel}>{d._id || "Unspecified"}</span>
            <div style={styles.barTrack}>
              <div style={{ ...styles.barFill, width: `${Math.min(100, d.count * 10)}%` }} />
            </div>
            <span style={styles.barCount}>{d.count}</span>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <h3 style={{ color: "#00d4ff", marginBottom: 12 }}>Reports by State</h3>
        {stats.reportsByState?.map((s, i) => (
          <div key={i} style={styles.stateRow}>
            <span style={{ color: "#ccc" }}>{s._id || "Unknown"}</span>
            <span style={{ color: "#00d4ff", fontWeight: 600 }}>{s.count} patients</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 900, margin: "0 auto", padding: "24px 16px" },
  heading: { color: "#00d4ff", marginBottom: 4 },
  sub: { color: "#888", marginBottom: 24 },
  statRow: { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" },
  statCard: { flex: 1, minWidth: 160, background: "#1a1a2e", borderRadius: 12, padding: 20, textAlign: "center" },
  statIcon: { fontSize: 28, marginBottom: 8 },
  statValue: { fontSize: 32, fontWeight: 700, color: "#00d4ff" },
  statLabel: { color: "#888", fontSize: 13, marginTop: 4 },
  card: { background: "#1a1a2e", borderRadius: 12, padding: 24, marginBottom: 20 },
  barRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
  barLabel: { color: "#ccc", minWidth: 150, fontSize: 13 },
  barTrack: { flex: 1, background: "#0f0f1a", borderRadius: 4, height: 10 },
  barFill: { background: "#00d4ff", height: 10, borderRadius: 4, transition: "width 0.3s" },
  barCount: { color: "#888", minWidth: 30, textAlign: "right", fontSize: 13 },
  stateRow: { display: "flex", justifyContent: "space-between",
    padding: "8px 0", borderBottom: "1px solid #222" },
};