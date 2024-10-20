// routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware"); // Tambahkan roleMiddleware

const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router(); // Menggunakan express.Router()

// Pastikan fungsi sendVerificationEmail dan verifyEmail diekspor dari userController
const { sendVerificationEmail, verifyEmail } = userController;

// Route yang dilindungi dengan autentikasi
router.get("/", authMiddleware, roleMiddleware(['admin']), userController.getAllUsers); // Hanya admin yang bisa mengakses
router.get("/:id", authMiddleware, roleMiddleware(['admin', 'user']), userController.getUserById); // Admin dan pengguna biasa bisa mengakses

// Route publik untuk register dan login
router.post("/register", async (req, res) => {
  try {
    const user = await userController.register(req, res);
    if (user) {
      await sendVerificationEmail(user, res); // Panggil sendVerificationEmail dengan benar
    }
  } catch (error) {
    console.error("Error saat registrasi:", error);
    res.status(500).json({ message: "Gagal registrasi." });
  }
});

router.post("/login", userController.login);

// Forgot and Reset Password Routes
router.post("/forgotPassword", (req, res, next) => {
  console.log("Forgot password request received with email:", req.body.email);
  next(); // Lanjutkan ke controller
}, userController.forgotPassword);

router.post("/resetPassword/:token", userController.resetPassword);

// Redirect ke Google untuk login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback setelah login sukses dari Google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id, name: req.user.name, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Redirect ke frontend dengan token di URL
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

// Route untuk verifikasi email
router.get('/verify/:token', verifyEmail);

module.exports = router;
