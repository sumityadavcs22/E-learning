const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "razorpay", "manual", "free"],
      required: true,
    },
    paymentIntentId: {
      type: String, // For Stripe payment intent ID
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "cancelled"],
      default: "pending",
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    refundDate: {
      type: Date,
    },
    refundAmount: {
      type: Number,
      min: 0,
    },
    refundReason: {
      type: String,
    },
    metadata: {
      discountCode: String,
      discountAmount: Number,
      originalPrice: Number,
      taxes: Number,
      processingFee: Number,
    },
    invoice: {
      number: String,
      issueDate: Date,
      dueDate: Date,
      url: String,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
paymentSchema.index({ student: 1 })
paymentSchema.index({ course: 1 })
paymentSchema.index({ transactionId: 1 })
paymentSchema.index({ status: 1 })
paymentSchema.index({ paymentDate: -1 })

// Generate unique transaction ID
paymentSchema.pre("save", function (next) {
  if (!this.transactionId) {
    this.transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }

  // Generate invoice number if payment is completed
  if (this.status === "completed" && !this.invoice.number) {
    this.invoice.number = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    this.invoice.issueDate = new Date()
  }

  next()
})

// Method to mark payment as completed
paymentSchema.methods.markCompleted = function () {
  this.status = "completed"
  this.paymentDate = new Date()
  if (!this.invoice.number) {
    this.invoice.number = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    this.invoice.issueDate = new Date()
  }
}

// Method to process refund
paymentSchema.methods.processRefund = function (amount, reason) {
  this.status = "refunded"
  this.refundDate = new Date()
  this.refundAmount = amount || this.amount
  this.refundReason = reason
}

// Static method to generate transaction ID
paymentSchema.statics.generateTransactionId = function () {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

module.exports = mongoose.model("Payment", paymentSchema)