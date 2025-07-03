const mongoose = require("mongoose")

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Lesson title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Lesson content is required"],
  },
  videoUrl: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number, // in minutes
    default: 0,
  },
  order: {
    type: Number,
    required: true,
  },
  isPreview: {
    type: Boolean,
    default: false,
  },
  resources: [
    {
      title: String,
      url: String,
      type: {
        type: String,
        enum: ["pdf", "video", "link", "document"],
        default: "link",
      },
    },
  ],
})

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Programming",
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Machine Learning",
        "Design",
        "Business",
        "Marketing",
        "Photography",
        "Music",
        "Language",
        "Other",
      ],
    },
    level: {
      type: String,
      required: [true, "Level is required"],
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    lessons: [lessonSchema],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    whatYouWillLearn: [
      {
        type: String,
        trim: true,
      },
    ],
    enrolledStudents: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
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
      },
    ],
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        review: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    totalDuration: {
      type: Number, // in minutes
      default: 0,
    },
    language: {
      type: String,
      default: "English",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
courseSchema.index({ title: "text", description: "text" })
courseSchema.index({ category: 1 })
courseSchema.index({ level: 1 })
courseSchema.index({ isPublished: 1 })
courseSchema.index({ averageRating: -1 })
courseSchema.index({ createdAt: -1 })

// Virtual for enrolled students count
courseSchema.virtual("enrolledCount").get(function () {
  return this.enrolledStudents.length
})

// Virtual for lessons count
courseSchema.virtual("lessonsCount").get(function () {
  return this.lessons.length
})

// Method to calculate average rating
courseSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0
    this.totalRatings = 0
    return
  }

  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0)
  this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10
  this.totalRatings = this.ratings.length
}

// Method to calculate total duration
courseSchema.methods.calculateTotalDuration = function () {
  this.totalDuration = this.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0)
}

// Pre-save middleware to update calculated fields
courseSchema.pre("save", function (next) {
  this.calculateAverageRating()
  this.calculateTotalDuration()
  this.lastUpdated = new Date()

  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date()
  }

  next()
})

// Method to check if user is enrolled
courseSchema.methods.isUserEnrolled = function (userId) {
  return this.enrolledStudents.some((enrollment) => enrollment.student.toString() === userId.toString())
}

// Method to get user's progress
courseSchema.methods.getUserProgress = function (userId) {
  const enrollment = this.enrolledStudents.find((enrollment) => enrollment.student.toString() === userId.toString())
  return enrollment ? enrollment.progress : 0
}

module.exports = mongoose.model("Course", courseSchema)
