require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: "https://medilbridge-1.onrender.com/",
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
});
