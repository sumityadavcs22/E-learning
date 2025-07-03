const express = require("express")
const Quiz = require("../models/Quiz")
const auth = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/quizzes/:id
// @desc    Get quiz by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("course", "title")

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" })
    }

    // Don't send correct answers to client
    const quizData = {
      ...quiz.toObject(),
      questions: quiz.questions.map((q) => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        type: q.type,
      })),
    }

    res.json(quizData)
  } catch (error) {
    console.error("Get quiz error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/quizzes/:id/submit
// @desc    Submit quiz answers
// @access  Private
router.post("/:id/submit", auth, async (req, res) => {
  try {
    const { answers } = req.body
    const quiz = await Quiz.findById(req.params.id)

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" })
    }

    // Calculate score
    let correctAnswers = 0
    const results = []

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index]
      const isCorrect = userAnswer === question.correctAnswer

      if (isCorrect) {
        correctAnswers++
      }

      results.push({
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      })
    })

    const score = Math.round((correctAnswers / quiz.questions.length) * 100)
    const passed = score >= quiz.passingScore

    // Save result
    const result = {
      user: req.user.id,
      score,
      answers,
      passed,
      completedAt: new Date(),
    }

    quiz.results.push(result)
    await quiz.save()

    res.json({
      score,
      passed,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      results,
    })
  } catch (error) {
    console.error("Submit quiz error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/quizzes/:id/results
// @desc    Get quiz results for user
// @access  Private
router.get("/:id/results", auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" })
    }

    const userResults = quiz.results.filter((result) => result.user.toString() === req.user.id)

    res.json(userResults)
  } catch (error) {
    console.error("Get quiz results error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
