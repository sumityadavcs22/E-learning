"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./CoursePlayer.css"

const CoursePlayer = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [progress, setProgress] = useState(0)
  const [notes, setNotes] = useState("")
  const [showNotes, setShowNotes] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    fetchCourse()
  }, [id])

  const fetchCourse = async () => {
    setLoading(true)
    try {
      // Mock data - replace with API call
      const mockCourse = {
        id: Number.parseInt(id),
        title: "React Fundamentals",
        description: "Learn the basics of React including components, props, state, and hooks.",
        instructor: { name: "John Doe", avatar: "/placeholder.svg?height=40&width=40" },
        thumbnail: "/placeholder.svg?height=300&width=500",
        totalLessons: 20,
        completedLessons: 8,
        progress: 40,
        lessons: [
          {
            id: 1,
            title: "Introduction to React",
            duration: 15,
            videoUrl: "https://example.com/video1.mp4",
            completed: true,
            resources: [
              { title: "React Documentation", url: "https://reactjs.org", type: "link" },
              { title: "Lesson Slides", url: "/slides1.pdf", type: "pdf" },
            ],
          },
          {
            id: 2,
            title: "JSX and Components",
            duration: 22,
            videoUrl: "https://example.com/video2.mp4",
            completed: true,
            resources: [{ title: "JSX Guide", url: "https://reactjs.org/docs/jsx-in-depth.html", type: "link" }],
          },
          {
            id: 3,
            title: "Props and State",
            duration: 28,
            videoUrl: "https://example.com/video3.mp4",
            completed: true,
            resources: [],
          },
          {
            id: 4,
            title: "Event Handling",
            duration: 18,
            videoUrl: "https://example.com/video4.mp4",
            completed: false,
            resources: [{ title: "Event Handling Examples", url: "/examples.zip", type: "document" }],
          },
          {
            id: 5,
            title: "React Hooks",
            duration: 35,
            videoUrl: "https://example.com/video5.mp4",
            completed: false,
            resources: [],
          },
        ],
      }

      setCourse(mockCourse)
      setCurrentLesson(mockCourse.lessons[0])
      setProgress(mockCourse.progress)
    } catch (error) {
      console.error("Error fetching course:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson)
  }

  const handleMarkComplete = async () => {
    if (!currentLesson) return

    try {
      // Mock API call to mark lesson as complete
      const updatedLessons = course.lessons.map((lesson) =>
        lesson.id === currentLesson.id ? { ...lesson, completed: true } : lesson,
      )

      const completedCount = updatedLessons.filter((lesson) => lesson.completed).length
      const newProgress = Math.round((completedCount / course.totalLessons) * 100)

      setCourse({
        ...course,
        lessons: updatedLessons,
        completedLessons: completedCount,
        progress: newProgress,
      })

      setCurrentLesson({ ...currentLesson, completed: true })
      setProgress(newProgress)
    } catch (error) {
      console.error("Error marking lesson complete:", error)
    }
  }

  const handleNextLesson = () => {
    if (!currentLesson || !course) return

    const currentIndex = course.lessons.findIndex((lesson) => lesson.id === currentLesson.id)
    if (currentIndex < course.lessons.length - 1) {
      setCurrentLesson(course.lessons[currentIndex + 1])
    }
  }

  const handlePreviousLesson = () => {
    if (!currentLesson || !course) return

    const currentIndex = course.lessons.findIndex((lesson) => lesson.id === currentLesson.id)
    if (currentIndex > 0) {
      setCurrentLesson(course.lessons[currentIndex - 1])
    }
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading course...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="error-state">
        <h2>Course not found</h2>
        <p>The course you're looking for doesn't exist or you don't have access to it.</p>
        <Link to="/courses" className="btn btn-primary">
          Browse Courses
        </Link>
      </div>
    )
  }

  return (
    <div className="course-player">
      {/* Course Header */}
      <div className="course-header">
        <div className="container">
          <div className="header-content">
            <div className="course-info">
              <Link to="/courses" className="back-link">
                ← Back to Courses
              </Link>
              <h1>{course.title}</h1>
              <div className="instructor-info">
                <img
                  src={course.instructor.avatar || "/placeholder.svg"}
                  alt={course.instructor.name}
                  className="instructor-avatar"
                />
                <span>by {course.instructor.name}</span>
              </div>
            </div>
            <div className="course-progress">
              <div className="progress-info">
                <span className="progress-text">
                  {course.completedLessons} of {course.totalLessons} lessons completed
                </span>
                <span className="progress-percentage">{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="player-container">
        {/* Lesson Sidebar */}
        <aside className={`lesson-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
          <div className="sidebar-header">
            <h3>Course Content</h3>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="collapse-btn">
              {sidebarCollapsed ? "→" : "←"}
            </button>
          </div>

          <div className="lessons-list">
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`lesson-item ${currentLesson?.id === lesson.id ? "active" : ""} ${
                  lesson.completed ? "completed" : ""
                }`}
                onClick={() => handleLessonSelect(lesson)}
              >
                <div className="lesson-number">{index + 1}</div>
                <div className="lesson-content">
                  <h4 className="lesson-title">{lesson.title}</h4>
                  <div className="lesson-meta">
                    <span className="lesson-duration">{formatDuration(lesson.duration)}</span>
                    {lesson.completed && <span className="completion-badge">✓</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Player */}
        <main className={`player-main ${sidebarCollapsed ? "expanded" : ""}`}>
          {currentLesson && (
            <>
              {/* Video Player */}
              <div className="video-container">
                <div className="video-placeholder">
                  <div className="video-info">
                    <h2>{currentLesson.title}</h2>
                    <p>Duration: {formatDuration(currentLesson.duration)}</p>
                    <div className="video-controls">
                      <button className="play-btn">▶ Play Video</button>
                      <button onClick={() => setShowNotes(!showNotes)} className="notes-btn">
                        📝 {showNotes ? "Hide" : "Show"} Notes
                      </button>
                    </div>
                  </div>
                  <small>Video player would be integrated here (YouTube, Vimeo, etc.)</small>
                </div>
              </div>

              {/* Lesson Controls */}
              <div className="lesson-controls">
                <div className="control-buttons">
                  <button
                    onClick={handlePreviousLesson}
                    disabled={course.lessons.findIndex((l) => l.id === currentLesson.id) === 0}
                    className="btn btn-secondary"
                  >
                    ← Previous
                  </button>

                  {!currentLesson.completed && (
                    <button onClick={handleMarkComplete} className="btn btn-success">
                      Mark as Complete
                    </button>
                  )}

                  <button
                    onClick={handleNextLesson}
                    disabled={course.lessons.findIndex((l) => l.id === currentLesson.id) === course.lessons.length - 1}
                    className="btn btn-primary"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Lesson Resources */}
              {currentLesson.resources && currentLesson.resources.length > 0 && (
                <div className="lesson-resources">
                  <h3>Lesson Resources</h3>
                  <div className="resources-list">
                    {currentLesson.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-item"
                      >
                        <span className="resource-icon">
                          {resource.type === "pdf" && "📄"}
                          {resource.type === "link" && "🔗"}
                          {resource.type === "document" && "📁"}
                          {resource.type === "video" && "🎥"}
                        </span>
                        <span className="resource-title">{resource.title}</span>
                        <span className="resource-type">{resource.type}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Section */}
              {showNotes && (
                <div className="notes-section">
                  <h3>My Notes</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Take notes while watching the lesson..."
                    className="notes-textarea"
                    rows="6"
                  />
                  <button className="btn btn-primary btn-sm">Save Notes</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default CoursePlayer
