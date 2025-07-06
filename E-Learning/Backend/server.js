const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// CORS configuration - Allow multiple origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://192.168.60.27:3000",
  "http://192.168.1.100:3000", // Add your local IP
  // Add more IPs as needed
]

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        console.log(`CORS blocked origin: ${origin}`)
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get("Origin")}`)
  next()
})

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/courses", require("./routes/courses"))
app.use("/api/users", require("./routes/users"))
app.use("/api/quizzes", require("./routes/quizzes"))
app.use("/api/payments", require("./routes/payments"))
app.use("/api/certificates", require("./routes/certificates"))

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"))
  })
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/lms", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully")
    console.log(`Database: ${mongoose.connection.name}`)
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "LMS API Server is running!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  })
})

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack)

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((error) => error.message)
    return res.status(400).json({ message: messages.join(", ") })
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({ message: `${field} already exists` })
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" })
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" })
  }

  // Default error
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  })
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed")
    process.exit(0)
  })
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🌐 API URL: http://localhost:${PORT}`)
  console.log(`🌐 Network API URL: http://192.168.60.27:${PORT}`)
  console.log(`✅ Allowed CORS origins:`, allowedOrigins)
})

module.exports = app
