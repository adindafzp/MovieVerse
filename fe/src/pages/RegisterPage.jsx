import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/RegisterPage.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundImage from "../assets/img/LoginPage/BackgroundLoginPage.jpg";
import { Navbar } from "react-bootstrap";


const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); 
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError("Invalid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/admin/user/register", {
        name,
        email,
        username,
        password,
        role: "user", 
      });

      if (response.data.success) {
        setMessage("Registrasi berhasil! Silakan cek email Anda untuk verifikasi.");
      } else {
        setMessage("Registrasi berhasil, namun ada masalah dengan email verifikasi.");
      }
      setError(null);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Register gagal, coba lagi.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="login-container">
      <div className="content-wrapper">
        <div className="left-content">
          <img src={BackgroundImage} alt="Background" className="background-image" />
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

        <div className="right-content">
          <form onSubmit={handleSubmit}>
            <h2>Sign up</h2>
            <p>
              If you already have an account, you can <Link to="/login">Login here!</Link>
            </p>
            <div className="input-box">
              <input
                type="text"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <i className="bi bi-person icon"></i>
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Enter your User name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <i className="bi bi-person icon"></i>
            </div>
            <div className="input-box">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="bi bi-envelope icon"></i>
            </div>
            <div className="input-box">
              <input
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} icon`}
                onClick={togglePasswordVisibility} 
                style={{ cursor: "pointer" }}
              ></i>
            </div>
            <div className="input-box">
              <input
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm your Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i
                className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} icon`}
                onClick={toggleConfirmPasswordVisibility} 
                style={{ cursor: "pointer" }}
              ></i>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <button type="submit" className="register-btn">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
