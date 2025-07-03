"use client"

import { useTheme } from "../../context/ThemeContext"

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${theme === "dark" ? "dark" : ""}`}
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-thumb">{theme === "dark" ? "🌙" : "☀️"}</div>
    </button>
  )
}

export default ThemeToggle
