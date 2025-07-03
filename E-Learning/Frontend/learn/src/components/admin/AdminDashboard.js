"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "./AdminLayout"
import "./AdminDashboard.css"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with API calls
      setStats({
        totalUsers: 15420,
        totalCourses: 245,
        totalEnrollments: 8930,
        totalRevenue: 125000,
      })

      setRecentActivity([
        {
          id: 1,
          type: "user_registered",
          message: "New user John Smith registered",
          timestamp: "2 minutes ago",
          icon: "👤",
        },
        {
          id: 2,
          type: "course_published",
          message: "Course 'Advanced React' was published",
          timestamp: "15 minutes ago",
          icon: "📚",
        },
        {
          id: 3,
          type: "enrollment",
          message: "Sarah Wilson enrolled in 'UI/UX Design'",
          timestamp: "1 hour ago",
          icon: "🎓",
        },
        {
          id: 4,
          type: "payment",
          message: "Payment of $79.99 received from Mike Johnson",
          timestamp: "2 hours ago",
          icon: "💰",
        },
        {
          id: 5,
          type: "review",
          message: "New 5-star review for 'Node.js Backend'",
          timestamp: "3 hours ago",
          icon: "⭐",
        },
      ])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon, color, change }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3 className="stat-value">{value.toLocaleString()}</h3>
        <p className="stat-title">{title}</p>
        {change && (
          <span className={`stat-change ${change > 0 ? "positive" : "negative"}`}>
            {change > 0 ? "↗" : "↘"} {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening with your platform.</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard title="Total Users" value={stats.totalUsers} icon="👥" color="blue" change={12} />
          <StatCard title="Total Courses" value={stats.totalCourses} icon="📚" color="green" change={8} />
          <StatCard title="Enrollments" value={stats.totalEnrollments} icon="🎓" color="purple" change={15} />
          <StatCard title="Revenue" value={stats.totalRevenue} icon="💰" color="orange" change={23} />
        </div>

        <div className="dashboard-grid">
          {/* Quick Actions */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions-grid">
              <Link to="/admin/users" className="action-card">
                <div className="action-icon">👥</div>
                <h3>Manage Users</h3>
                <p>View and manage user accounts</p>
              </Link>
              <Link to="/admin/courses" className="action-card">
                <div className="action-icon">📚</div>
                <h3>Manage Courses</h3>
                <p>Create and edit courses</p>
              </Link>
              <Link to="/admin/analytics" className="action-card">
                <div className="action-icon">📊</div>
                <h3>View Analytics</h3>
                <p>Track platform performance</p>
              </Link>
              <Link to="/admin/settings" className="action-card">
                <div className="action-icon">⚙️</div>
                <h3>Settings</h3>
                <p>Configure platform settings</p>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Activity</h2>
              <Link to="/admin/activity" className="btn btn-secondary btn-sm">
                View All
              </Link>
            </div>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <span className="activity-time">{activity.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <h3>User Growth</h3>
            <div className="chart-placeholder">
              <p>Chart visualization would go here</p>
              <small>Integration with charting library needed</small>
            </div>
          </div>
          <div className="chart-card">
            <h3>Revenue Trends</h3>
            <div className="chart-placeholder">
              <p>Chart visualization would go here</p>
              <small>Integration with charting library needed</small>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
