const verifyToken = (req, res, next) => {
  const token =
    req.cookies.access_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("Token not found");
    return res.status(401).json("You are not authenticated!");
  }

  verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification error:", err);
      return res.status(403).json("Token is not valid");
    }

    // Attach the user object from the token to req for use in controllers
    req.user = user;
    console.log("Verified user:", user);

    next();
  });
};

export default verifyToken;
