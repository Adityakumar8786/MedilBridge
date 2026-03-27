import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const SEVERITY_COLORS = {
  mild: "#2ecc71",
  moderate: "#f0a500",
  severe: "#e67e22",
  critical: "#e74c3c",
};

const COMMON_TESTS = [
  "CBC (Complete Blood Count)",
  "Blood Culture",
  "Chest X-Ray",
  "CT Scan",
  "PCR Test",
  "Urine Culture",
  "Liver Function Test",
  "Kidney Function Test",
  "COVID-19 Rapid Antigen",
  "Dengue NS1 Antigen",
  "Malaria Rapid Test",
  "Typhoid Widal Test",
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [myDiagnoses, setMyDiagnoses] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [form, setForm] = useState({
    findings: "",
    diseaseName: "",
    prescription: "",
    followUpDate: "",
    severity: "mild",
    status: "active",
    isViral: false,
    quarantineRequired: false,
    quarantineDays: 0,
    quarantineType: "home",
    furtherTestsRequired: false,
    recommendedTests: [],
    customTest: "",
  });

  useEffect(() => {
    axios.get("/doctor/reports").then(({ data }) => setReports(data));
    axios.get("/doctor/diagnoses").then(({ data }) => setMyDiagnoses(data));
  }, []);

  const toggleTest = (test) => {
    setForm((f) => ({
      ...f,
      recommendedTests: f.recommendedTests.includes(test)
        ? f.recommendedTests.filter((t) => t !== test)
        : [...f.recommendedTests, test],
    }));
  };

  const addCustomTest = () => {
    if (!form.customTest.trim()) return;
    setForm((f) => ({
      ...f,
      recommendedTests: [...f.recommendedTests, f.customTest.trim()],
      customTest: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, labReportId: selected._id };
      delete payload.customTest;
      await axios.post("/doctor/diagnosis", payload);
      setMessage({ text: "✅ Diagnosis submitted successfully.", type: "success" });
      setSelected(null);
      const [r, d] = await Promise.all([
        axios.get("/doctor/reports"),
        axios.get("/doctor/diagnoses"),
      ]);
      setReports(r.data);
      setMyDiagnoses(d.data);
      resetForm();
    } catch (err) {
      setMessage({ text: "❌ " + (err.response?.data?.message || "Error"), type: "error" });
    }
  };

  const resetForm = () =>
    setForm({
      findings: "", diseaseName: "", prescription: "", followUpDate: "",
      severity: "mild", status: "active", isViral: false,
      quarantineRequired: false, quarantineDays: 0, quarantineType: "home",
      furtherTestsRequired: false, recommendedTests: [], customTest: "",
    });

  // Reports that don't yet have a diagnosis from this doctor
  const diagnosedReportIds = new Set(myDiagnoses.map((d) => d.labReportId?._id?.toString()));
  const pendingReports = reports.filter((r) => !diagnosedReportIds.has(r._id.toString()));

  return (
    <div style={s.page}>
      <h2 style={s.heading}>🩺 Doctor Dashboard</h2>
      <p style={s.sub}>Welcome Dr. {user?.name}</p>

      {message.text && (
        <div style={{ ...s.msg, background: message.type === "success" ? "#00d4ff11" : "#ff444422",
          color: message.type === "success" ? "#00d4ff" : "#ff4444" }}>
          {message.text}
        </div>
      )}

      {selected ? (
        <DiagnosisForm
          report={selected}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onCancel={() => { setSelected(null); resetForm(); }}
          toggleTest={toggleTest}
          addCustomTest={addCustomTest}
        />
      ) : (
        <>
          {/* Tabs */}
          <div style={s.tabs}>
            {["pending", "completed"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ ...s.tab, ...(activeTab === tab ? s.tabActive : {}) }}>
                {tab === "pending" ? `🔔 Pending (${pendingReports.length})` : `✅ Completed (${myDiagnoses.length})`}
              </button>
            ))}
          </div>

          {activeTab === "pending" && (
            <div style={s.card}>
              <h3 style={s.cardTitle}>Lab Reports Awaiting Diagnosis</h3>
              {pendingReports.length === 0 ? (
                <p style={{ color: "var(--color-text-secondary)" }}>All reports have been diagnosed.</p>
              ) : pendingReports.map((r) => (
                <div key={r._id} style={s.reportRow}>
                  <div>
                    <strong style={{ color: "var(--color-text-primary)" }}>{r.testName}</strong>
                    <p style={s.meta}>Patient: {r.patientId?.name} | {new Date(r.testDate).toLocaleDateString()}</p>
                    <p style={s.meta}>Lab: {r.labId?.name}</p>
                  </div>
                  <button onClick={() => setSelected(r)} style={s.btn}>Add Diagnosis</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "completed" && (
            <div style={s.card}>
              <h3 style={s.cardTitle}>My Diagnoses</h3>
              {myDiagnoses.length === 0 ? (
                <p style={{ color: "var(--color-text-secondary)" }}>No diagnoses yet.</p>
              ) : myDiagnoses.map((d) => (
                <div key={d._id} style={s.diagRow}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                      <strong style={{ color: "var(--color-text-primary)" }}>
                        {d.diseaseName || "Unnamed diagnosis"}
                      </strong>
                      <span style={{ ...s.badge, background: SEVERITY_COLORS[d.severity] + "22",
                        color: SEVERITY_COLORS[d.severity] }}>
                        {d.severity}
                      </span>
                      {d.isViral && <span style={{ ...s.badge, background: "#ff666622", color: "#ff6666" }}>Viral</span>}
                      {d.quarantineRequired && (
                        <span style={{ ...s.badge, background: "#f0a50022", color: "#f0a500" }}>
                          Quarantine {d.quarantineDays}d
                        </span>
                      )}
                    </div>
                    <p style={s.meta}>Patient: {d.patientId?.name} | {new Date(d.diagnosedAt).toLocaleDateString()}</p>
                    <p style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>{d.findings}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function DiagnosisForm({ report, form, setForm, onSubmit, onCancel, toggleTest, addCustomTest }) {
  return (
    <div style={s.card}>
      <h3 style={s.cardTitle}>Diagnosis for: {report.testName}</h3>

      {/* Read-only lab data */}
      <div style={s.readonlyBox}>
        <strong style={{ color: "#00d4ff", fontSize: 13 }}>🔬 Lab Data (Read-Only — Immutable)</strong>
        <div style={{ marginTop: 8 }}>
          {report.results?.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 16, padding: "5px 0",
              borderBottom: "1px solid #222", fontSize: 13 }}>
              <span style={{ color: "var(--color-text-secondary)", minWidth: 140 }}>{r.parameter}</span>
              <strong style={{ color: "var(--color-text-primary)" }}>{r.value} {r.unit}</strong>
              <span style={{ color: "#555" }}>Normal: {r.normalRange}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit}>
        {/* Section: Core */}
        <SectionLabel>Core Diagnosis</SectionLabel>
        <input style={s.input} placeholder="Disease Name (e.g. Dengue Fever)" value={form.diseaseName}
          onChange={e => setForm({ ...form, diseaseName: e.target.value })} />
        <textarea style={{ ...s.input, height: 80 }} placeholder="Clinical Findings *" required
          value={form.findings} onChange={e => setForm({ ...form, findings: e.target.value })} />
        <textarea style={{ ...s.input, height: 60 }} placeholder="Prescription / Treatment Plan"
          value={form.prescription} onChange={e => setForm({ ...form, prescription: e.target.value })} />

        <div style={s.row}>
          <div style={s.halfCol}>
            <label style={s.label}>Severity</label>
            <select style={s.input} value={form.severity}
              onChange={e => setForm({ ...form, severity: e.target.value })}>
              {["mild", "moderate", "severe", "critical"].map(v => (
                <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
              ))}
            </select>
          </div>
          <div style={s.halfCol}>
            <label style={s.label}>Patient Status</label>
            <select style={s.input} value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}>
              {["active", "recovering", "recovered", "deceased"].map(v => (
                <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={s.row}>
          <label style={s.label}>Follow-up Date</label>
          <input style={{ ...s.input, maxWidth: 200 }} type="date" value={form.followUpDate}
            onChange={e => setForm({ ...form, followUpDate: e.target.value })} />
        </div>

        {/* Section: Viral */}
        <SectionLabel>Viral Assessment</SectionLabel>
        <ToggleRow
          label="Is this a viral disease?"
          checked={form.isViral}
          onChange={v => setForm({ ...form, isViral: v })}
          description="Marks this case in the government disease surveillance system"
        />

        {/* Section: Quarantine */}
        <SectionLabel>Quarantine Decision</SectionLabel>
        <ToggleRow
          label="Quarantine required?"
          checked={form.quarantineRequired}
          onChange={v => setForm({ ...form, quarantineRequired: v, quarantineType: v ? "home" : "none", quarantineDays: v ? 7 : 0 })}
          description="Patient will be flagged for quarantine in the system"
        />

        {form.quarantineRequired && (
          <div style={{ ...s.subSection }}>
            <div style={s.row}>
              <div style={s.halfCol}>
                <label style={s.label}>Quarantine Type</label>
                <select style={s.input} value={form.quarantineType}
                  onChange={e => setForm({ ...form, quarantineType: e.target.value })}>
                  <option value="home">Home Quarantine</option>
                  <option value="hospital">Hospital</option>
                  <option value="quarantine_center">Quarantine Center</option>
                </select>
              </div>
              <div style={s.halfCol}>
                <label style={s.label}>Duration (days)</label>
                <input style={s.input} type="number" min="1" max="90"
                  value={form.quarantineDays}
                  onChange={e => setForm({ ...form, quarantineDays: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
          </div>
        )}

        {/* Section: Further Tests */}
        <SectionLabel>Further Tests</SectionLabel>
        <ToggleRow
          label="Are further tests required?"
          checked={form.furtherTestsRequired}
          onChange={v => setForm({ ...form, furtherTestsRequired: v, recommendedTests: v ? form.recommendedTests : [] })}
          description="Recommended tests will be visible to the patient and lab"
        />

        {form.furtherTestsRequired && (
          <div style={s.subSection}>
            <label style={s.label}>Select Tests</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {COMMON_TESTS.map(test => (
                <button key={test} type="button"
                  onClick={() => toggleTest(test)}
                  style={{
                    padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                    border: form.recommendedTests.includes(test) ? "1px solid #00d4ff" : "1px solid #333",
                    background: form.recommendedTests.includes(test) ? "#00d4ff22" : "transparent",
                    color: form.recommendedTests.includes(test) ? "#00d4ff" : "var(--color-text-secondary)",
                  }}>
                  {test}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...s.input, marginBottom: 0, flex: 1 }} placeholder="Add custom test..."
                value={form.customTest}
                onChange={e => setForm({ ...form, customTest: e.target.value })}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomTest())} />
              <button type="button" onClick={addCustomTest} style={s.secondaryBtn}>+ Add</button>
            </div>
            {form.recommendedTests.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <p style={{ color: "var(--color-text-secondary)", fontSize: 12, marginBottom: 4 }}>Selected:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {form.recommendedTests.map(t => (
                    <span key={t} style={{ ...s.badge, background: "#00d4ff22", color: "#00d4ff" }}>
                      {t}
                      <button type="button" onClick={() => toggleTest(t)}
                        style={{ background: "none", border: "none", color: "#00d4ff", cursor: "pointer",
                          marginLeft: 4, padding: 0, fontSize: 12 }}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button type="submit" style={s.btn}>Submit Diagnosis</button>
          <button type="button" onClick={onCancel} style={s.cancelBtn}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ borderLeft: "3px solid #00d4ff", paddingLeft: 10, margin: "20px 0 12px",
      color: "#00d4ff", fontWeight: 600, fontSize: 14 }}>
      {children}
    </div>
  );
}

function ToggleRow({ label, checked, onChange, description }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      background: "#0f0f1a", borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
      <div>
        <div style={{ color: "var(--color-text-primary)", fontSize: 14, fontWeight: 500 }}>{label}</div>
        {description && <div style={{ color: "var(--color-text-secondary)", fontSize: 12, marginTop: 2 }}>{description}</div>}
      </div>
      <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
        {[true, false].map(val => (
          <button key={String(val)} type="button"
            onClick={() => onChange(val)}
            style={{
              padding: "5px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer",
              border: checked === val ? "1px solid #00d4ff" : "1px solid #333",
              background: checked === val ? "#00d4ff22" : "transparent",
              color: checked === val ? "#00d4ff" : "var(--color-text-secondary)",
              fontWeight: checked === val ? 600 : 400,
            }}>
            {val ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: 860, margin: "0 auto", padding: "24px 16px" },
  heading: { color: "#00d4ff", marginBottom: 4 },
  sub: { color: "var(--color-text-secondary)", marginBottom: 24 },
  card: { background: "#1a1a2e", borderRadius: 12, padding: 24, marginBottom: 20 },
  cardTitle: { color: "#00d4ff", marginBottom: 16, fontSize: 16 },
  input: { width: "100%", padding: "9px 12px", marginBottom: 10, borderRadius: 8,
    border: "1px solid #333", background: "#0f0f1a", color: "var(--color-text-primary)",
    fontSize: 14, boxSizing: "border-box" },
  btn: { padding: "9px 20px", background: "#00d4ff", color: "#000",
    border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" },
  cancelBtn: { padding: "9px 20px", background: "transparent", border: "1px solid #555",
    color: "var(--color-text-secondary)", borderRadius: 8, cursor: "pointer" },
  secondaryBtn: { padding: "9px 16px", background: "transparent", border: "1px solid #555",
    color: "var(--color-text-secondary)", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" },
  readonlyBox: { background: "#0f0f1a", borderRadius: 8, padding: 14, marginBottom: 20,
    border: "1px solid #1e3a4a" },
  reportRow: { display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 0", borderBottom: "1px solid #222" },
  diagRow: { display: "flex", padding: "12px 0", borderBottom: "1px solid #222" },
  meta: { color: "var(--color-text-secondary)", margin: "3px 0", fontSize: 13 },
  tabs: { display: "flex", gap: 8, marginBottom: 16 },
  tab: { padding: "8px 18px", background: "transparent", border: "1px solid #333",
    color: "var(--color-text-secondary)", borderRadius: 8, cursor: "pointer" },
  tabActive: { background: "#00d4ff22", border: "1px solid #00d4ff", color: "#00d4ff", fontWeight: 600 },
  msg: { padding: 12, borderRadius: 8, marginBottom: 16 },
  row: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 4 },
  halfCol: { flex: 1, minWidth: 160 },
  label: { display: "block", color: "var(--color-text-secondary)", fontSize: 12, marginBottom: 4 },
  badge: { padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  subSection: { background: "#0f0f1a", borderRadius: 8, padding: 14, marginBottom: 12 },
};