const express = require("express")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// Admin role-check middleware
function isAdmin(req, res, next) {
  User.findById(req.userId)
    .then((user) => {
      if (user && user.role === "admin") {
        next()
      } else {
        res.status(403).json({ message: "Admin access required" })
      }
    })
    .catch(() => res.status(403).json({ message: "Admin access required" }))
}

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("enrolledCourses.course", "title instructor thumbnail")
      .populate("certificates.course", "title")

    res.json(user)
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, preferences } = req.body

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (name) user.name = name
    if (preferences) user.preferences = { ...user.preferences, ...preferences }

    await user.save()

    res.json({ message: "Profile updated successfully", user })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user's enrolled courses
router.get("/courses", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "enrolledCourses.course",
      populate: {
        path: "instructor",
        select: "name",
      },
    })

    res.json(user.enrolledCourses)
  } catch (error) {
    console.error("Get enrolled courses error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Register new user
router.post("/register", async (req, res) => {
  try {
    // Log incoming data for debugging
    console.log("Register request body:", req.body)

    // Only allow role=admin if the requester is an admin (for security)
    let role = req.body.role
    if (role === "admin") {
      // Only allow if an admin is creating the user (optional: check req.userId)
      return res.status(403).json({ message: "Cannot create admin user directly" })
    }
    // Default role is student
    if (!role) role = "student"

    const user = new User({ ...req.body, role })
    await user.save()
    res.status(201).json(user)
  } catch (err) {
    // Log error for debugging
    console.error("User registration error:", err)
    res.status(400).json({ message: err.message })
  }
})

// Example admin-only route
router.get("/admin/users", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
