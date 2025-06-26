"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./Auth.css"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Mock login - replace with actual API call
      if (formData.email && formData.password) {
        const userData = {
          id: 1,
          name: "John Doe",
          email: formData.email,
          avatar: "/placeholder.svg?height=40&width=40",
        }
        login(userData)
        navigate("/dashboard")
      } else {
        setError("Please fill in all fields")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Welcome Back</h1>
              <p>Sign in to continue your learning journey</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="auth-link">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
