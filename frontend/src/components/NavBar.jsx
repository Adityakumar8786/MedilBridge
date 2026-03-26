import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import en from "../i18n/en";
import hi from "../i18n/hi";

export default function Navbar({ lang, setLang }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const t = lang === "hi" ? hi : en;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🏥 MedilBridge</Link>
      <div style={styles.right}>
        {user && <span style={styles.roleTag}>{user.role.toUpperCase()}</span>}
        <button onClick={() => setLang(lang === "en" ? "hi" : "en")} style={styles.langBtn}>
          {lang === "en" ? "हिंदी" : "English"}
        </button>
        {user ? (
          <button onClick={handleLogout} style={styles.btn}>{t.logout}</button>
        ) : (
          <Link to="/login" style={styles.btn}>{t.login}</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 24px", background: "#1a1a2e", color: "#fff" },
  brand: { color: "#00d4ff", fontWeight: 700, fontSize: 20, textDecoration: "none" },
  right: { display: "flex", gap: 12, alignItems: "center" },
  roleTag: { background: "#00d4ff22", color: "#00d4ff", padding: "2px 10px",
    borderRadius: 20, fontSize: 12, fontWeight: 600 },
  langBtn: { background: "transparent", border: "1px solid #555", color: "#ccc",
    padding: "4px 12px", borderRadius: 6, cursor: "pointer" },
  btn: { background: "#00d4ff", color: "#000", padding: "6px 16px",
    borderRadius: 6, textDecoration: "none", border: "none", cursor: "pointer", fontWeight: 600 },
};