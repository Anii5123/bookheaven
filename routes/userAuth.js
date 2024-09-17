const jwt = require("jsonwebtoken");

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ msg: "No token provided, authorization denied" });
  }

  jwt.verify(token, "bookstore123", (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ msg: "Token expired. Please signIn again." });
      }
      return res.status(403).json({ msg: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
