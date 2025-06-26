const mongoose = require("mongoose")

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  videoUrl: String,
  duration: Number, // in minutes
  resources: [
    {
      title: String,
      url: String,
      type: {
        type: String,
        enum: ["pdf", "link", "video", "document"],
      },
    },
  ],
  order: {
    type: Number,
    required: true,
  },
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
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Programming", "Design", "Business", "Marketing", "Data Science", "Other"],
    },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    thumbnail: {
      type: String,
      required: true,
    },
    lessons: [lessonSchema],
    totalDuration: {
      type: Number,
      default: 0, // in minutes
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
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
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    requirements: [String],
    whatYouWillLearn: [String],
  },
  {
    timestamps: true,
  },
)

// Calculate total duration before saving
courseSchema.pre("save", function (next) {
  if (this.lessons && this.lessons.length > 0) {
    this.totalDuration = this.lessons.reduce((total, lesson) => {
      return total + (lesson.duration || 0)
    }, 0)
  }
  next()
})

module.exports = mongoose.model("Course", courseSchema)
