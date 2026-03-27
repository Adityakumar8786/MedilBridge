require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const app = express();

// =============== CORS CONFIGURATION ===============
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "https://medilbridge-1.onrender.com",   // Your current Render service URL
      "http://localhost:5173",                // Vite default for local dev
      "http://localhost:3000",                // Common React port
      "http://127.0.0.1:5173"
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============== API ROUTES ===============
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/register", require("./routes/registerRoutes"));
app.use("/api/lab", require("./routes/labRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));
app.use("/api/patient", require("./routes/patientRoutes"));
app.use("/api/gov", require("./routes/govRoutes"));

// =============== SERVE REACT FRONTEND ===============
// Serve static files from React/Vite build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// SPA Fallback - Critical for React Router (login, signup, dashboard etc.)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// =============== GLOBAL ERROR HANDLER ===============
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`Frontend served from: ${path.join(__dirname, "../frontend/dist")}`);
});
