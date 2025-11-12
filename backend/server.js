// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/auth", require("./routes/passwordReset"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api", require("./routes/tasks"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running", timestamp: new Date().toISOString() });
});

// ✅ Serve frontend build in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/build");
  
  // Check if the build directory exists
  if (require('fs').existsSync(frontendPath)) {
    app.use(express.static(frontendPath));

    // For any route not handled by API, serve index.html
    app.get("/*", (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  } else {
    console.log("⚠️  Frontend build directory not found. Skipping static file serving.");
  }
} else {
  // Development route handler for undefined API routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({ 
      message: "API endpoint not found",
      endpoint: req.originalUrl 
    });
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);