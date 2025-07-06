const express = require("express")
const Certificate = require("../models/Certificate")
const Course = require("../models/Course")
const User = require("../models/User")
const Quiz = require("../models/Quiz")
const auth = require("../middleware/auth")
const adminAuth = require("../middleware/adminAuth")

const router = express.Router()

// Issue certificate for course completion
router.post("/issue", auth, async (req, res) => {
  try {
    const { courseId, studentId } = req.body
    const issuerId = req.user.userId

    // If studentId is provided (admin issuing), use it; otherwise use current user
    const targetStudentId = studentId || issuerId

    // Check permissions
    if (studentId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can issue certificates for other users" })
    }

    const course = await Course.findById(courseId).populate("instructor")
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    const student = await User.findById(targetStudentId)
    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    // Check if student is enrolled
    const enrollment = student.enrolledCourses.find((e) => e.course.toString() === courseId)
    if (!enrollment) {
      return res.status(400).json({ message: "Student is not enrolled in this course" })
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      student: targetStudentId,
      course: courseId,
    })

    if (existingCertificate) {
      return res.status(400).json({ message: "Certificate already issued for this course" })
    }

    // Get quiz score if quiz exists
    let quizScore = null
    const quiz = await Quiz.findOne({ course: courseId })
    if (quiz) {
      // You would typically get this from quiz results
      // For now, we'll check if quiz is completed
      quizScore = 85 // Placeholder - implement actual quiz score retrieval
    }

    // Check completion criteria
    const eligibility = course.isEligibleForCertificate(targetStudentId, enrollment.progress, quizScore)
    if (!eligibility.eligible) {
      return res.status(400).json({ message: `Certificate not eligible: ${eligibility.reason}` })
    }

    // Calculate grade based on progress and quiz score
    let grade = "Pass"
    let scorePercentage = enrollment.progress

    if (quizScore) {
      scorePercentage = Math.round((enrollment.progress * 0.7 + quizScore * 0.3))
    }

    if (scorePercentage >= 95) grade = "A+"
    else if (scorePercentage >= 90) grade = "A"
    else if (scorePercentage >= 85) grade = "B+"
    else if (scorePercentage >= 80) grade = "B"
    else if (scorePercentage >= 75) grade = "C+"
    else if (scorePercentage >= 70) grade = "C"

    // Create certificate
    const certificate = new Certificate({
      student: targetStudentId,
      course: courseId,
      instructor: course.instructor._id,
      completionDate: new Date(),
      grade,
      scorePercentage,
      skills: course.whatYouWillLearn || [],
      metadata: {
        courseDuration: Math.round(course.totalDuration / 60), // Convert to hours
        totalLessons: course.lessons.length,
        completedLessons: course.lessons.length, // Assuming all lessons completed
        finalQuizScore: quizScore,
      },
    })

    await certificate.save()

    // Update user and course
    student.certificates.push(certificate._id)
    course.certificatesIssued.push(certificate._id)

    await student.save()
    await course.save()

    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate("student", "name email")
      .populate("course", "title description")
      .populate("instructor", "name")

    res.status(201).json({
      message: "Certificate issued successfully",
      certificate: populatedCertificate,
    })
  } catch (error) {
    console.error("Issue certificate error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user's certificates
router.get("/my-certificates", auth, async (req, res) => {
  try {
    const userId = req.user.userId

    const certificates = await Certificate.find({ student: userId })
      .populate("course", "title description thumbnail")
      .populate("instructor", "name")
      .sort({ issuedAt: -1 })

    res.json(certificates)
  } catch (error) {
    console.error("Get certificates error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get certificate by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate("student", "name email")
      .populate("course", "title description thumbnail instructor")
      .populate("instructor", "name email")

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" })
    }

    // Check access permissions
    if (
      req.user.role !== "admin" &&
      certificate.student._id.toString() !== req.user.userId &&
      certificate.instructor._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json(certificate)
  } catch (error) {
    console.error("Get certificate error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Verify certificate by certificate ID
router.get("/verify/:certificateId", async (req, res) => {
  try {
    const { certificateId } = req.params

    const certificate = await Certificate.findOne({ certificateId })
      .populate("student", "name")
      .populate("course", "title")
      .populate("instructor", "name")

    if (!certificate) {
      return res.status(404).json({
        valid: false,
        message: "Certificate not found",
      })
    }

    const isValid = certificate.verify()

    res.json({
      valid: isValid,
      certificate: isValid
        ? {
            certificateId: certificate.certificateId,
            studentName: certificate.student.name,
            courseTitle: certificate.course.title,
            instructorName: certificate.instructor.name,
            issuedAt: certificate.issuedAt,
            completionDate: certificate.completionDate,
            grade: certificate.grade,
            scorePercentage: certificate.scorePercentage,
          }
        : null,
      message: isValid ? "Certificate is valid" : "Certificate verification failed",
    })
  } catch (error) {
    console.error("Verify certificate error:", error)
    res.status(500).json({
      valid: false,
      message: "Verification failed",
    })
  }
})

// Check if user is eligible for certificate
router.get("/check-eligibility/:courseId", auth, async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.user.userId

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    const user = await User.findById(userId)
    const enrollment = user.enrolledCourses.find((e) => e.course.toString() === courseId)

    if (!enrollment) {
      return res.json({
        eligible: false,
        reason: "Not enrolled in this course",
        progress: 0,
      })
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      student: userId,
      course: courseId,
    })

    if (existingCertificate) {
      return res.json({
        eligible: false,
        reason: "Certificate already issued",
        progress: enrollment.progress,
        certificateId: existingCertificate.certificateId,
      })
    }

    // Get quiz score if needed
    let quizScore = null
    if (course.completionCriteria.requireQuizCompletion) {
      // Implement quiz score retrieval
      quizScore = 85 // Placeholder
    }

    const eligibility = course.isEligibleForCertificate(userId, enrollment.progress, quizScore)

    res.json({
      eligible: eligibility.eligible,
      reason: eligibility.reason,
      progress: enrollment.progress,
      requirements: {
        minimumProgress: course.completionCriteria.minimumProgress,
        requireQuizCompletion: course.completionCriteria.requireQuizCompletion,
        minimumQuizScore: course.completionCriteria.minimumQuizScore,
        currentQuizScore: quizScore,
      },
    })
  } catch (error) {
    console.error("Check eligibility error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Admin: Get all certificates
router.get("/admin/all", auth, adminAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20
    const courseId = req.query.courseId || ""

    const query = {}
    if (courseId) {
      query.course = courseId
    }

    const certificates = await Certificate.find(query)
      .populate("student", "name email")
      .populate("course", "title")
      .populate("instructor", "name")
      .sort({ issuedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Certificate.countDocuments(query)

    res.json({
      certificates,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get all certificates error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Admin: Revoke certificate
router.post("/:id/revoke", auth, adminAuth, async (req, res) => {
  try {
    const { reason } = req.body
    const certificate = await Certificate.findById(req.params.id)

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" })
    }

    certificate.isValid = false
    certificate.metadata.revocationReason = reason
    certificate.metadata.revokedAt = new Date()
    certificate.metadata.revokedBy = req.user.userId

    await certificate.save()

    res.json({
      message: "Certificate revoked successfully",
      certificate,
    })
  } catch (error) {
    console.error("Revoke certificate error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Bulk issue certificates for course
router.post("/bulk-issue/:courseId", auth, adminAuth, async (req, res) => {
  try {
    const { courseId } = req.params

    const course = await Course.findById(courseId).populate("instructor")
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Get all eligible students
    const eligibleStudents = []
    for (const enrollment of course.enrolledStudents) {
      const student = await User.findById(enrollment.student)
      if (!student) continue

      // Check if certificate already exists
      const existingCertificate = await Certificate.findOne({
        student: enrollment.student,
        course: courseId,
      })

      if (existingCertificate) continue

      const eligibility = course.isEligibleForCertificate(enrollment.student, enrollment.progress, 85)
      if (eligibility.eligible) {
        eligibleStudents.push(enrollment.student)
      }
    }

    // Issue certificates for eligible students
    const certificates = []
    for (const studentId of eligibleStudents) {
      const certificate = new Certificate({
        student: studentId,
        course: courseId,
        instructor: course.instructor._id,
        completionDate: new Date(),
        grade: "Pass",
        scorePercentage: 100,
        skills: course.whatYouWillLearn || [],
        metadata: {
          courseDuration: Math.round(course.totalDuration / 60),
          totalLessons: course.lessons.length,
          completedLessons: course.lessons.length,
        },
      })

      await certificate.save()
      certificates.push(certificate._id)

      // Update user and course
      await User.findByIdAndUpdate(studentId, { $push: { certificates: certificate._id } })
      await Course.findByIdAndUpdate(courseId, { $push: { certificatesIssued: certificate._id } })
    }

    res.json({
      message: `Issued ${certificates.length} certificates`,
      certificatesIssued: certificates.length,
      totalEligible: eligibleStudents.length,
    })
  } catch (error) {
    console.error("Bulk issue certificates error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router