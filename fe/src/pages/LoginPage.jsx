import { useState, useEffect } from "react"; // Tambahkan useEffect
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/LoginPage.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundImage from "../assets/img/LoginPage/BackgroundLoginPage.jpg";
import { Navbar } from "react-bootstrap";

const LoginPage = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Tambahkan state untuk visibilitas password
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Tambahkan state untuk loading
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Tambahkan state untuk Lazy Loading gambar
  const navigate = useNavigate();

  // Tangani token setelah redirect dari Google Login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token); // Simpan token di localStorage
      setIsAuth(true); // Set status autentikasi ke true
      navigate("/home"); // Redirect ke home
    }
  }, [navigate, setIsAuth]); // Pastikan dependency useEffect diisi

  // Lazy load untuk gambar
  useEffect(() => {
    const img = new Image();
    img.src = BackgroundImage;
    img.onload = () => setIsImageLoaded(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state ke true saat login dimulai

    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/user/login",
        { email, password }
      );

      console.log("Response dari backend:", response.data);

      localStorage.setItem("token", response.data.token); // Simpan token
      setIsAuth(true); // Set status autentikasi
      navigate("/home"); // Redirect ke home
    } catch (err) {
      if (err.response) {
        console.log("Error dari backend:", err.response.data);
        setError("Login gagal, cek email atau password Anda.");
      } else {
        console.error("Error yang tidak terduga:", err);
        setError("Terjadi kesalahan, coba lagi nanti.");
      }
    } finally {
      setIsLoading(false); // Set loading state ke false setelah login selesai
    }
  };

  // Fungsi untuk login dengan Google
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/admin/user/auth/google";
  };

  // Fungsi untuk toggle visibilitas password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="content-wrapper">
        {/* Konten kiri untuk background image */}
        <div className="left-content">
          {isImageLoaded && (
            <img
              src={BackgroundImage}
              alt="Background"
              className="background-image"
            />
          )}
          <Navbar.Brand
            className="Logo"
            style={{
              position: "absolute",
              zIndex: 999,
              top: "20px",
              left: "10px",
            }}
          >
            <img src="/logo.png" alt="Logo" style={{ height: "30px" }} />
          </Navbar.Brand>
        </div>

        {/* Form login di sebelah kanan */}
        <div className="right-content">
          <form onSubmit={handleSubmit}>
            <h2>Sign in</h2>
            <p>
              If you don’t have an account register
              <br />
              you can <Link to="/register">Register here!</Link>
            </p>
            <div className="input-box">
              <input
                type="text"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="bi bi-envelope icon"></i>
            </div>
            <div className="input-box">
              <input
                type={showPassword ? "text" : "password"} // Tipe berubah saat toggle
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} icon`} // Ganti ikon mata/kunci
                onClick={togglePasswordVisibility} // Tambahkan event untuk toggle visibilitas password
                style={{ cursor: "pointer" }} // Tambahkan gaya cursor pointer
              ></i>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="remember-forgot">
              <a href="/forgotPassword">Forgot Password?</a>
            </div>
            <button className="login-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </button>

            <div className="social-login">
              <p>or continue with</p>
              <div className="social-buttons">
                <button className="google-btn" onClick={handleGoogleLogin}>
                  <FcGoogle />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
