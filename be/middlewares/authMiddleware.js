// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Lampirkan informasi pengguna ke request object
    req.userId = decoded.userId;
    req.userRole = decoded.role; // Tambahkan role ke request object
    next(); // Lanjutkan ke middleware berikutnya atau route handler
  });
};
