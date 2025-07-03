"use client"

import { useState, useEffect } from "react"
import AdminLayout from "./AdminLayout"
import "./Analytics.css"

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    userGrowth: [],
    coursePerformance: [],
    revenueData: [],
    topCourses: [],
    userActivity: [],
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d") // 7d, 30d, 90d, 1y

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      // Mock data - replace with API calls
      const mockData = {
        overview: {
          totalUsers: 15420,
          activeUsers: 8930,
          totalCourses: 245,
          completionRate: 78.5,
          totalRevenue: 125000,
          avgRating: 4.7,
          newEnrollments: 1250,
          certificatesIssued: 890,
        },
        userGrowth: [
          { date: "2024-01-01", users: 12000, activeUsers: 7200 },
          { date: "2024-01-08", users: 12500, activeUsers: 7500 },
          { date: "2024-01-15", users: 13200, activeUsers: 7800 },
          { date: "2024-01-22", users: 14100, activeUsers: 8200 },
          { date: "2024-01-29", users: 15420, activeUsers: 8930 },
        ],
        coursePerformance: [
          { category: "Programming", enrollments: 4500, completions: 3200, revenue: 45000 },
          { category: "Design", enrollments: 2800, completions: 2100, revenue: 28000 },
          { category: "Marketing", enrollments: 2200, completions: 1800, revenue: 22000 },
          { category: "Data Science", enrollments: 1800, completions: 1400, revenue: 35000 },
          { category: "Business", enrollments: 1500, completions: 1200, revenue: 18000 },
        ],
        revenueData: [
          { month: "Jan", revenue: 18000, target: 20000 },
          { month: "Feb", revenue: 22000, target: 25000 },
          { month: "Mar", revenue: 28000, target: 30000 },
          { month: "Apr", revenue: 32000, target: 35000 },
          { month: "May", revenue: 38000, target: 40000 },
          { month: "Jun", revenue: 45000, target: 45000 },
        ],
        topCourses: [
          {
            id: 1,
            title: "React Fundamentals",
            enrollments: 1250,
            rating: 4.8,
            revenue: 15000,
            completionRate: 85,
          },
          {
            id: 2,
            title: "Node.js Backend Development",
            enrollments: 890,
            rating: 4.9,
            revenue: 18000,
            completionRate: 78,
          },
          {
            id: 3,
            title: "UI/UX Design Principles",
            enrollments: 2100,
            rating: 4.7,
            revenue: 12000,
            completionRate: 82,
          },
          {
            id: 4,
            title: "Digital Marketing Strategy",
            enrollments: 1580,
            rating: 4.6,
            revenue: 14000,
            completionRate: 75,
          },
          {
            id: 5,
            title: "Data Science with Python",
            enrollments: 750,
            rating: 4.9,
            revenue: 22000,
            completionRate: 88,
          },
        ],
        userActivity: [
          { hour: "00:00", users: 120 },
          { hour: "04:00", users: 80 },
          { hour: "08:00", users: 450 },
          { hour: "12:00", users: 680 },
          { hour: "16:00", users: 820 },
          { hour: "20:00", users: 590 },
        ],
      }

      setAnalyticsData(mockData)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const MetricCard = ({ title, value, change, icon, color }) => (
    <div className={`metric-card ${color}`}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-content">
        <h3 className="metric-value">{value}</h3>
        <p className="metric-title">{title}</p>
        {change && (
          <span className={`metric-change ${change > 0 ? "positive" : "negative"}`}>
            {change > 0 ? "↗" : "↘"} {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="analytics">
        <div className="page-header">
          <div>
            <h1>Analytics Dashboard</h1>
            <p>Track platform performance and user engagement</p>
          </div>
          <div className="time-range-selector">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="form-select"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="metrics-grid">
          <MetricCard
            title="Total Users"
            value={analyticsData.overview.totalUsers?.toLocaleString()}
            change={12}
            icon="👥"
            color="blue"
          />
          <MetricCard
            title="Active Users"
            value={analyticsData.overview.activeUsers?.toLocaleString()}
            change={8}
            icon="🟢"
            color="green"
          />
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(analyticsData.overview.totalRevenue)}
            change={23}
            icon="💰"
            color="orange"
          />
          <MetricCard
            title="Completion Rate"
            value={`${analyticsData.overview.completionRate}%`}
            change={5}
            icon="🎯"
            color="purple"
          />
        </div>

        <div className="analytics-grid">
          {/* User Growth Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>User Growth</h3>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-color blue"></span>
                  Total Users
                </span>
                <span className="legend-item">
                  <span className="legend-color green"></span>
                  Active Users
                </span>
              </div>
            </div>
            <div className="chart-container">
              <div className="chart-placeholder">
                <p>User Growth Chart</p>
                <small>Chart visualization would go here</small>
                <div className="mock-chart">
                  {analyticsData.userGrowth.map((data, index) => (
                    <div key={index} className="chart-bar">
                      <div
                        className="bar total-users"
                        style={{ height: `${(data.users / 20000) * 100}%` }}
                      ></div>
                      <div
                        className="bar active-users"
                        style={{ height: `${(data.activeUsers / 20000) * 100}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Revenue Trends</h3>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-color orange"></span>
                  Actual Revenue
                </span>
                <span className="legend-item">
                  <span className="legend-color gray"></span>
                  Target
                </span>
              </div>
            </div>
            <div className="chart-container">
              <div className="chart-placeholder">
                <p>Revenue Chart</p>
                <small>Chart visualization would go here</small>
                <div className="mock-chart">
                  {analyticsData.revenueData.map((data, index) => (
                    <div key={index} className="chart-bar">
                      <div
                        className="bar revenue"
                        style={{ height: `${(data.revenue / 50000) * 100}%` }}
                      ></div>
                      <div
                        className="bar target"
                        style={{ height: `${(data.target / 50000) * 100}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-grid">
          {/* Course Performance */}
          <div className="performance-card">
            <h3>Course Performance by Category</h3>
            <div className="performance-list">
              {analyticsData.coursePerformance.map((category, index) => (
                <div key={index} className="performance-item">
                  <div className="performance-info">
                    <h4>{category.category}</h4>
                    <div className="performance-stats">
                      <span>{category.enrollments} enrollments</span>
                      <span>{category.completions} completions</span>
                      <span>{formatCurrency(category.revenue)} revenue</span>
                    </div>
                  </div>
                  <div className="performance-bar">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(category.completions / category.enrollments) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="completion-rate">
                    {Math.round((category.completions / category.enrollments) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Courses */}
          <div className="top-courses-card">
            <h3>Top Performing Courses</h3>
            <div className="courses-list">
              {analyticsData.topCourses.map((course, index) => (
                <div key={course.id} className="course-item">
                  <div className="course-rank">#{index + 1}</div>
                  <div className="course-info">
                    <h4>{course.title}</h4>
                    <div className="course-metrics">
                      <span className="metric">
                        <span className="metric-icon">👥</span>
                        {course.enrollments}
                      </span>
                      <span className="metric">
                        <span className="metric-icon">⭐</span>
                        {course.rating}
                      </span>
                      <span className="metric">
                        <span className="metric-icon">💰</span>
                        {formatCurrency(course.revenue)}
                      </span>
                      <span className="metric">
                        <span className="metric-icon">✅</span>
                        {course.completionRate}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Activity Heatmap */}
        <div className="activity-card">
          <h3>User Activity by Hour</h3>
          <div className="activity-chart">
            {analyticsData.userActivity.map((activity, index) => (
              <div key={index} className="activity-bar">
                <div className="activity-time">{activity.hour}</div>
                <div
                  className="activity-level"
                  style={{
                    height: `${(activity.users / 1000) * 100}%`,
                    backgroundColor: `hsl(${(activity.users / 1000) * 120}, 70%, 50%)`,
                  }}
                ></div>
                <div className="activity-count">{activity.users}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="additional-metrics">
          <div className="metric-summary">
            <h3>Key Performance Indicators</h3>
            <div className="kpi-grid">
              <div className="kpi-item">
                <span className="kpi-label">Average Course Rating</span>
                <span className="kpi-value">{analyticsData.overview.avgRating}/5.0</span>
              </div>
              <div className="kpi-item">
                <span className="kpi-label">New Enrollments</span>
                <span className="kpi-value">{analyticsData.overview.newEnrollments}</span>
              </div>
              <div className="kpi-item">
                <span className="kpi-label">Certificates Issued</span>
                <span className="kpi-value">{analyticsData.overview.certificatesIssued}</span>
              </div>
              <div className="kpi-item">
                <span className="kpi-label">Total Courses</span>
                <span className="kpi-value">{analyticsData.overview.totalCourses}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Analytics
