"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import "./AdminLayout.css"

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()

  const sidebarItems = [
    { path: "/admin", icon: "📊", label: "Dashboard" },
    { path: "/admin/users", icon: "👥", label: "Users" },
    { path: "/admin/courses", icon: "📚", label: "Courses" },
    { path: "/admin/analytics", icon: "📈", label: "Analytics" },
    { path: "/admin/settings", icon: "⚙️", label: "Settings" },
  ]

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-icon">🎓</span>
            <span className="brand-text">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="sidebar-toggle">
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className={`admin-main ${sidebarCollapsed ? "expanded" : ""}`}>{children}</main>
    </div>
  )
}

export default AdminLayout
