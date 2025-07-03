"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./CourseCatalog.css"

const CourseCatalog = () => {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    level: "",
    sortBy: "newest",
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
          instructor: "John Doe",
          category: "Programming",
          level: "Beginner",
          price: 49.99,
          rating: 4.8,
          students: 1250,
          duration: "8 hours",
          thumbnail: "/placeholder.svg?height=200&width=300",
          tags: ["React", "JavaScript", "Frontend"],
        },
        {
          id: 2,
          title: "Node.js Backend Development",
          description: "Build scalable backend applications with Node.js and Express.",
          instructor: "Jane Smith",
          category: "Programming",
          level: "Intermediate",
          price: 79.99,
          rating: 4.9,
          students: 890,
          duration: "12 hours",
          thumbnail: "/placeholder.svg?height=200&width=300",
          tags: ["Node.js", "Express", "Backend"],
        },
        {
          id: 3,
          title: "UI/UX Design Principles",
          description: "Master the fundamentals of user interface and user experience design.",
          instructor: "Sarah Wilson",
          category: "Design",
          level: "Beginner",
          price: 59.99,
          rating: 4.7,
          students: 2100,
          duration: "10 hours",
          thumbnail: "/placeholder.svg?height=200&width=300",
          tags: ["UI", "UX", "Design"],
        },
        {
          id: 4,
          title: "Digital Marketing Strategy",
          description: "Learn effective digital marketing strategies and tactics.",
          instructor: "Mike Johnson",
          category: "Marketing",
          level: "Intermediate",
          price: 69.99,
          rating: 4.6,
          students: 1580,
          duration: "15 hours",
          thumbnail: "/placeholder.svg?height=200&width=300",
          tags: ["Marketing", "Digital", "Strategy"],
        },
        {
          id: 5,
          title: "Data Science with Python",
          description: "Analyze data and build machine learning models with Python.",
          instructor: "Dr. Emily Chen",
          category: "Data Science",
          level: "Advanced",
          price: 99.99,
          rating: 4.9,
          students: 750,
          duration: "20 hours",
          thumbnail: "/placeholder.svg?height=200&width=300",
          tags: ["Python", "Data Science", "ML"],
        },
        {
          id: 6,
          title: "MongoDB Database Design",
          description: "Design and optimize MongoDB databases for modern applications.",
          instructor: "Alex Rodriguez",
          category: "Programming",
          level: "Intermediate",
          price: 54.99,
          rating: 4.5,
          students: 680,
          duration: "6 hours",
          thumbnail: "/placeholder.svg?height=200&width=300",
          tags: ["MongoDB", "Database", "NoSQL"],
        },
      ]

      // Apply filters
      let filteredCourses = mockCourses

      if (filters.search) {
        filteredCourses = filteredCourses.filter(
          (course) =>
            course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            course.description.toLowerCase().includes(filters.search.toLowerCase()) ||
            course.tags.some((tag) => tag.toLowerCase().includes(filters.search.toLowerCase())),
        )
      }

      if (filters.category) {
        filteredCourses = filteredCourses.filter((course) => course.category === filters.category)
      }

      if (filters.level) {
        filteredCourses = filteredCourses.filter((course) => course.level === filters.level)
      }

      // Apply sorting
      switch (filters.sortBy) {
        case "price-low":
          filteredCourses.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          filteredCourses.sort((a, b) => b.price - a.price)
          break
        case "rating":
          filteredCourses.sort((a, b) => b.rating - a.rating)
          break
        case "popular":
          filteredCourses.sort((a, b) => b.students - a.students)
          break
        default:
          // newest - no sorting needed as mock data is already in newest order
          break
      }

      setCourses(filteredCourses)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleEnroll = async (courseId) => {
    if (!user) {
      // Redirect to login
      return
    }

    try {
      // Mock enrollment - replace with API call
      alert("Enrolled successfully!")
    } catch (error) {
      console.error("Error enrolling:", error)
    }
  }

  return (
    <div className="course-catalog">
      <div className="container">
        {/* Header */}
        <div className="catalog-header">
          <h1>Course Catalog</h1>
          <p>Discover thousands of courses to advance your skills and career</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search courses..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="form-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
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
              value={filters.level}
              onChange={(e) => handleFilterChange("level", e.target.value)}
              className="form-select"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="form-select"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="results-info">
          <span>{courses.length} courses found</span>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading courses...</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-thumbnail">
                  <img src={course.thumbnail || "/placeholder.svg"} alt={course.title} />
                  <div className="course-level">
                    <span className={`badge badge-${course.level.toLowerCase()}`}>{course.level}</span>
                  </div>
                </div>

                <div className="course-content">
                  <div className="course-header">
                    <h3 className="course-title">{course.title}</h3>
                    <div className="course-rating">
                      <span className="rating-stars">⭐ {course.rating}</span>
                      <span className="rating-count">({course.students})</span>
                    </div>
                  </div>

                  <p className="course-description">{course.description}</p>

                  <div className="course-meta">
                    <span className="course-instructor">👨‍🏫 {course.instructor}</span>
                    <span className="course-duration">⏱️ {course.duration}</span>
                  </div>

                  <div className="course-tags">
                    {course.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="course-footer">
                    <div className="course-price">
                      <span className="price">${course.price}</span>
                    </div>
                    <div className="course-actions">
                      <Link to={`/course/${course.id}`} className="btn btn-secondary btn-sm">
                        Preview
                      </Link>
                      {user ? (
                        <button onClick={() => handleEnroll(course.id)} className="btn btn-primary btn-sm">
                          Enroll Now
                        </button>
                      ) : (
                        <Link to="/login" className="btn btn-primary btn-sm">
                          Login to Enroll
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {courses.length === 0 && !loading && (
          <div className="empty-state">
            <h3>No courses found</h3>
            <p>Try adjusting your search criteria or browse all courses.</p>
            <button
              onClick={() => setFilters({ search: "", category: "", level: "", sortBy: "newest" })}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseCatalog
