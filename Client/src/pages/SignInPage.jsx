import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
/* Import assets */
import facebookIcon from "../assets/images/SignUp-SignIn-img/facebook-icon.png";
import gmailIcon from "../assets/images/SignUp-SignIn-img/gmail-icon.png";
import blueArrowIcon from "../assets/images/SignUp-SignIn-img/blue-arrow-icon.png";
import whiteArrowIcon from "../assets/images/SignUp-SignIn-img/white-arrow-icon.png";
import illustrationImg from "../assets/images/SignUp-SignIn-img/illustration-img.png";
/* Import CSS */
import "../styles/SignInPage.css";

const SignInPage = () => {
  /* State */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* Function */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
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
          <div className="sign-in-container">
            <Helmet>
              <title>Sign In Page</title>
            </Helmet>
            {/* Left Side */}
            <div className="left-side">
              <h3>Don’t have an account?</h3>
              <button className="sign-up-btn">
                <span>Sign Up</span>
                <img
                  src={whiteArrowIcon}
                  alt="White Arrow Icon"
                  className="arrow-icon"
                />
              </button>
              <img
                src={illustrationImg}
                alt="Medical Illustration"
                className="illustration-img"
              />
            </div>
            {/* Right Side */}
            <div className="right-side">
              {/* Header */}
              <h1>Welcome Back</h1>
              {/* Social Login */}
              <div className="social-login">
                <button className="social-btn ">
                  <img src={facebookIcon} alt="Facebook Icon" />
                </button>
                <button className="social-btn google">
                  <img src={gmailIcon} alt="Google Icon" />
                </button>
              </div>
              {/* Form */}
              <form className="sign-in-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                />
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
                <span className="forget-password">Forget password ?</span>
              </form>
              {/* Sign In Button */}
              <button className="sign-in-btn">
                <span>Sign In</span>
                <img src={blueArrowIcon} alt="Blue Arrow Icon" />
              </button>
            </div>
          </div>
        </HelmetProvider>
      </motion.div>
    </AnimatePresence>
  );
};

export default SignInPage;
