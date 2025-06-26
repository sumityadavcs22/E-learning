const express = require("express")
const Course = require("../models/Course")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// Get all courses
router.get("/", async (req, res) => {
  try {
    const { category, level, search, page = 1, limit = 12 } = req.query

    const query = { isPublished: true }

    // Add filters
    if (category) query.category = category
    if (level) query.level = level
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const courses = await Course.find(query)
      .populate("instructor", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Course.countDocuments(query)

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get courses error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single course
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("reviews.user", "name")

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    res.json(course)
  } catch (error) {
    console.error("Get course error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Enroll in course
router.post("/:id/enroll", auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    const user = await User.findById(req.userId)

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some((enrollment) => enrollment.course.toString() === req.params.id)

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" })
    }

    // Add to user's enrolled courses
    user.enrolledCourses.push({
      course: req.params.id,
      enrolledAt: new Date(),
      progress: 0,
    })

    // Add to course's enrolled students
    course.enrolledStudents.push(req.userId)

    await user.save()
    await course.save()

    res.json({ message: "Successfully enrolled in course" })
  } catch (error) {
    console.error("Enroll error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add course review
router.post("/:id/review", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Check if user already reviewed
    const existingReview = course.reviews.find((review) => review.user.toString() === req.userId)

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this course" })
    }

    // Add review
    course.reviews.push({
      user: req.userId,
      rating,
      comment,
    })

    // Update average rating
    const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0)
    course.rating.average = totalRating / course.reviews.length
    course.rating.count = course.reviews.length

    await course.save()

    res.json({ message: "Review added successfully" })
  } catch (error) {
    console.error("Add review error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
