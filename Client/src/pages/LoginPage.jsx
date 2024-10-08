import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
/* Import assets */
import whiteArrowIcon from "../assets/images/SignUp-Login-img/white-arrow-icon.png";
import illustrationImg from "../assets/images/SignUp-Login-img/illustration-img.png";
/* Import Components */
import LoginSocialIcon from "../components/LoginSocialIcon";
import LoginForm from "../components/LoginForm";
/* Import CSS */
import "../styles/LoginPage.css";

function LoginPage() {
  /* JSX */
  return (
    /* Login Page */
    <AnimatePresence>
      {/* Motion */}
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
              <title>Login Page</title>
            </Helmet>
            {/* Left Side */}
            <div className="login-left-side">
              <h3>Don’t have an account?</h3>
              <Link to="/signup" className="sign-up-btn">
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
              {/* Social Login Components */}
              <LoginSocialIcon />
              {/* Login Form */}
              <LoginForm />
            </div>
          </div>
        </HelmetProvider>
      </motion.div>
    </AnimatePresence>
  );
}

export default LoginPage;
