"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./Dashboard.css"

const Dashboard = () => {
  const { user } = useAuth()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    // Mock data - replace with API calls
    setEnrolledCourses([
      {
        id: 1,
        title: "React Fundamentals",
        instructor: "John Doe",
        progress: 75,
        totalLessons: 20,
        completedLessons: 15,
        thumbnail: "/placeholder.svg?height=120&width=200",
      },
      {
        id: 2,
        title: "Node.js Backend Development",
        instructor: "Jane Smith",
        progress: 45,
        totalLessons: 25,
        completedLessons: 11,
        thumbnail: "/placeholder.svg?height=120&width=200",
      },
      {
        id: 3,
        title: "MongoDB Database Design",
        instructor: "Mike Johnson",
        progress: 90,
        totalLessons: 15,
        completedLessons: 14,
        thumbnail: "/placeholder.svg?height=120&width=200",
      },
    ])

    setRecentActivity([
      { type: "completed", content: 'Completed "React Hooks" lesson', time: "2 hours ago" },
      { type: "quiz", content: "Scored 95% on JavaScript Quiz", time: "1 day ago" },
      { type: "certificate", content: "Earned HTML/CSS Certificate", time: "3 days ago" },
      { type: "enrolled", content: 'Enrolled in "Advanced React" course', time: "1 week ago" },
    ])
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "completed":
        return "✅"
      case "quiz":
        return "🎯"
      case "certificate":
        return "🏆"
      case "enrolled":
        return "📚"
      default:
        return "📝"
    }
  }

  return (
    <div className="dashboard">
      <div className="container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1 className="welcome-title">
              {getGreeting()}, {user?.name || "Learner"}! 👋
            </h1>
            <p className="welcome-subtitle">
              Ready to continue your learning journey? Let's pick up where you left off.
            </p>
          </div>
          <div className="quick-stats">
            <div className="stat-card">
              <span className="stat-number">{enrolledCourses.length}</span>
              <span className="stat-label">Active Courses</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {enrolledCourses.reduce((acc, course) => acc + course.completedLessons, 0)}
              </span>
              <span className="stat-label">Lessons Completed</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">2</span>
              <span className="stat-label">Certificates</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Enrolled Courses */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Continue Learning</h2>
              <Link to="/courses" className="btn btn-secondary">
                Browse More
              </Link>
            </div>
            <div className="courses-grid">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="course-card">
                  <div className="course-thumbnail">
                    <img src={course.thumbnail || "/placeholder.svg"} alt={course.title} />
                    <div className="course-progress-overlay">
                      <div className="progress-circle">
                        <span>{course.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="course-info">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-instructor">by {course.instructor}</p>
                    <div className="course-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                      </div>
                      <span className="progress-text">
                        {course.completedLessons}/{course.totalLessons} lessons
                      </span>
                    </div>
                    <Link to={`/course/${course.id}`} className="btn btn-primary btn-sm">
                      Continue Learning
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-sidebar">
            <div className="activity-section">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <span className="activity-icon">{getActivityIcon(activity.type)}</span>
                    <div className="activity-content">
                      <p className="activity-text">{activity.content}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <Link to="/courses" className="action-btn">
                  <span className="action-icon">🔍</span>
                  Browse Courses
                </Link>
                <Link to="/profile" className="action-btn">
                  <span className="action-icon">👤</span>
                  View Profile
                </Link>
                <Link to="/quiz/1" className="action-btn">
                  <span className="action-icon">🎯</span>
                  Take Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
