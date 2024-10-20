const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Op } = require("sequelize"); // Pastikan menambahkan Op dari Sequelize untuk query

// Konfigurasi Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ message: "Success fetch data user", data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};

// Function to get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user", error: err });
  }
};

// Fungsi Registrasi
exports.register = async (req, res) => {
  const { name, email, password, role, username } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ userId: email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      username,
      isVerified: false,
      verificationToken: verificationToken
    });

    await this.sendVerificationEmail(newUser, verificationToken, res);
    res.status(201).json({ message: 'Registrasi berhasil. Silakan cek email Anda untuk verifikasi.' });
  } catch (error) {
    console.error('Error registrasi:', error);
    res.status(500).json({ message: 'Gagal registrasi.' });
  }
};

// Fungsi untuk mengirim email verifikasi
exports.sendVerificationEmail = async (user, token, res) => {
  const verificationLink = `http://localhost:3000/api/admin/user/verify/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Verifikasi Email - MovieVerse',
    html: `<h2>Hai ${user.name}!</h2>
           <p>Terima kasih telah mendaftar. Klik link berikut untuk memverifikasi akun Anda:</p>
           <a href="${verificationLink}">Verifikasi Email</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email verifikasi terkirim');
  } catch (error) {
    console.error('Error saat mengirim email:', error);
    res.status(500).json({ message: 'Gagal mengirim email verifikasi.' });
  }
};

// Fungsi verifikasi email
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { email: decoded.userId } });
    if (!user) {
      return res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Email berhasil diverifikasi. Silakan login.' });
  } catch (error) {
    console.error('Error saat verifikasi email:', error);
    res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
};

// Fungsi login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password diperlukan" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email belum diverifikasi" });
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login berhasil", token });
  } catch (err) {
    console.error("Error saat login:", err);
    res.status(500).json({ message: "Gagal login" });
  }
};

// Fungsi untuk lupa password
// Fungsi untuk lupa password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Email tidak ditemukan.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000);

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    const resetLink = `http://localhost:5173/resetPassword/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Reset Password - MovieVerse',
      html: `<p>Klik link berikut untuk mereset password Anda:</p>
             <a href="${resetLink}">Reset Password</a>`
    };

    console.log("Sending email to:", user.email); // Menambah log email
    console.log("Reset link:", resetLink); // Log untuk melihat apakah link benar

    await transporter.sendMail(mailOptions);
    console.log('Email reset password terkirim');
    res.status(200).json({ message: 'Link reset password telah dikirim ke email Anda.' });
  } catch (error) {
    console.error('Error saat lupa password:', error); // Periksa apakah ada error detail
    res.status(500).json({ message: 'Gagal mengirim email reset password.' });
  }
};

// Fungsi untuk reset password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token tidak valid atau sudah kadaluarsa.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password berhasil direset.' });
  } catch (error) {
    console.error('Error saat reset password:', error);
    res.status(500).json({ message: 'Gagal mereset password.' });
  }
};
