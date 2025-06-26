import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import React, { useState } from "react"
import "./styles/global.css"

// Components
import Navbar from "./components/layout/Navbar"
import LandingPage from "./components/pages/LandingPage"
import Dashboard from "./components/pages/Dashboard"
import CourseCatalog from "./components/pages/CourseCatalog"
//import CoursePlayer from "./components/pages/CoursePlayer"
//import Quiz from "./components/pages/Quiz"
import Profile from "./components/pages/Profile"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"

// Context
import { AuthProvider } from "./context/AuthContext"

function App() {
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Pass a prop to Navbar to trigger the profile popup */}
          <Navbar onProfileClick={() => setShowProfilePopup(true)} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<CourseCatalog />} />
            {/* <Route path="/course/:id" element={<CoursePlayer />} /> */}
            {/* <Route path="/quiz/:id" element={<Quiz />} /> */}
            <Route path="/profile" element={<Profile />} />
          </Routes>
          {/* Profile popup for Navbar */}
          {showProfilePopup && (
            <Profile popup={true} onClose={() => setShowProfilePopup(false)} />
          )}
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
