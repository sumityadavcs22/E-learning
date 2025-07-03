"use client"

import { useState, useEffect } from "react"
import AdminLayout from "./AdminLayout"
import Modal from "../common/Modal"
import "./UserManagement.css"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
  })

  useEffect(() => {
    fetchUsers()
  }, [filters])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      // Mock data - replace with API call
      const mockUsers = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "student",
          status: "active",
          joinDate: "2024-01-15",
          lastLogin: "2024-01-20",
          coursesEnrolled: 3,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "instructor",
          status: "active",
          joinDate: "2023-12-10",
          lastLogin: "2024-01-19",
          coursesEnrolled: 0,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: 3,
          name: "Mike Johnson",
          email: "mike@example.com",
          role: "student",
          status: "inactive",
          joinDate: "2024-01-01",
          lastLogin: "2024-01-10",
          coursesEnrolled: 1,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: 4,
          name: "Sarah Wilson",
          email: "sarah@example.com",
          role: "admin",
          status: "active",
          joinDate: "2023-11-20",
          lastLogin: "2024-01-20",
          coursesEnrolled: 0,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: 5,
          name: "Alex Rodriguez",
          email: "alex@example.com",
          role: "instructor",
          status: "active",
          joinDate: "2023-10-15",
          lastLogin: "2024-01-18",
          coursesEnrolled: 0,
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ]

      // Apply filters
      let filteredUsers = mockUsers

      if (filters.search) {
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            user.email.toLowerCase().includes(filters.search.toLowerCase()),
        )
      }

      if (filters.role) {
        filteredUsers = filteredUsers.filter((user) => user.role === filters.role)
      }

      if (filters.status) {
        filteredUsers = filteredUsers.filter((user) => user.status === filters.status)
      }

      setUsers(filteredUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId, action) => {
    try {
      // Mock action - replace with API call
      console.log(`Performing ${action} on user ${userId}`)

      if (action === "delete") {
        setUsers(users.filter((user) => user.id !== userId))
      } else if (action === "activate" || action === "deactivate") {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, status: action === "activate" ? "active" : "inactive" } : user,
          ),
        )
      }

      setShowModal(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Error performing user action:", error)
    }
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "badge-danger"
      case "instructor":
        return "badge-warning"
      case "student":
        return "badge-primary"
      default:
        return "badge-primary"
    }
  }

  const getStatusBadgeClass = (status) => {
    return status === "active" ? "badge-success" : "badge-secondary"
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="user-management">
        <div className="page-header">
          <h1>User Management</h1>
          <p>Manage user accounts, roles, and permissions</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search users..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="form-select"
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="form-select"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Last Login</th>
                <th>Courses</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="user-avatar" />
                      <div>
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getRoleBadgeClass(user.role)}`}>{user.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(user.status)}`}>{user.status}</span>
                  </td>
                  <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                  <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
                  <td>{user.coursesEnrolled}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowModal(true)
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, user.status === "active" ? "deactivate" : "activate")}
                        className={`btn btn-sm ${user.status === "active" ? "btn-warning" : "btn-success"}`}
                      >
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="empty-state">
            <h3>No users found</h3>
            <p>Try adjusting your search criteria.</p>
          </div>
        )}

        {/* User Edit Modal */}
        {showModal && selectedUser && (
          <Modal
            title="Edit User"
            onClose={() => {
              setShowModal(false)
              setSelectedUser(null)
            }}
          >
            <div className="user-edit-form">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  className="form-select"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  onClick={() => {
                    setShowModal(false)
                    setSelectedUser(null)
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={() => handleUserAction(selectedUser.id, "update")} className="btn btn-primary">
                  Save Changes
                </button>
                <button onClick={() => handleUserAction(selectedUser.id, "delete")} className="btn btn-danger">
                  Delete User
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  )
}

export default UserManagement
