const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "student" } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role === "admin" ? "admin" : "student",
    })

    await user.save()

    // Generate JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "fallback_secret_key", {
      expiresIn: "7d",
    })

    // Return user data (without password)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userData,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" })
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "fallback_secret_key", {
      expiresIn: "7d",
    })

    // Return user data (without password)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      enrolledCourses: user.enrolledCourses,
      achievements: user.achievements,
    }

    res.json({
      message: "Login successful",
      token,
      user: userData,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("enrolledCourses.course", "title description thumbnail")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, email, preferences } = req.body
    const userId = req.user.userId

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() })
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" })
      }
      user.email = email.toLowerCase()
    }

    if (name) user.name = name
    if (preferences) user.preferences = { ...user.preferences, ...preferences }

    await user.save()

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferences: user.preferences,
    }

    res.json({
      message: "Profile updated successfully",
      user: userData,
    })
  } catch (error) {
    console.error("Profile update error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Change password
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const userId = req.user.userId

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide current and new password" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)

    await user.save()

    res.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Password change error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create test users (development only)
router.post("/create-test-users", async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ message: "Not allowed in production" })
    }

    // Check if test users already exist
    const existingAdmin = await User.findOne({ email: "admin@test.com" })
    const existingStudent = await User.findOne({ email: "student@test.com" })

    if (existingAdmin && existingStudent) {
      return res.json({ message: "Test users already exist" })
    }

    const salt = await bcrypt.genSalt(10)

    const testUsers = []

    if (!existingAdmin) {
      const adminUser = new User({
        name: "Test Admin",
        email: "admin@test.com",
        password: await bcrypt.hash("admin123", salt),
        role: "admin",
      })
      await adminUser.save()
      testUsers.push("admin@test.com")
    }

    if (!existingStudent) {
      const studentUser = new User({
        name: "Test Student",
        email: "student@test.com",
        password: await bcrypt.hash("student123", salt),
        role: "student",
      })
      await studentUser.save()
      testUsers.push("student@test.com")
    }

    res.json({
      message: "Test users created successfully",
      users: testUsers,
      credentials: {
        admin: { email: "admin@test.com", password: "admin123" },
        student: { email: "student@test.com", password: "student123" },
      },
    })
  } catch (error) {
    console.error("Create test users error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
