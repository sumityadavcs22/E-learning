const express = require("express")
const Course = require("../models/Course")
const User = require("../models/User")
const auth = require("../middleware/auth")
const adminAuth = require("../middleware/adminAuth")

const router = express.Router()

// Get all courses
router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 12
    const search = req.query.search || ""
    const category = req.query.category || ""
    const level = req.query.level || ""
    const sortBy = req.query.sortBy || "createdAt"
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

    // Build query
    const query = { isPublished: true }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }
    if (category) {
      query.category = category
    }
    if (level) {
      query.level = level
    }

    const courses = await Course.find(query)
      .populate("instructor", "name avatar")
      .sort({ [sortBy]: sortOrder })
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

// Get user's enrolled courses
router.get("/enrolled", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "enrolledCourses.course",
      populate: {
        path: "instructor",
        select: "name avatar bio",
      },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user.enrolledCourses)
  } catch (error) {
    console.error("Get enrolled courses error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name avatar bio")
      .populate("ratings.user", "name avatar")

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    res.json(course)
  } catch (error) {
    console.error("Get course error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new course (Admin/Instructor only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "instructor") {
      return res.status(403).json({ message: "Access denied. Instructor or Admin privileges required." })
    }

    const { title, description, thumbnail, category, level, price, tags, requirements, whatYouWillLearn, lessons } =
      req.body

    const course = new Course({
      title,
      description,
      thumbnail,
      instructor: req.user.id,
      category,
      level,
      price,
      tags,
      requirements,
      whatYouWillLearn,
      lessons: lessons || [],
    })

    // Calculate total duration
    course.updateDuration()

    await course.save()

    const populatedCourse = await Course.findById(course._id).populate("instructor", "name avatar")

    res.status(201).json({
      message: "Course created successfully",
      course: populatedCourse,
    })
  } catch (error) {
    console.error("Create course error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update course (Admin/Course Instructor only)
router.put("/:id", auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Check if user is admin or course instructor
    if (req.user.role !== "admin" && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" })
    }

    const {
      title,
      description,
      thumbnail,
      category,
      level,
      price,
      tags,
      requirements,
      whatYouWillLearn,
      lessons,
      isPublished,
    } = req.body

    // Update fields
    if (title) course.title = title
    if (description) course.description = description
    if (thumbnail) course.thumbnail = thumbnail
    if (category) course.category = category
    if (level) course.level = level
    if (price !== undefined) course.price = price
    if (tags) course.tags = tags
    if (requirements) course.requirements = requirements
    if (whatYouWillLearn) course.whatYouWillLearn = whatYouWillLearn
    if (lessons) course.lessons = lessons
    if (isPublished !== undefined) course.isPublished = isPublished

    // Update duration if lessons changed
    if (lessons) {
      course.updateDuration()
    }

    await course.save()

    const updatedCourse = await Course.findById(course._id).populate("instructor", "name avatar")

    res.json({
      message: "Course updated successfully",
      course: updatedCourse,
    })
  } catch (error) {
    console.error("Update course error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete course (Admin/Course Instructor only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Check if user is admin or course instructor
    if (req.user.role !== "admin" && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" })
    }

    // Remove course from all enrolled users
    await User.updateMany(
      { "enrolledCourses.course": req.params.id },
      { $pull: { enrolledCourses: { course: req.params.id } } },
    )

    await Course.findByIdAndDelete(req.params.id)

    res.json({ message: "Course deleted successfully" })
  } catch (error) {
    console.error("Delete course error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Enroll in a course
router.post("/:id/enroll", auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    const user = await User.findById(req.user.id)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (!course.isPublished) {
      return res.status(400).json({ message: "Course is not published" })
    }

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
    course.enrolledStudents.push(req.user.id)

    await user.save()
    await course.save()

    res.json({ message: "Successfully enrolled in course" })
  } catch (error) {
    console.error("Enroll course error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Rate a course
router.post("/:id/rate", auth, async (req, res) => {
  try {
    const { rating, review } = req.body
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" })
    }

    // Check if user is enrolled
    const user = await User.findById(req.user.id)
    const isEnrolled = user.enrolledCourses.some((enrollment) => enrollment.course.toString() === req.params.id)

    if (!isEnrolled) {
      return res.status(400).json({ message: "You must be enrolled to rate this course" })
    }

    // Check if user already rated
    const existingRatingIndex = course.ratings.findIndex((r) => r.user.toString() === req.user.id)

    if (existingRatingIndex > -1) {
      // Update existing rating
      course.ratings[existingRatingIndex].rating = rating
      course.ratings[existingRatingIndex].review = review
    } else {
      // Add new rating
      course.ratings.push({
        user: req.user.id,
        rating,
        review,
      })
    }

    // Recalculate average rating
    course.calculateAverageRating()

    await course.save()

    res.json({ message: "Rating submitted successfully" })
  } catch (error) {
    console.error("Rate course error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
