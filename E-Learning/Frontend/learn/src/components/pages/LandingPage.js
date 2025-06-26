"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./LandingPage.css"

const LandingPage = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: "📚",
      title: "Comprehensive Courses",
      description: "Access thousands of courses across various subjects and skill levels.",
    },
    {
      icon: "🎯",
      title: "Personalized Learning",
      description: "AI-powered recommendations tailored to your learning style and goals.",
    },
    {
      icon: "🏆",
      title: "Certificates & Achievements",
      description: "Earn recognized certificates and showcase your accomplishments.",
    },
    {
      icon: "👥",
      title: "Expert Instructors",
      description: "Learn from industry professionals and experienced educators.",
    },
    {
      icon: "📱",
      title: "Learn Anywhere",
      description: "Access your courses on any device, anytime, anywhere.",
    },
    {
      icon: "💬",
      title: "Interactive Community",
      description: "Connect with fellow learners and participate in discussions.",
    },
  ]

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Transform Your Future with
              <span className="text-gradient"> Expert-Led Learning</span>
            </h1>
            <p className="hero-description">
              Join thousands of learners worldwide and unlock your potential with our comprehensive online courses.
              Learn at your own pace, earn certificates, and advance your career.
            </p>
            <div className="hero-actions">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Start Learning Today
                  </Link>
                  <Link to="/courses" className="btn btn-secondary btn-lg">
                    Browse Courses
                  </Link>
                </>
              )}
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Active Learners</span>
              </div>
              <div className="stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Courses</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose LearnHub?</h2>
            <p>Discover the features that make learning effective and enjoyable</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>Join our community of learners and take the first step towards achieving your goals.</p>
            {!user && (
              <div className="cta-actions">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create Free Account
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
