import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import en from "../i18n/en";
import hi from "../i18n/hi";

export default function PatientDashboard({ lang }) {
  const { user } = useAuth();
  const [timeline, setTimeline] = useState([]);
  const t = lang === "hi" ? hi : en;

  useEffect(() => {
    axios.get("/patient/timeline").then(({ data }) => setTimeline(data));
  }, []);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>👤 {t.timeline}</h2>
      <p style={styles.sub}>Hello, {user?.name}. Below is your complete health record.</p>

      {timeline.length === 0 ? (
        <div style={styles.card}><p style={{ color: "#888" }}>{t.noData}</p></div>
      ) : timeline.map(item => (
        <div key={item.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.testBadge}>{item.testName}</span>
            <span style={styles.lock}>{t.locked}</span>
          </div>
          <p style={{ color: "#888", fontSize: 13, margin: "4px 0 12px" }}>
            Lab: {item.lab} | Date: {new Date(item.testDate).toLocaleDateString()}
          </p>

          <div style={styles.section}>
            <strong style={{ color: "#00d4ff" }}>{t.factLabel}</strong>
            <div style={styles.dataTable}>
              {item.results?.map((r, i) => (
                <div key={i} style={styles.dataRow}>
                  <span style={{ color: "#ccc" }}>{r.parameter}</span>
                  <span style={{ color: "#fff", fontWeight: 600 }}>{r.value} {r.unit}</span>
                  <span style={{ color: "#555" }}>Normal: {r.normalRange}</span>
                </div>
              ))}
            </div>
          </div>

          {item.diagnoses?.length > 0 && (
            <div style={styles.section}>
              <strong style={{ color: "#f0a500" }}>{t.opinionLabel}</strong>
              {item.diagnoses.map(d => (
                <div key={d.id} style={styles.diagnosisBox}>
                  <p style={{ color: "#fff", margin: "0 0 4px" }}><strong>Dr. {d.doctor}:</strong> {d.findings}</p>
                  {d.prescription && <p style={{ color: "#ccc", fontSize: 13 }}>Rx: {d.prescription}</p>}
                  {d.followUpDate && <p style={{ color: "#888", fontSize: 12 }}>Follow-up: {new Date(d.followUpDate).toLocaleDateString()}</p>}
                  <p style={{ color: "#555", fontSize: 11 }}>{new Date(d.diagnosedAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: { maxWidth: 800, margin: "0 auto", padding: "24px 16px" },
  heading: { color: "#00d4ff", marginBottom: 4 },
  sub: { color: "#888", marginBottom: 24 },
  card: { background: "#1a1a2e", borderRadius: 12, padding: 24, marginBottom: 20 },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  testBadge: { background: "#00d4ff22", color: "#00d4ff", padding: "3px 12px",
    borderRadius: 20, fontWeight: 600 },
  lock: { color: "#888", fontSize: 13 },
  section: { marginTop: 14 },
  dataTable: { marginTop: 8 },
  dataRow: { display: "flex", justifyContent: "space-between", padding: "6px 0",
    borderBottom: "1px solid #222" },
  diagnosisBox: { background: "#0f0f1a", borderRadius: 8, padding: 14, marginTop: 8,
    borderLeft: "3px solid #f0a500" },
};