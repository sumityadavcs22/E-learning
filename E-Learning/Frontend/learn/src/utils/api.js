// API utility functions
import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API calls
export const authAPI = {
  login: (email, password) => api.post("/api/auth/login", { email, password }),
  register: (name, email, password) => api.post("/api/auth/register", { name, email, password }),
  getProfile: () => api.get("/api/auth/me"),
  updateProfile: (data) => api.put("/api/auth/profile", data),
}

// Course API calls
export const courseAPI = {
  getAllCourses: () => api.get("/api/courses"),
  getCourse: (id) => api.get(`/api/courses/${id}`),
  createCourse: (data) => api.post("/api/courses", data),
  updateCourse: (id, data) => api.put(`/api/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/api/courses/${id}`),
  enrollCourse: (id) => api.post(`/api/courses/${id}/enroll`),
  getEnrolledCourses: () => api.get("/api/courses/enrolled"),
}

// User API calls
export const userAPI = {
  getAllUsers: () => api.get("/api/users"),
  getUser: (id) => api.get(`/api/users/${id}`),
  updateUser: (id, data) => api.put(`/api/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
  getUserStats: () => api.get("/api/users/stats"),
}

// Quiz API calls
export const quizAPI = {
  getQuiz: (id) => api.get(`/api/quizzes/${id}`),
  submitQuiz: (id, answers) => api.post(`/api/quizzes/${id}/submit`, { answers }),
  getQuizResults: (id) => api.get(`/api/quizzes/${id}/results`),
}

export default api
11