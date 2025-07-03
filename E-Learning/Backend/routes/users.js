const express = require("express")
const User = require("../models/User")
const Course = require("../models/Course")
const auth = require("../middleware/auth")
const adminAuth = require("../middleware/adminAuth")

const router = express.Router()

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get("/", adminAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const search = req.query.search || ""
    const role = req.query.role || ""

    // Build query
    const query = {}
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
    }
    if (role) {
      query.role = role
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("enrolledCourses.course", "title")

    const total = await User.countDocuments(query)

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/users/stats
// @desc    Get user statistics (Admin only)
// @access  Private/Admin
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalStudents = await User.countDocuments({ role: "student" })
    const totalInstructors = await User.countDocuments({ role: "instructor" })
    const totalAdmins = await User.countDocuments({ role: "admin" })
    const activeUsers = await User.countDocuments({ isActive: true })

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    })

    res.json({
      totalUsers,
      totalStudents,
      totalInstructors,
      totalAdmins,
      activeUsers,
      recentRegistrations,
    })
  } catch (error) {
    console.error("Get user stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("enrolledCourses.course", "title thumbnail instructor")
      .populate("certificates.course", "title")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Only allow users to view their own profile or admins to view any profile
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/users/:id
// @desc    Update user (Admin only)
// @access  Private/Admin
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update fields
    if (name) user.name = name
    if (email) user.email = email
    if (role) user.role = role
    if (isActive !== undefined) user.isActive = isActive

    await user.save()

    const updatedUser = await User.findById(user._id).select("-password")

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Update user error:", error)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" })
    }
    res.status(500).json({ message: "Server error" })
  }
})

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private/Admin
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Don't allow deleting the last admin
    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" })
      if (adminCount <= 1) {
        return res.status(400).json({ message: "Cannot delete the last admin user" })
      }
    }

    await User.findByIdAndDelete(req.params.id)

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/users/:id/enroll/:courseId
// @desc    Enroll user in course
// @access  Private
router.post("/:id/enroll/:courseId", auth, async (req, res) => {
  try {
    // Only allow users to enroll themselves or admins to enroll anyone
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    const user = await User.findById(req.params.id)
    const course = await Course.findById(req.params.courseId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
      (enrollment) => enrollment.course.toString() === req.params.courseId,
    )

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "User already enrolled in this course" })
    }

    // Add to user's enrolled courses
    user.enrolledCourses.push({
      course: req.params.courseId,
      enrolledAt: new Date(),
      progress: 0,
    })

    // Add to course's enrolled students
    course.enrolledStudents.push(req.params.id)

    await user.save()
    await course.save()

    res.json({ message: "Successfully enrolled in course" })
  } catch (error) {
    console.error("Enroll user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
