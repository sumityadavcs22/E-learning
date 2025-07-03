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
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
      // Use the login function from context, which returns { success, error }
      const response = await login(formData.email, formData.password)
      if (!response || !response.success) {
        setError(response?.error || "Login failed. Please try again.")
        setLoading(false)
        return
      }
      // Redirect based on role
      if (response.user?.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/dashboard")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Quick login buttons for testing
  const quickLogin = async (role) => {
    const credentials =
      role === "admin"
        ? { email: "admin@test.com", password: "admin123" }
        : { email: "student@test.com", password: "student123" }

    setLoading(true)
    const result = await login(credentials.email, credentials.password)

    if (result.success) {
      navigate(role === "admin" ? "/admin" : "/dashboard")
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Quick Login for Testing */}
        <div className="quick-login">
          <p>Quick Login for Testing:</p>
          <div className="quick-login-buttons">
            <button onClick={() => quickLogin("admin")} className="btn btn-secondary btn-sm" disabled={loading}>
              Login as Admin
            </button>
            <button onClick={() => quickLogin("student")} className="btn btn-outline btn-sm" disabled={loading}>
              Login as Student
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
