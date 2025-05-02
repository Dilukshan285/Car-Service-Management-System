import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  console.log("Cookies:", req.cookies);
  const token = req.cookies?.access_token || req.headers["authorization"]?.split(" ")[1];
  console.log("Token received in verifyToken:", token);

  // If no token is present, log a message but don't treat it as an error
  if (!token) {
    console.warn("No token provided. Proceeding without authentication.");
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    
    // Handle only specific token errors
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // If it's another error, send a generic response
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default verifyToken;
