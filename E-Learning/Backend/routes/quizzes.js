const express = require("express")
const Quiz = require("../models/Quiz")
const auth = require("../middleware/auth")

const router = express.Router()

// Get quiz by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate("course", "title")
      .select("-questions.options.isCorrect -questions.correctAnswer")

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" })
    }

    res.json(quiz)
  } catch (error) {
    console.error("Get quiz error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Submit quiz attempt
router.post("/:id/submit", auth, async (req, res) => {
  try {
    const { answers, timeSpent } = req.body
    const quiz = await Quiz.findById(req.params.id)

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" })
    }

    // Calculate score
    let correctAnswers = 0
    const gradedAnswers = answers.map((answer) => {
      const question = quiz.questions.id(answer.questionId)
      let isCorrect = false

      if (question.type === "multiple-choice") {
        const correctOption = question.options.find((opt) => opt.isCorrect)
        isCorrect = correctOption && correctOption.text === answer.answer
      } else if (question.type === "true-false") {
        isCorrect = question.correctAnswer === answer.answer
      }

      if (isCorrect) correctAnswers++

      return {
        questionId: answer.questionId,
        answer: answer.answer,
        isCorrect,
      }
    })

    const score = Math.round((correctAnswers / quiz.questions.length) * 100)

    // Save attempt
    quiz.attempts.push({
      user: req.userId,
      answers: gradedAnswers,
      score,
      timeSpent,
      completedAt: new Date(),
    })

    await quiz.save()

    res.json({
      score,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      passed: score >= quiz.passingScore,
      answers: gradedAnswers,
    })
  } catch (error) {
    console.error("Submit quiz error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
