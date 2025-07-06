const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// In-memory storage for development (replaces MongoDB)
let users = []
let courses = []
let quizzes = []
let enrollments = []

// Create default admin user
const createDefaultAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10)
  users.push({
    _id: "admin1",
    name: "Admin User",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
    createdAt: new Date()
  })

  // Create sample student
  const studentPassword = await bcrypt.hash("student123", 10)
  users.push({
    _id: "student1",
    name: "John Doe",
    email: "student@example.com",
    password: studentPassword,
    role: "student",
    createdAt: new Date()
  })

  console.log("✅ Default users created:")
  console.log("   Admin: admin@example.com / admin123")
  console.log("   Student: student@example.com / student123")
}

// Create sample courses
const createSampleCourses = () => {
  courses.push({
    _id: "course1",
    title: "Introduction to JavaScript",
    description: "Learn the basics of JavaScript programming",
    instructor: "admin1",
    duration: "4 weeks",
    level: "Beginner",
    price: 99.99,
    thumbnail: "https://via.placeholder.com/300x200?text=JavaScript+Course",
    lessons: [
      {
        _id: "lesson1",
        title: "Variables and Data Types",
        content: "Learn about JavaScript variables and different data types",
        duration: "30 minutes",
        videoUrl: "https://example.com/video1"
      },
      {
        _id: "lesson2", 
        title: "Functions and Scope",
        content: "Understanding functions and variable scope in JavaScript",
        duration: "45 minutes",
        videoUrl: "https://example.com/video2"
      }
    ],
    createdAt: new Date()
  })

  courses.push({
    _id: "course2",
    title: "React Fundamentals",
    description: "Build modern web applications with React",
    instructor: "admin1",
    duration: "6 weeks",
    level: "Intermediate",
    price: 149.99,
    thumbnail: "https://via.placeholder.com/300x200?text=React+Course",
    lessons: [
      {
        _id: "lesson3",
        title: "Components and JSX",
        content: "Learn about React components and JSX syntax",
        duration: "40 minutes",
        videoUrl: "https://example.com/video3"
      }
    ],
    createdAt: new Date()
  })

  console.log("✅ Sample courses created")
}

// Create sample quiz
const createSampleQuiz = () => {
  quizzes.push({
    _id: "quiz1",
    courseId: "course1",
    title: "JavaScript Basics Quiz",
    questions: [
      {
        _id: "q1",
        question: "What is the correct way to declare a variable in JavaScript?",
        options: ["var name;", "variable name;", "declare name;", "name var;"],
        correctAnswer: 0
      },
      {
        _id: "q2", 
        question: "Which of the following is a JavaScript data type?",
        options: ["string", "boolean", "number", "all of the above"],
        correctAnswer: 3
      }
    ],
    createdAt: new Date()
  })

  console.log("✅ Sample quiz created")
}

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://192.168.60.27:3000",
  "http://192.168.1.100:3000",
]

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
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
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' })
    }
    req.user = user
    next()
  })
}

// Routes

// Auth routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create user
    const newUser = {
      _id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: "student",
      createdAt: new Date()
    }
    
    users.push(newUser)
    
    // Generate token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'dev_secret_key',
      { expiresIn: '24h' }
    )

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Find user
    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'dev_secret_key',
      { expiresIn: '24h' }
    )

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

app.get("/api/auth/me", authenticateToken, (req, res) => {
  const user = users.find(u => u._id === req.user.userId)
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }
  
  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  })
})

// Course routes
app.get("/api/courses", (req, res) => {
  res.json(courses)
})

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c._id === req.params.id)
  if (!course) {
    return res.status(404).json({ message: "Course not found" })
  }
  res.json(course)
})

app.post("/api/courses/:id/enroll", authenticateToken, (req, res) => {
  const courseId = req.params.id
  const userId = req.user.userId
  
  // Check if already enrolled
  const existingEnrollment = enrollments.find(e => e.courseId === courseId && e.userId === userId)
  if (existingEnrollment) {
    return res.status(400).json({ message: "Already enrolled in this course" })
  }
  
  // Add enrollment
  enrollments.push({
    _id: Date.now().toString(),
    courseId,
    userId,
    enrolledAt: new Date(),
    progress: 0
  })
  
  res.json({ message: "Successfully enrolled in course" })
})

app.get("/api/courses/enrolled", authenticateToken, (req, res) => {
  const userEnrollments = enrollments.filter(e => e.userId === req.user.userId)
  const enrolledCourses = userEnrollments.map(enrollment => {
    const course = courses.find(c => c._id === enrollment.courseId)
    return { ...course, progress: enrollment.progress }
  })
  res.json(enrolledCourses)
})

// Quiz routes
app.get("/api/quizzes/:id", authenticateToken, (req, res) => {
  const quiz = quizzes.find(q => q._id === req.params.id)
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" })
  }
  res.json(quiz)
})

// User routes
app.get("/api/users", authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Admin access required" })
  }
  
  const userList = users.map(u => ({
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt
  }))
  
  res.json(userList)
})

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 LMS API Server is running! (Development Mode)",
    version: "1.0.0-dev",
    timestamp: new Date().toISOString(),
    mode: "development",
    database: "in-memory"
  })
})

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: "in-memory (development)",
    users: users.length,
    courses: courses.length,
    enrollments: enrollments.length
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack)
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

// Initialize sample data and start server
const startServer = async () => {
  try {
    await createDefaultAdmin()
    createSampleCourses()
    createSampleQuiz()
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Development Server is running on port ${PORT}`)
      console.log(`📊 Environment: development`)
      console.log(`🌐 API URL: http://localhost:${PORT}`)
      console.log(`💾 Database: In-memory storage (development mode)`)
      console.log(`✅ Sample data loaded`)
      console.log(`🔑 Test Accounts:`)
      console.log(`   👤 Admin: admin@example.com / admin123`)
      console.log(`   👤 Student: student@example.com / student123`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()

module.exports = app