const mongoose = require("mongoose")

const certificateSchema = new mongoose.Schema(
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
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    certificateId: {
      type: String,
      unique: true,
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    completionDate: {
      type: Date,
      required: true,
    },
    grade: {
      type: String,
      enum: ["A+", "A", "B+", "B", "C+", "C", "Pass"],
      default: "Pass",
    },
    scorePercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    verificationHash: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    metadata: {
      courseDuration: Number, // in hours
      totalLessons: Number,
      completedLessons: Number,
      finalQuizScore: Number,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
certificateSchema.index({ certificateId: 1 })
certificateSchema.index({ student: 1 })
certificateSchema.index({ course: 1 })
certificateSchema.index({ verificationHash: 1 })

// Generate unique certificate ID
certificateSchema.pre("save", function (next) {
  if (!this.certificateId) {
    this.certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }

  if (!this.verificationHash) {
    const crypto = require("crypto")
    const data = `${this.student}-${this.course}-${this.issuedAt}-${this.certificateId}`
    this.verificationHash = crypto.createHash("sha256").update(data).digest("hex")
  }

  next()
})

// Method to verify certificate authenticity
certificateSchema.methods.verify = function () {
  const crypto = require("crypto")
  const data = `${this.student}-${this.course}-${this.issuedAt}-${this.certificateId}`
  const expectedHash = crypto.createHash("sha256").update(data).digest("hex")
  return this.verificationHash === expectedHash && this.isValid
}

// Static method to generate certificate ID
certificateSchema.statics.generateCertificateId = function () {
  return `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

module.exports = mongoose.model("Certificate", certificateSchema)