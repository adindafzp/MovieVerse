// middlewares/roleMiddleware.js

const roleMiddleware = (roles) => {
    return (req, res, next) => {
      // Pastikan role pengguna ada dalam daftar role yang diizinkan
      if (!roles.includes(req.userRole)) {
        return res.status(403).json({ message: "Akses ditolak. Role tidak sesuai." });
      }
      next(); // Lanjutkan ke middleware berikutnya atau route handler
    };
  };
  
  module.exports = roleMiddleware;
  