"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./Navbar.css"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🎓</span>
            LearnHub
          </Link>

          <div className="navbar-menu">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <Link to="/courses" className="nav-link">
                  Courses
                </Link>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/courses" className="nav-link">
                  Browse Courses
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
