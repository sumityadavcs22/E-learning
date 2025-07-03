"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import "./StudentProfile.css"

const StudentProfile = () => {
  const { user, login } = useAuth()
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  })
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [certificates, setCertificates] = useState([])
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      // Mock data - replace with API calls
      setProfile({
        name: user?.name || "John Doe",
        email: user?.email || "john@example.com",
        bio: "Passionate learner interested in web development and data science. Always eager to learn new technologies and improve my skills.",
        avatar: user?.avatar || "/placeholder.svg?height=150&width=150",
        location: "San Francisco, CA",
        website: "https://johndoe.dev",
        linkedin: "https://linkedin.com/in/johndoe",
        github: "https://github.com/johndoe",
      })

      setEnrolledCourses([
        {
          id: 1,
          title: "React Fundamentals",
          instructor: "John Doe",
          progress: 75,
          enrolledDate: "2024-01-15",
          status: "in-progress",
        },
        {
          id: 2,
          title: "Node.js Backend Development",
          instructor: "Jane Smith",
          progress: 100,
          enrolledDate: "2024-01-10",
          status: "completed",
        },
        {
          id: 3,
          title: "MongoDB Database Design",
          instructor: "Mike Johnson",
          progress: 45,
          enrolledDate: "2024-01-20",
          status: "in-progress",
        },
      ])

      setCertificates([
        {
          id: 1,
          title: "React Fundamentals Certificate",
          course: "React Fundamentals",
          issuedDate: "2024-01-25",
          certificateId: "CERT-REACT-001",
        },
        {
          id: 2,
          title: "JavaScript Mastery Certificate",
          course: "JavaScript Complete Course",
          issuedDate: "2024-01-20",
          certificateId: "CERT-JS-002",
        },
      ])

      setAchievements([
        {
          id: 1,
          title: "First Course Completed",
          description: "Completed your first course",
          icon: "🎓",
          earnedDate: "2024-01-20",
        },
        {
          id: 2,
          title: "Quiz Master",
          description: "Scored 100% on 5 quizzes",
          icon: "🏆",
          earnedDate: "2024-01-22",
        },
        {
          id: 3,
          title: "Learning Streak",
          description: "Learned for 7 consecutive days",
          icon: "🔥",
          earnedDate: "2024-01-25",
        },
      ])
    } catch (error) {
      console.error("Error fetching profile data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Mock API call - replace with actual API
      console.log("Updating profile:", profile)

      // Update user context
      login({
        ...user,
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar,
      })

      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Error updating profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <span className="badge badge-success">Completed</span>
      case "in-progress":
        return <span className="badge badge-primary">In Progress</span>
      case "not-started":
        return <span className="badge badge-secondary">Not Started</span>
      default:
        return <span className="badge badge-secondary">{status}</span>
    }
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="student-profile">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
          </div>
          <div className="profile-info">
            <h1>{profile.name}</h1>
            <p className="profile-email">{profile.email}</p>
            <p className="profile-bio">{profile.bio}</p>
            <div className="profile-links">
              {profile.location && <span className="profile-link">📍 {profile.location}</span>}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="profile-link">
                  🌐 Website
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="profile-link">
                  💼 LinkedIn
                </a>
              )}
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="profile-link">
                  💻 GitHub
                </a>
              )}
            </div>
          </div>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{enrolledCourses.length}</span>
              <span className="stat-label">Courses</span>
            </div>
            <div className="stat">
              <span className="stat-number">{certificates.length}</span>
              <span className="stat-label">Certificates</span>
            </div>
            <div className="stat">
              <span className="stat-number">{achievements.length}</span>
              <span className="stat-label">Achievements</span>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="profile-tabs">
          <nav className="tabs-nav">
            <button
              onClick={() => setActiveTab("profile")}
              className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            >
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab("courses")}
              className={`tab-button ${activeTab === "courses" ? "active" : ""}`}
            >
              My Courses
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`tab-button ${activeTab === "certificates" ? "active" : ""}`}
            >
              Certificates
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`tab-button ${activeTab === "achievements" ? "active" : ""}`}
            >
              Achievements
            </button>
          </nav>

          <div className="tab-content">
            {activeTab === "profile" && (
              <div className="profile-settings">
                <h2>Profile Settings</h2>
                <form onSubmit={handleProfileUpdate} className="profile-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        className="form-input"
                        placeholder="City, Country"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Website</label>
                      <input
                        type="url"
                        value={profile.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        className="form-input"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">LinkedIn</label>
                      <input
                        type="url"
                        value={profile.linkedin}
                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                        className="form-input"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">GitHub</label>
                      <input
                        type="url"
                        value={profile.github}
                        onChange={(e) => handleInputChange("github", e.target.value)}
                        className="form-input"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="form-textarea"
                      rows="4"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Avatar URL</label>
                    <input
                      type="url"
                      value={profile.avatar}
                      onChange={(e) => handleInputChange("avatar", e.target.value)}
                      className="form-input"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "courses" && (
              <div className="courses-section">
                <h2>My Courses</h2>
                <div className="courses-list">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="course-item">
                      <div className="course-info">
                        <h3>{course.title}</h3>
                        <p>by {course.instructor}</p>
                        <p className="enrollment-date">
                          Enrolled: {new Date(course.enrolledDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="course-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                        </div>
                        <span className="progress-text">{course.progress}%</span>
                      </div>
                      <div className="course-status">{getStatusBadge(course.status)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "certificates" && (
              <div className="certificates-section">
                <h2>My Certificates</h2>
                <div className="certificates-grid">
                  {certificates.map((certificate) => (
                    <div key={certificate.id} className="certificate-card">
                      <div className="certificate-icon">🏆</div>
                      <div className="certificate-info">
                        <h3>{certificate.title}</h3>
                        <p>Course: {certificate.course}</p>
                        <p>Issued: {new Date(certificate.issuedDate).toLocaleDateString()}</p>
                        <p className="certificate-id">ID: {certificate.certificateId}</p>
                      </div>
                      <div className="certificate-actions">
                        <button className="btn btn-secondary btn-sm">Download</button>
                        <button className="btn btn-primary btn-sm">Share</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "achievements" && (
              <div className="achievements-section">
                <h2>My Achievements</h2>
                <div className="achievements-grid">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="achievement-card">
                      <div className="achievement-icon">{achievement.icon}</div>
                      <div className="achievement-info">
                        <h3>{achievement.title}</h3>
                        <p>{achievement.description}</p>
                        <p className="achievement-date">
                          Earned: {new Date(achievement.earnedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentProfile
