import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./styles/global.css"

// Context Providers
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"

// Components
import Navbar from "./components/layout/Navbar"
import ProtectedRoute from "./components/common/ProtectedRoute"
import AdminRoute from "./components/common/AdminRoute"

// Pages
import LandingPage from "./components/pages/LandingPage"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"

// Student Portal
import StudentDashboard from "./components/student/StudentDashboard"
import CourseCatalog from "./components/student/CourseCatalog"
import CoursePlayer from "./components/student/CoursePlayer"
import Quiz from "./components/student/Quiz"
import StudentProfile from "./components/student/StudentProfile"

// Admin Portal
import AdminDashboard from "./components/admin/AdminDashboard"
import UserManagement from "./components/admin/UserManagement"
import CourseManagement from "./components/admin/CourseManagement"
import Analytics from "./components/admin/Analytics"
import AdminSettings from "./components/admin/AdminSettings"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<CourseCatalog />} />

              {/* Student Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/course/:id"
                element={
                  <ProtectedRoute>
                    <CoursePlayer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/:id"
                element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <StudentProfile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <AdminRoute>
                    <CourseManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <AdminRoute>
                    <Analytics />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminRoute>
                    <AdminSettings />
                  </AdminRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
