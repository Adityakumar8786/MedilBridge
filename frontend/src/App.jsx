import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import LabDashboard from "./pages/LabDashboard";
import GovDashboard from "./pages/GovDashboard";
import Register from "./pages/Register";

function RoleRedirect() {
  const { user } = useAuth();
  const roleRoutes = {
    patient: "/patient",
    doctor: "/doctor",
    lab: "/lab",
    government: "/government",
  };
  if (!user) return <Navigate to="/login" />;
  return <Navigate to={roleRoutes[user.role] || "/login"} />;
}

function AppContent() {
  const [lang, setLang] = useState("en");

  return (
    <BrowserRouter>
      <Navbar lang={lang} setLang={setLang} />
      <div style={{ background: "#0f0f1a", minHeight: "calc(100vh - 56px)", color: "#fff" }}>
        <Routes>
          <Route path="/" element={<RoleRedirect />} />
          <Route path="/login" element={<Login lang={lang} />} />
          <Route path="/patient" element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDashboard lang={lang} />
            </ProtectedRoute>
          } />
          <Route path="/doctor" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard lang={lang} />
            </ProtectedRoute>
          } />
          <Route path="/lab" element={
            <ProtectedRoute allowedRoles={["lab"]}>
              <LabDashboard lang={lang} />
            </ProtectedRoute>
          } />

          <Route path="/register" element={<Register />} />
          
          <Route path="/government" element={
            <ProtectedRoute allowedRoles={["government"]}>
              <GovDashboard lang={lang} />
            </ProtectedRoute>
          } />
          <Route path="/unauthorized" element={
            <div style={{ padding: 60, textAlign: "center", color: "#ff4444" }}>
              <h2>🚫 Access Denied</h2>
              <p>You do not have permission to view this page.</p>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}