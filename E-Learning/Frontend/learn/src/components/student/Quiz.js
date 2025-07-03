"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./Quiz.css"

const Quiz = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [quiz, setQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuiz()
  }, [id])

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && quiz && !isSubmitted) {
      handleSubmitQuiz()
    }
  }, [timeLeft, isSubmitted, quiz])

  const fetchQuiz = async () => {
    try {
      // Mock data - replace with API call
      const mockQuiz = {
        id: Number.parseInt(id),
        title: "JavaScript Fundamentals Quiz",
        description: "Test your knowledge of JavaScript basics",
        timeLimit: 1800, // 30 minutes in seconds
        passingScore: 70,
        questions: [
          {
            id: 1,
            question: "What is the correct way to declare a variable in JavaScript?",
            type: "multiple-choice",
            options: [
              { id: "a", text: "var myVariable;", isCorrect: true },
              { id: "b", text: "variable myVariable;", isCorrect: false },
              { id: "c", text: "v myVariable;", isCorrect: false },
              { id: "d", text: "declare myVariable;", isCorrect: false },
            ],
          },
          {
            id: 2,
            question: "JavaScript is a compiled language.",
            type: "true-false",
            correctAnswer: "false",
          },
          {
            id: 3,
            question: "Which method is used to add an element to the end of an array?",
            type: "multiple-choice",
            options: [
              { id: "a", text: "push()", isCorrect: true },
              { id: "b", text: "pop()", isCorrect: false },
              { id: "c", text: "shift()", isCorrect: false },
              { id: "d", text: "unshift()", isCorrect: false },
            ],
          },
          {
            id: 4,
            question: "What does 'DOM' stand for?",
            type: "multiple-choice",
            options: [
              { id: "a", text: "Document Object Model", isCorrect: true },
              { id: "b", text: "Data Object Management", isCorrect: false },
              { id: "c", text: "Dynamic Object Method", isCorrect: false },
              { id: "d", text: "Document Oriented Model", isCorrect: false },
            ],
          },
          {
            id: 5,
            question: "The '===' operator checks for both value and type equality.",
            type: "true-false",
            correctAnswer: "true",
          },
        ],
      }

      setQuiz(mockQuiz)
      setTimeLeft(mockQuiz.timeLimit)
    } catch (error) {
      console.error("Error fetching quiz:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    try {
      // Calculate results
      let correctAnswers = 0
      const questionResults = quiz.questions.map((question) => {
        const userAnswer = answers[question.id]
        let isCorrect = false

        if (question.type === "multiple-choice") {
          const correctOption = question.options.find((opt) => opt.isCorrect)
          isCorrect = correctOption && correctOption.id === userAnswer
        } else if (question.type === "true-false") {
          isCorrect = question.correctAnswer === userAnswer
        }

        if (isCorrect) correctAnswers++

        return {
          questionId: question.id,
          question: question.question,
          userAnswer,
          correctAnswer:
            question.type === "multiple-choice"
              ? question.options.find((opt) => opt.isCorrect)?.text
              : question.correctAnswer,
          isCorrect,
        }
      })

      const score = Math.round((correctAnswers / quiz.questions.length) * 100)
      const passed = score >= quiz.passingScore

      const quizResults = {
        score,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        passed,
        timeSpent: quiz.timeLimit - timeLeft,
        results: questionResults,
      }

      setResults(quizResults)
      setIsSubmitted(true)

      // Mock API call to save results
      console.log("Quiz results:", quizResults)
    } catch (error) {
      console.error("Error submitting quiz:", error)
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / quiz.questions.length) * 100
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading quiz...</p>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="error-state">
        <h2>Quiz not found</h2>
        <p>The quiz you're looking for doesn't exist or you don't have access to it.</p>
        <button onClick={() => navigate("/dashboard")} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    )
  }

  if (isSubmitted && results) {
    return (
      <div className="quiz-results">
        <div className="container">
          <div className="results-card">
            <div className="results-header">
              <h1>Quiz Complete!</h1>
              <div className={`score-display ${results.passed ? "passed" : "failed"}`}>
                <div className="score-circle">
                  <span className="score-number">{results.score}%</span>
                </div>
                <p className="score-status">{results.passed ? "Passed" : "Failed"}</p>
              </div>
            </div>

            <div className="results-summary">
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-number">{results.correctAnswers}</span>
                  <span className="stat-label">Correct Answers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{results.totalQuestions}</span>
                  <span className="stat-label">Total Questions</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{formatTime(results.timeSpent)}</span>
                  <span className="stat-label">Time Spent</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{quiz.passingScore}%</span>
                  <span className="stat-label">Passing Score</span>
                </div>
              </div>
            </div>

            <div className="results-details">
              <h3>Question Review</h3>
              <div className="questions-review">
                {results.results.map((result, index) => (
                  <div key={result.questionId} className={`question-result ${result.isCorrect ? "correct" : "incorrect"}`}>
                    <div className="question-header">
                      <span className="question-number">Q{index + 1}</span>
                      <span className={`result-icon ${result.isCorrect ? "correct" : "incorrect"}`}>
                        {result.isCorrect ? "✓" : "✗"}
                      </span>
                    </div>
                    <div className="question-content">
                      <p className="question-text">{result.question}</p>
                      <div className="answer-comparison">
                        <div className="user-answer">
                          <strong>Your Answer:</strong> {result.userAnswer || "Not answered"}
                        </div>
                        {!result.isCorrect && (
                          <div className="correct-answer">
                            <strong>Correct Answer:</strong> {result.correctAnswer}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="results-actions">
              <button onClick={() => navigate("/dashboard")} className="btn btn-primary">
                Back to Dashboard
              </button>
              <button onClick={() => window.location.reload()} className="btn btn-secondary">
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]

  return (
    <div className="quiz-container">
      <div className="container">
        {/* Quiz Header */}
        <div className="quiz-header">
          <div className="quiz-info">
            <h1>{quiz.title}</h1>
            <p>{quiz.description}</p>
          </div>
          <div className="quiz-timer">
            <div className={`timer ${timeLeft < 300 ? "warning" : ""}`}>
              <span className="timer-icon">⏰</span>
              <span className="timer-text">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="quiz-progress">
          <div className="progress-info">
            <span>
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span>{Math.round(getProgressPercentage())}% Complete</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${getProgressPercentage()}%` }}></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="question-card">
          <div className="question-header">
            <h2>Question {currentQuestion + 1}</h2>
            <span className="question-type">{question.type.replace("-", " ")}</span>
          </div>

          <div className="question-content">
            <p className="question-text">{question.question}</p>

            <div className="answer-options">
              {question.type === "multiple-choice" && (
                <div className="multiple-choice-options">
                  {question.options.map((option) => (
                    <label key={option.id} className="option-label">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.id}
                        checked={answers[question.id] === option.id}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      />
                      <span className="option-text">{option.text}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === "true-false" && (
                <div className="true-false-options">
                  <label className="option-label">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="true"
                      checked={answers[question.id] === "true"}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    />
                    <span className="option-text">True</span>
                  </label>
                  <label className="option-label">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value="false"
                      checked={answers[question.id] === "false"}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    />
                    <span className="option-text">False</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="quiz-navigation">
          <div className="nav-buttons">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="btn btn-secondary"
            >
              ← Previous
            </button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button onClick={handleSubmitQuiz} className="btn btn-success">
                Submit Quiz
              </button>
            ) : (
              <button onClick={handleNextQuestion} className="btn btn-primary">
                Next →
              </button>
            )}
          </div>

          {/* Question Navigator */}
          <div className="question-navigator">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`nav-dot ${index === currentQuestion ? "active" : ""} ${
                  answers[quiz.questions[index].id] ? "answered" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quiz
