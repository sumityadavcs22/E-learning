const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["multiple-choice", "true-false", "drag-drop", "fill-blank"],
    required: true,
  },
  options: [
    {
      text: String,
      isCorrect: Boolean,
    },
  ],
  correctAnswer: String,
  explanation: String,
  points: {
    type: Number,
    default: 1,
  },
})

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    questions: [questionSchema],
    timeLimit: {
      type: Number, // in minutes
      default: 30,
    },
    passingScore: {
      type: Number,
      default: 70, // percentage
    },
    attempts: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        answers: [
          {
            questionId: mongoose.Schema.Types.ObjectId,
            answer: String,
            isCorrect: Boolean,
          },
        ],
        score: Number,
        completedAt: {
          type: Date,
          default: Date.now,
        },
        timeSpent: Number, // in minutes
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Quiz", quizSchema)
