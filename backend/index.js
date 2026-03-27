require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: "https://medilbridge-1.onrender.com",   // Change this if your Render URL changes
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/register", require("./routes/registerRoutes"));
app.use("/api/lab", require("./routes/labRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));
app.use("/api/patient", require("./routes/patientRoutes"));
app.use("/api/gov", require("./routes/govRoutes"));

// =============== SERVE REACT FRONTEND ===============
// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// SPA Fallback Route - This is very important for React Router
// All unknown routes will serve index.html so React can handle routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Frontend is being served from: ${path.join(__dirname, "../frontend/dist")}`);
});
