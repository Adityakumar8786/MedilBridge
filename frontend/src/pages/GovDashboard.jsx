import { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const SEV_COLORS = { mild: "#2ecc71", moderate: "#f0a500", severe: "#e67e22", critical: "#e74c3c" };
const STATUS_COLORS = { active: "#e74c3c", recovering: "#f0a500", recovered: "#2ecc71", deceased: "#888" };

export default function GovDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    axios.get("/gov/stats").then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <div style={{ padding: 60, textAlign: "center", color: "#888" }}>Loading dashboard...</div>;

  const { summary, diseaseFrequency, severityBreakdown, quarantineBreakdown,
    statusBreakdown, viralBreakdown, monthlyTrend, reportsByState, quarantineCenters } = stats;

  const maxDisease = Math.max(...(diseaseFrequency.map(d => d.count) || [1]));
  const maxMonthly = Math.max(...(monthlyTrend.map(d => d.count) || [1]));

  return (
    <div style={s.page}>
      <h2 style={s.heading}>🏛️ Government Health Dashboard</h2>
      <p style={s.sub}>Aggregated public health data — no personal information exposed</p>

      {/* Summary Cards */}
      <div style={s.statGrid}>
        {[
          { label: "Total Patients", value: summary.totalPatients, icon: "👤", color: "#00d4ff" },
          { label: "Total Doctors", value: summary.totalDoctors, icon: "🩺", color: "#2ecc71" },
          { label: "Labs Registered", value: summary.totalLabs, icon: "🧪", color: "#9b59b6" },
          { label: "Lab Reports", value: summary.totalReports, icon: "📋", color: "#f0a500" },
          { label: "Diagnoses Made", value: summary.totalDiagnoses, icon: "📝", color: "#3498db" },
          { label: "Viral Cases", value: summary.totalViral, icon: "🦠", color: "#e74c3c" },
          { label: "In Quarantine", value: summary.totalQuarantineActive, icon: "🏠", color: "#e67e22" },
          { label: "Health Centers", value: summary.totalCenters, icon: "🏥", color: "#1abc9c" },
        ].map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {[
          { key: "overview", label: "📊 Disease Overview" },
          { key: "trend", label: "📈 Monthly Trend" },
          { key: "quarantine", label: "🏠 Quarantine" },
          { key: "centers", label: "🏥 Centers" },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ ...s.tab, ...(activeTab === tab.key ? s.tabActive : {}) }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Disease Frequency Bar Chart */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>Disease Frequency</h3>
            {diseaseFrequency.length === 0 ? <Empty /> :
              diseaseFrequency.map((d, i) => (
                <div key={i} style={s.barRow}>
                  <span style={s.barLabel}>{d._id}</span>
                  <div style={s.barTrack}>
                    <div style={{ ...s.barFill, width: `${(d.count / maxDisease) * 100}%`,
                      background: `hsl(${200 - i * 18}, 70%, 55%)` }} />
                  </div>
                  <span style={s.barCount}>{d.count}</span>
                </div>
              ))
            }
          </div>

          {/* Severity Pie */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>Severity Breakdown</h3>
            <PieChart data={severityBreakdown.map(s => ({
              label: s._id, value: s.count, color: SEV_COLORS[s._id] || "#888"
            }))} />
          </div>

          {/* Viral vs Non-Viral */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>Viral vs Non-Viral</h3>
            <PieChart data={viralBreakdown.map(v => ({
              label: v._id ? "Viral" : "Non-Viral",
              value: v.count,
              color: v._id ? "#e74c3c" : "#2ecc71",
            }))} />
          </div>

          {/* Patient Status */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>Patient Status</h3>
            <PieChart data={statusBreakdown.map(s => ({
              label: s._id, value: s.count, color: STATUS_COLORS[s._id] || "#888"
            }))} />
          </div>

          {/* Reports by State */}
          <div style={{ ...s.card, gridColumn: "1 / -1" }}>
            <h3 style={s.cardTitle}>Reports by State</h3>
            {reportsByState.length === 0 ? <Empty /> :
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {reportsByState.map((r, i) => (
                  <div key={i} style={s.stateChip}>
                    <span style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>{r._id || "Unknown"}</span>
                    <span style={{ color: "#00d4ff", fontWeight: 700, fontSize: 16, display: "block" }}>{r.count}</span>
                    <span style={{ color: "#555", fontSize: 11 }}>patients</span>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      )}

      {/* Monthly Trend Tab */}
      {activeTab === "trend" && (
        <div style={s.card}>
          <h3 style={s.cardTitle}>Monthly Lab Reports Trend</h3>
          {monthlyTrend.length === 0 ? <Empty /> : (
            <div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 200, padding: "0 8px" }}>
                {monthlyTrend.map((m, i) => {
                  const height = maxMonthly > 0 ? (m.count / maxMonthly) * 180 : 4;
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 4 }}>
                      <span style={{ color: "#00d4ff", fontSize: 11 }}>{m.count}</span>
                      <div style={{ width: "100%", height: height, background: "#00d4ff44",
                        borderRadius: "4px 4px 0 0", border: "1px solid #00d4ff66",
                        minHeight: 4, transition: "height 0.3s" }} />
                      <span style={{ color: "#555", fontSize: 10 }}>
                        {MONTHS[(m._id.month - 1)]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quarantine Tab */}
      {activeTab === "quarantine" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={s.card}>
            <h3 style={s.cardTitle}>Quarantine Type Distribution</h3>
            {quarantineBreakdown.length === 0 ? <Empty /> : (
              <PieChart data={quarantineBreakdown.map(q => ({
                label: q._id?.replace("_", " ") || "Unknown",
                value: q.count,
                color: q._id === "home" ? "#3498db" : q._id === "hospital" ? "#e74c3c" : "#f0a500",
              }))} />
            )}
          </div>
          <div style={s.card}>
            <h3 style={s.cardTitle}>Quarantine Summary</h3>
            <div style={s.summaryRow}>
              <span style={{ color: "var(--color-text-secondary)" }}>Currently in quarantine</span>
              <span style={{ color: "#e74c3c", fontWeight: 700, fontSize: 20 }}>{summary.totalQuarantineActive}</span>
            </div>
            {quarantineBreakdown.map((q, i) => (
              <div key={i} style={s.summaryRow}>
                <span style={{ color: "var(--color-text-secondary)", textTransform: "capitalize" }}>
                  {q._id?.replace("_", " ") || "Unknown"}
                </span>
                <span style={{ color: "#00d4ff", fontWeight: 600 }}>{q.count} cases</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Centers Tab */}
      {activeTab === "centers" && (
        <div style={s.card}>
          <h3 style={s.cardTitle}>Health Centers Status</h3>
          {quarantineCenters.length === 0 ? (
            <p style={{ color: "var(--color-text-secondary)" }}>No centers registered yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["Name", "Type", "Location", "Beds", "Occupied", "Capacity", "Status"].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {quarantineCenters.map((c, i) => {
                    const pct = c.totalBeds > 0 ? Math.round((c.occupiedBeds / c.totalBeds) * 100) : 0;
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid #222" }}>
                        <td style={s.td}>{c.name}</td>
                        <td style={s.td}><span style={{ ...s.badge, background: "#00d4ff22", color: "#00d4ff" }}>{c.type}</span></td>
                        <td style={s.td}>{c.city}, {c.state}</td>
                        <td style={s.td}>{c.totalBeds}</td>
                        <td style={s.td}>{c.occupiedBeds}</td>
                        <td style={{ ...s.td, minWidth: 100 }}>
                          <div style={{ background: "#222", borderRadius: 4, height: 8, overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%",
                              background: pct > 80 ? "#e74c3c" : pct > 60 ? "#f0a500" : "#2ecc71",
                              borderRadius: 4 }} />
                          </div>
                          <span style={{ fontSize: 11, color: "#888" }}>{pct}%</span>
                        </td>
                        <td style={s.td}>
                          <span style={{ ...s.badge,
                            background: c.status === "operational" ? "#2ecc7122" : c.status === "full" ? "#f0a50022" : "#e74c3c22",
                            color: c.status === "operational" ? "#2ecc71" : c.status === "full" ? "#f0a500" : "#e74c3c" }}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ background: "#1a1a2e", borderRadius: 12, padding: "16px 20px",
      borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      <div style={{ color: "var(--color-text-secondary)", fontSize: 13, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function PieChart({ data }) {
  if (!data || data.length === 0) return <Empty />;
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <Empty />;

  let cumulative = 0;
  const slices = data.map(d => {
    const start = (cumulative / total) * 360;
    cumulative += d.value;
    const end = (cumulative / total) * 360;
    return { ...d, start, end };
  });

  const toXY = (deg, r = 60) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [80 + r * Math.cos(rad), 80 + r * Math.sin(rad)];
  };

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {slices.map((slice, i) => {
          if (slice.end - slice.start < 0.1) return null;
          const [x1, y1] = toXY(slice.start);
          const [x2, y2] = toXY(slice.end);
          const large = slice.end - slice.start > 180 ? 1 : 0;
          return (
            <path key={i}
              d={`M 80 80 L ${x1} ${y1} A 60 60 0 ${large} 1 ${x2} ${y2} Z`}
              fill={slice.color}
              stroke="#1a1a2e"
              strokeWidth="2"
            />
          );
        })}
        <circle cx="80" cy="80" r="30" fill="#1a1a2e" />
        <text x="80" y="84" textAnchor="middle" fill="var(--color-text-secondary)"
          fontSize="11" fontFamily="sans-serif">{total} total</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
            <span style={{ color: "var(--color-text-secondary)", fontSize: 13, textTransform: "capitalize" }}>
              {d.label}
            </span>
            <span style={{ color: "var(--color-text-primary)", fontWeight: 600, fontSize: 13 }}>
              {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Empty() {
  return <p style={{ color: "#555", fontSize: 13, padding: "8px 0" }}>No data yet.</p>;
}

const s = {
  page: { maxWidth: 1000, margin: "0 auto", padding: "24px 16px" },
  heading: { color: "#00d4ff", marginBottom: 4 },
  sub: { color: "var(--color-text-secondary)", marginBottom: 20 },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 24 },
  card: { background: "#1a1a2e", borderRadius: 12, padding: 20, marginBottom: 0 },
  cardTitle: { color: "#00d4ff", marginBottom: 14, fontSize: 15, fontWeight: 600 },
  tabs: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  tab: { padding: "8px 16px", background: "transparent", border: "1px solid #333",
    color: "var(--color-text-secondary)", borderRadius: 8, cursor: "pointer", fontSize: 13 },
  tabActive: { background: "#00d4ff22", border: "1px solid #00d4ff", color: "#00d4ff", fontWeight: 600 },
  barRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  barLabel: { color: "var(--color-text-secondary)", minWidth: 120, fontSize: 12,
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  barTrack: { flex: 1, background: "#0f0f1a", borderRadius: 4, height: 10, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 4, transition: "width 0.5s" },
  barCount: { color: "var(--color-text-secondary)", minWidth: 28, textAlign: "right", fontSize: 12 },
  stateChip: { background: "#0f0f1a", borderRadius: 8, padding: "10px 16px", textAlign: "center",
    border: "1px solid #222", minWidth: 100 },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 0", borderBottom: "1px solid #222" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { color: "#00d4ff", padding: "8px 12px", textAlign: "left",
    borderBottom: "1px solid #333", fontWeight: 600, whiteSpace: "nowrap" },
  td: { color: "var(--color-text-secondary)", padding: "10px 12px", verticalAlign: "middle" },
  badge: { padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
};