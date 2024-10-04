import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
/* Import assets */
import facebookIcon from "../assets/images/SignUp-SignIn-img/facebook-icon.png";
import gmailIcon from "../assets/images/SignUp-SignIn-img/gmail-icon.png";
import blueArrowIcon from "../assets/images/SignUp-SignIn-img/blue-arrow-icon.png";
import whiteArrowIcon from "../assets/images/SignUp-SignIn-img/white-arrow-icon.png";
import illustrationImg from "../assets/images/SignUp-SignIn-img/illustration-img.png";
/* Import CSS */
import "../styles/LoginPage.css";

function LoginPage() {
  /* State */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState(""); // For displaying feedback messages
  const [feedbackType, setFeedbackType] = useState(""); // For feedback type (success/error)

  /* Function to display feedback */
  const displayFeedback = (message, type) => {
    setFeedback(message);
    setFeedbackType(type);
    if (type === "success") {
      setTimeout(() => {
        setFeedback(""); // Clear success feedback after 3 seconds
      }, 3000);
    }
  };

  /* Function to handle form submission */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!email || !password) {
      displayFeedback("Email and password are required.", "error");
      return; // Stop further execution if validation fails
    }

    // Prepare form data
    const formData = {
      email,
      password,
    };

    try {
      // Send POST request to the server
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      // Check if the login is successful
      if (response.ok && result.token) {
        // Store the token and user details
        localStorage.setItem("token", result.token); // Storing token

        // Display success feedback
        displayFeedback("Login successful!", "login-success");

        // Redirect to the exam page after successful login
        setTimeout(() => {
          window.location.href = "../welcome/welcome.html"; // Redirect to exam page
        }, 1500);
      } else {
        // Handle failed login with appropriate feedback
        displayFeedback(`Login failed: ${result.message}`, "error");
      }
    } catch (error) {
      // Handle fetch request errors
      displayFeedback(`An error occurred: ${error.message}`, "error");
      console.error("Fetch error:", error);
    }
  };

  /* Function to clear error message when user starts typing */
  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (feedbackType === "error") {
      setFeedback(""); // Clear error feedback when the user types
    }
  };

  /* JSX */
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
      >
        {/* Helmet */}
        <HelmetProvider>
          {/* Container */}
          <div className="login-container">
            <Helmet>
              <title>Sign In Page</title>
            </Helmet>
            {/* Left Side */}
            <div className="login-left-side">
              <h3>Don’t have an account?</h3>
              <Link to={"/signup"} className="login-btn">
                <span>Sign Up</span>
                <img
                  src={whiteArrowIcon}
                  alt="White Arrow Icon"
                  className="arrow-icon"
                />
              </Link>
              <img
                src={illustrationImg}
                alt="Medical Illustration"
                className="login-illustration-img"
              />
            </div>
            {/* Right Side */}
            <div className="login-right-side">
              {/* Header */}
              <h1>Welcome Back</h1>
              {/* Social Login */}
              <div className="social-login">
                <button className="login-social-btn ">
                  <img src={facebookIcon} alt="Facebook Icon" />
                </button>
                <button className="login-social-btn google">
                  <img src={gmailIcon} alt="Google Icon" />
                </button>
              </div>
              {/* Form */}
              <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleChange(setEmail)} // Clear error on change
                  placeholder="Email Address"
                  required
                />
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handleChange(setPassword)} // Clear error on change
                  placeholder="Password"
                  required
                />
                <span className="forget-password">Forget password ?</span>
                {/* Feedback Message */}
                {feedback && (
                  <p className={`feedback-message ${feedbackType}`}>
                    {feedback}
                  </p>
                )}
              </form>
              {/* Login Button */}
              <button
                className="login-btn"
                type="submit"
                onClick={handleSubmit}
              >
                <span>Login</span>
                <img src={blueArrowIcon} alt="Blue Arrow Icon" />
              </button>
            </div>
          </div>
        </HelmetProvider>
      </motion.div>
    </AnimatePresence>
  );
}

export default LoginPage;
