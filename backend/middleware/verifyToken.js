// backend/middleware/verifyToken.js
import jwt from "jsonwebtoken";
import errorHandler from "../utils/error.js";

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "Unauthorized"));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Invalid or expired token"));
    req.user = user;
    next();
  });
};

export default verifyToken;