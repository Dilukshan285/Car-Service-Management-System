// backend/middleware/verifyToken.js
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add decoded user info to request object
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default verifyToken;