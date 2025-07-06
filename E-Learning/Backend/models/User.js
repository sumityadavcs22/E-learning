const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    avatar: {
      type: String,
      default: "",
    },
    enrolledCourses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
        progress: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        completedLessons: [
          {
            type: mongoose.Schema.Types.ObjectId,
          },
        ],
        lastAccessed: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    achievements: [
      {
        title: String,
        description: String,
        earnedAt: {
          type: Date,
          default: Date.now,
        },
        icon: String,
      },
    ],
    certificates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Certificate",
      },
    ],
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
        courseUpdates: {
          type: Boolean,
          default: true,
        },
        achievements: {
          type: Boolean,
          default: true,
        },
      },
      language: {
        type: String,
        default: "en",
      },
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ "enrolledCourses.course": 1 })

// Virtual for enrolled courses count
userSchema.virtual("enrolledCoursesCount").get(function () {
  return this.enrolledCourses.length
})

// Method to check if user is enrolled in a course
userSchema.methods.isEnrolledIn = function (courseId) {
  return this.enrolledCourses.some((enrollment) => enrollment.course.toString() === courseId.toString())
}

// Method to get course progress
userSchema.methods.getCourseProgress = function (courseId) {
  const enrollment = this.enrolledCourses.find((enrollment) => enrollment.course.toString() === courseId.toString())
  return enrollment ? enrollment.progress : 0
}

// Method to update course progress
userSchema.methods.updateCourseProgress = function (courseId, progress) {
  const enrollment = this.enrolledCourses.find((enrollment) => enrollment.course.toString() === courseId.toString())
  if (enrollment) {
    enrollment.progress = Math.min(100, Math.max(0, progress))
    enrollment.lastAccessed = new Date()
  }
}

module.exports = mongoose.model("User", userSchema)
