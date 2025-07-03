"use client"

import { useState, useEffect } from "react"
import AdminLayout from "./AdminLayout"
import Modal from "../common/Modal"
import "./CourseManagement.css"

const CourseManagement = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("view") // view, edit, create
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    instructor: "",
  })

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    shortDescription: "",
    category: "",
    level: "",
    price: "",
    thumbnail: "",
    tags: "",
    requirements: "",
    whatYouWillLearn: "",
  })

  useEffect(() => {
    fetchCourses()
  }, [filters])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      // Mock data - replace with API call
      const mockCourses = [
        {
          id: 1,
          title: "React Fundamentals",
          description: "Learn the basics of React including components, props, state, and hooks.",
          shortDescription: "Master React basics with hands-on projects",
          instructor: { id: 1, name: "John Doe", email: "john@example.com" },
          category: "Programming",
          level: "Beginner",
          price: 49.99,
          status: "published",
          enrolledStudents: 1250,
          rating: { average: 4.8, count: 156 },
          createdAt: "2024-01-15",
          updatedAt: "2024-01-20",
          thumbnail: "/placeholder.svg?height=200&width=300",
          totalDuration: 480, // minutes
          lessonsCount: 20,
          tags: ["React", "JavaScript", "Frontend"],
        },
        {
          id: 2,
          title: "Node.js Backend Development",
          description: "Build scalable backend applications with Node.js and Express.",
          shortDescription: "Complete backend development with Node.js",
          instructor: { id: 2, name: "Jane Smith", email: "jane@example.com" },
          category: "Programming",
          level: "Intermediate",
          price: 79.99,
          status: "published",
          enrolledStudents: 890,
          rating: { average: 4.9, count: 98 },
          createdAt: "2024-01-10",
          updatedAt: "2024-01-18",
          thumbnail: "/placeholder.svg?height=200&width=300",
          totalDuration: 720,
          lessonsCount: 25,
          tags: ["Node.js", "Express", "Backend"],
        },
        {
          id: 3,
          title: "UI/UX Design Principles",
          description: "Master the fundamentals of user interface and user experience design.",
          shortDescription: "Learn modern UI/UX design principles",
          instructor: { id: 3, name: "Sarah Wilson", email: "sarah@example.com" },
          category: "Design",
          level: "Beginner",
          price: 59.99,
          status: "draft",
          enrolledStudents: 0,
          rating: { average: 0, count: 0 },
          createdAt: "2024-01-12",
          updatedAt: "2024-01-19",
          thumbnail: "/placeholder.svg?height=200&width=300",
          totalDuration: 600,
          lessonsCount: 18,
          tags: ["UI", "UX", "Design"],
        },
        {
          id: 4,
          title: "Digital Marketing Strategy",
          description: "Learn effective digital marketing strategies and tactics.",
          shortDescription: "Master digital marketing from basics to advanced",
          instructor: { id: 4, name: "Mike Johnson", email: "mike@example.com" },
          category: "Marketing",
          level: "Intermediate",
          price: 69.99,
          status: "published",
          enrolledStudents: 1580,
          rating: { average: 4.6, count: 203 },
          createdAt: "2024-01-08",
          updatedAt: "2024-01-17",
          thumbnail: "/placeholder.svg?height=200&width=300",
          totalDuration: 900,
          lessonsCount: 30,
          tags: ["Marketing", "Digital", "Strategy"],
        },
        {
          id: 5,
          title: "Data Science with Python",
          description: "Analyze data and build machine learning models with Python.",
          shortDescription: "Complete data science bootcamp with Python",
          instructor: { id: 5, name: "Dr. Emily Chen", email: "emily@example.com" },
          category: "Data Science",
          level: "Advanced",
          price: 99.99,
          status: "published",
          enrolledStudents: 750,
          rating: { average: 4.9, count: 87 },
          createdAt: "2024-01-05",
          updatedAt: "2024-01-16",
          thumbnail: "/placeholder.svg?height=200&width=300",
          totalDuration: 1200,
          lessonsCount: 40,
          tags: ["Python", "Data Science", "ML"],
        },
      ]

      // Apply filters
      let filteredCourses = mockCourses

      if (filters.search) {
        filteredCourses = filteredCourses.filter(
          (course) =>
            course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            course.description.toLowerCase().includes(filters.search.toLowerCase()),
        )
      }

      if (filters.category) {
        filteredCourses = filteredCourses.filter((course) => course.category === filters.category)
      }

      if (filters.status) {
        filteredCourses = filteredCourses.filter((course) => course.status === filters.status)
      }

      if (filters.instructor) {
        filteredCourses = filteredCourses.filter((course) => course.instructor.name.includes(filters.instructor))
      }

      setCourses(filteredCourses)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCourseAction = async (courseId, action) => {
    try {
      console.log(`Performing ${action} on course ${courseId}`)

      if (action === "delete") {
        setCourses(courses.filter((course) => course.id !== courseId))
      } else if (action === "publish" || action === "unpublish") {
        setCourses(
          courses.map((course) =>
            course.id === courseId ? { ...course, status: action === "publish" ? "published" : "draft" } : course,
          ),
        )
      }

      setShowModal(false)
      setSelectedCourse(null)
    } catch (error) {
      console.error("Error performing course action:", error)
    }
  }

  const handleCreateCourse = async () => {
    try {
      const course = {
        id: Date.now(),
        ...newCourse,
        price: parseFloat(newCourse.price),
        instructor: { id: 1, name: "Current User", email: "user@example.com" },
        status: "draft",
        enrolledStudents: 0,
        rating: { average: 0, count: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalDuration: 0,
        lessonsCount: 0,
        tags: newCourse.tags.split(",").map((tag) => tag.trim()),
      }

      setCourses([course, ...courses])
      setNewCourse({
        title: "",
        description: "",
        shortDescription: "",
        category: "",
        level: "",
        price: "",
        thumbnail: "",
        tags: "",
        requirements: "",
        whatYouWillLearn: "",
      })
      setShowModal(false)
    } catch (error) {
      console.error("Error creating course:", error)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "published":
        return "badge-success"
      case "draft":
        return "badge-warning"
      case "archived":
        return "badge-secondary"
      default:
        return "badge-primary"
    }
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="course-management">
        <div className="page-header">
          <div>
            <h1>Course Management</h1>
            <p>Create, edit, and manage all courses on the platform</p>
          </div>
          <button
            onClick={() => {
              setModalType("create")
              setShowModal(true)
            }}
            className="btn btn-primary"
          >
            Create New Course
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search courses..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="form-select"
            >
              <option value="">All Categories</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Data Science">Data Science</option>
              <option value="Business">Business</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="form-select"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <input
              type="text"
              placeholder="Filter by instructor..."
              value={filters.instructor}
              onChange={(e) => setFilters({ ...filters, instructor: e.target.value })}
              className="form-input"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-thumbnail">
                <img src={course.thumbnail || "/placeholder.svg"} alt={course.title} />
                <div className="course-status">
                  <span className={`badge ${getStatusBadgeClass(course.status)}`}>{course.status}</span>
                </div>
              </div>

              <div className="course-content">
                <div className="course-header">
                  <h3 className="course-title">{course.title}</h3>
                  <div className="course-rating">
                    <span className="rating-stars">⭐ {course.rating.average || "N/A"}</span>
                    <span className="rating-count">({course.rating.count})</span>
                  </div>
                </div>

                <p className="course-description">{course.shortDescription}</p>

                <div className="course-meta">
                  <div className="meta-item">
                    <span className="meta-label">Instructor:</span>
                    <span className="meta-value">{course.instructor.name}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">{course.category}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Level:</span>
                    <span className="meta-value">{course.level}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Duration:</span>
                    <span className="meta-value">{formatDuration(course.totalDuration)}</span>
                  </div>
                </div>

                <div className="course-stats">
                  <div className="stat">
                    <span className="stat-number">{course.enrolledStudents}</span>
                    <span className="stat-label">Students</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{course.lessonsCount}</span>
                    <span className="stat-label">Lessons</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">${course.price}</span>
                    <span className="stat-label">Price</span>
                  </div>
                </div>

                <div className="course-actions">
                  <button
                    onClick={() => {
                      setSelectedCourse(course)
                      setModalType("view")
                      setShowModal(true)
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourse(course)
                      setModalType("edit")
                      setShowModal(true)
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleCourseAction(course.id, course.status === "published" ? "unpublish" : "publish")}
                    className={`btn btn-sm ${course.status === "published" ? "btn-warning" : "btn-success"}`}
                  >
                    {course.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="empty-state">
            <h3>No courses found</h3>
            <p>Try adjusting your search criteria or create a new course.</p>
            <button
              onClick={() => {
                setModalType("create")
                setShowModal(true)
              }}
              className="btn btn-primary"
            >
              Create First Course
            </button>
          </div>
        )}

        {/* Course Modal */}
        {showModal && (
          <Modal
            title={
              modalType === "create"
                ? "Create New Course"
                : modalType === "edit"
                  ? "Edit Course"
                  : "Course Details"
            }
            onClose={() => {
              setShowModal(false)
              setSelectedCourse(null)
            }}
            size="large"
          >
            {modalType === "create" ? (
              <div className="course-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Course Title</label>
                    <input
                      type="text"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                      className="form-input"
                      placeholder="Enter course title"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      value={newCourse.category}
                      onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                      className="form-select"
                    >
                      <option value="">Select Category</option>
                      <option value="Programming">Programming</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Level</label>
                    <select
                      value={newCourse.level}
                      onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                      className="form-select"
                    >
                      <option value="">Select Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price ($)</label>
                    <input
                      type="number"
                      value={newCourse.price}
                      onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                      className="form-input"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description</label>
                  <input
                    type="text"
                    value={newCourse.shortDescription}
                    onChange={(e) => setNewCourse({ ...newCourse, shortDescription: e.target.value })}
                    className="form-input"
                    placeholder="Brief description for course cards"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Full Description</label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    className="form-textarea"
                    placeholder="Detailed course description"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newCourse.tags}
                    onChange={(e) => setNewCourse({ ...newCourse, tags: e.target.value })}
                    className="form-input"
                    placeholder="React, JavaScript, Frontend"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Thumbnail URL</label>
                  <input
                    type="url"
                    value={newCourse.thumbnail}
                    onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="modal-actions">
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button onClick={handleCreateCourse} className="btn btn-primary">
                    Create Course
                  </button>
                </div>
              </div>
            ) : modalType === "view" && selectedCourse ? (
              <div className="course-details">
                <div className="course-detail-header">
                  <img
                    src={selectedCourse.thumbnail || "/placeholder.svg"}
                    alt={selectedCourse.title}
                    className="course-detail-image"
                  />
                  <div className="course-detail-info">
                    <h2>{selectedCourse.title}</h2>
                    <p className="course-instructor">by {selectedCourse.instructor.name}</p>
                    <div className="course-badges">
                      <span className={`badge ${getStatusBadgeClass(selectedCourse.status)}`}>
                        {selectedCourse.status}
                      </span>
                      <span className="badge badge-primary">{selectedCourse.category}</span>
                      <span className="badge badge-secondary">{selectedCourse.level}</span>
                    </div>
                  </div>
                </div>

                <div className="course-detail-content">
                  <div className="detail-section">
                    <h4>Description</h4>
                    <p>{selectedCourse.description}</p>
                  </div>

                  <div className="detail-section">
                    <h4>Course Statistics</h4>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <span className="stat-number">{selectedCourse.enrolledStudents}</span>
                        <span className="stat-label">Enrolled Students</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{selectedCourse.rating.average}</span>
                        <span className="stat-label">Average Rating</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{selectedCourse.lessonsCount}</span>
                        <span className="stat-label">Total Lessons</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{formatDuration(selectedCourse.totalDuration)}</span>
                        <span className="stat-label">Duration</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Tags</h4>
                    <div className="tags-list">
                      {selectedCourse.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setModalType("edit")
                    }}
                    className="btn btn-primary"
                  >
                    Edit Course
                  </button>
                  <button
                    onClick={() => handleCourseAction(selectedCourse.id, "delete")}
                    className="btn btn-danger"
                  >
                    Delete Course
                  </button>
                </div>
              </div>
            ) : (
              <div className="course-edit-form">
                <p>Edit form would go here - similar to create form but pre-populated</p>
                <div className="modal-actions">
                  <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button className="btn btn-primary">Save Changes</button>
                </div>
              </div>
            )}
          </Modal>
        )}
      </div>
    </AdminLayout>
  )
}

export default CourseManagement
