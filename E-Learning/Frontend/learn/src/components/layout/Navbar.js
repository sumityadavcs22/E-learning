"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import ThemeToggle from "../common/ThemeToggle"
import "./Navbar.css"

const Navbar = () => {
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🎓</span>
            LearnHub
            {isAdminRoute && <span className="admin-badge">Admin</span>}
          </Link>

          <div className="navbar-menu">
            <ThemeToggle />

            {user ? (
              <>
                {user.role === "admin" ? (
                  <>
                    <Link to="/admin" className="nav-link">
                      Dashboard
                    </Link>
                    <Link to="/admin/users" className="nav-link">
                      Users
                    </Link>
                    <Link to="/admin/courses" className="nav-link">
                      Courses
                    </Link>
                    <Link to="/admin/analytics" className="nav-link">
                      Analytics
                    </Link>
                  </>
                ) : (
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
                  </>
                )}

                <div className="user-menu">
                  <div className="user-avatar">
                    <img
                      src={user.avatar || "/placeholder.svg?height=32&width=32"}
                      alt={user.name}
                      className="avatar-img"
                    />
                    <span className="user-name">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                    Logout
                  </button>
                </div>
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
