const express = require("express")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

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

module.exports = router
