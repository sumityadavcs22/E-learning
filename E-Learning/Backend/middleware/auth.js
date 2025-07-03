const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key")

    // Check if user still exists
    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      return res.status(401).json({ message: "Token is not valid - user not found" })
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated" })
    }

    req.user = {
      userId: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    }

    next()
  } catch (error) {
    console.error("Auth middleware error:", error)

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token is not valid" })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" })
    }

    res.status(401).json({ message: "Token verification failed" })
  }
}

module.exports = auth
