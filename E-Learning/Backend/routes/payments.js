const express = require("express")
const Payment = require("../models/Payment")
const Course = require("../models/Course")
const User = require("../models/User")
const auth = require("../middleware/auth")
const adminAuth = require("../middleware/adminAuth")

const router = express.Router()

// Create payment intent for course purchase
router.post("/create-payment", auth, async (req, res) => {
  try {
    const { courseId, paymentMethod = "stripe" } = req.body
    const userId = req.user.userId

    // Check if course exists
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (!course.isPublished) {
      return res.status(400).json({ message: "Course is not available for purchase" })
    }

    // Check if user is already enrolled
    const user = await User.findById(userId)
    const alreadyEnrolled = user.enrolledCourses.some((enrollment) => enrollment.course.toString() === courseId)

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" })
    }

    // Check if there's already a pending payment
    const existingPayment = await Payment.findOne({
      student: userId,
      course: courseId,
      status: "pending",
    })

    if (existingPayment) {
      return res.json({
        message: "Payment already in progress",
        payment: existingPayment,
      })
    }

    // Handle free course
    if (course.price === 0) {
      const payment = new Payment({
        student: userId,
        course: courseId,
        amount: 0,
        paymentMethod: "free",
        status: "completed",
      })

      await payment.save()

      // Enroll user immediately for free courses
      user.enrolledCourses.push({
        course: courseId,
        enrolledAt: new Date(),
        progress: 0,
      })
      user.payments.push(payment._id)

      course.enrolledStudents.push({
        student: userId,
        enrolledAt: new Date(),
        progress: 0,
      })
      course.payments.push(payment._id)

      await user.save()
      await course.save()

      return res.json({
        message: "Successfully enrolled in free course",
        payment,
      })
    }

    // Create payment record for paid courses
    const payment = new Payment({
      student: userId,
      course: courseId,
      amount: course.price,
      paymentMethod,
      status: "pending",
    })

    await payment.save()

    // Here you would integrate with actual payment processors
    // For now, we'll simulate the payment process
    res.json({
      message: "Payment initiated",
      payment: {
        _id: payment._id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      },
      // In real implementation, return payment gateway specific data
      clientSecret: `pi_${payment.transactionId}_secret`, // Simulated Stripe client secret
    })
  } catch (error) {
    console.error("Create payment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Confirm payment and enroll student
router.post("/confirm-payment", auth, async (req, res) => {
  try {
    const { paymentId, paymentIntentId } = req.body
    const userId = req.user.userId

    const payment = await Payment.findById(paymentId).populate("course")

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" })
    }

    if (payment.student.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" })
    }

    if (payment.status !== "pending") {
      return res.status(400).json({ message: "Payment already processed" })
    }

    // In real implementation, verify payment with payment processor
    // For simulation, we'll mark as completed
    payment.status = "completed"
    payment.paymentIntentId = paymentIntentId
    payment.paymentDate = new Date()

    await payment.save()

    // Enroll user in course
    const user = await User.findById(userId)
    const course = await Course.findById(payment.course._id)

    user.enrolledCourses.push({
      course: payment.course._id,
      enrolledAt: new Date(),
      progress: 0,
    })
    user.payments.push(payment._id)

    course.enrolledStudents.push({
      student: userId,
      enrolledAt: new Date(),
      progress: 0,
    })
    course.payments.push(payment._id)

    await user.save()
    await course.save()

    res.json({
      message: "Payment confirmed and enrollment completed",
      payment,
      courseTitle: course.title,
    })
  } catch (error) {
    console.error("Confirm payment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user's payment history
router.get("/history", auth, async (req, res) => {
  try {
    const userId = req.user.userId
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10

    const payments = await Payment.find({ student: userId })
      .populate("course", "title thumbnail")
      .sort({ paymentDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Payment.countDocuments({ student: userId })

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get payment history error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get payment details
router.get("/:id", auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("student", "name email")
      .populate("course", "title description thumbnail instructor")

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" })
    }

    // Check access permissions
    if (
      req.user.role !== "admin" &&
      payment.student._id.toString() !== req.user.userId &&
      payment.course.instructor.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json(payment)
  } catch (error) {
    console.error("Get payment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Admin: Get all payments
router.get("/admin/all", auth, adminAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20
    const status = req.query.status || ""

    const query = {}
    if (status) {
      query.status = status
    }

    const payments = await Payment.find(query)
      .populate("student", "name email")
      .populate("course", "title price")
      .sort({ paymentDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Payment.countDocuments(query)

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get all payments error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Admin: Process refund
router.post("/:id/refund", auth, adminAuth, async (req, res) => {
  try {
    const { amount, reason } = req.body
    const payment = await Payment.findById(req.params.id).populate("course")

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" })
    }

    if (payment.status !== "completed") {
      return res.status(400).json({ message: "Can only refund completed payments" })
    }

    // Process refund
    payment.processRefund(amount, reason)
    await payment.save()

    // Remove enrollment if full refund
    if (!amount || amount >= payment.amount) {
      await User.updateOne(
        { _id: payment.student },
        { $pull: { enrolledCourses: { course: payment.course._id } } },
      )

      await Course.updateOne(
        { _id: payment.course._id },
        { $pull: { enrolledStudents: { student: payment.student } } },
      )
    }

    res.json({
      message: "Refund processed successfully",
      payment,
    })
  } catch (error) {
    console.error("Process refund error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router