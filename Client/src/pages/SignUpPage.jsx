import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
/* Import assets */
import patientIcon from "../assets/images/SignUp-Login-img/patient-icon.png";
import doctorIcon from "../assets/images/SignUp-Login-img/doctor-icon.png";
import whiteArrowIcon from "../assets/images/SignUp-Login-img/white-arrow-icon.png";
import illustrationImg from "../assets/images/SignUp-Login-img/illustration-img.png";
/* Import Components */
import SignUpSocialIcon from "../components/LoginSocialIcon";
import SignUpForm from "../components/SignUpForm";
/* Import CSS */
import "../styles/SignUpPage.css";

function SignUpPage() {
  /* State */
  const [role, setRole] = useState("user");

  /* JSX */
  return (
    /* Sign Up Page */
    <AnimatePresence>
      {/* Motion */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.5 }}
      >
        {/* Helmet */}
        <HelmetProvider>
          {/* Container */}
          <div className="sign-up-container">
            <Helmet>
              <title>Sign Up Page</title>
            </Helmet>
            {/* Left Side */}
            <div className="sign-up-left-side">
              <div className="user-switch">
                <div className="button-container">
                  <img
                    className={role === "user" ? "active" : ""}
                    src={patientIcon}
                    alt="Patient Icon"
                    onClick={() => setRole("user")}
                  />
                  <button
                    className={role === "user" ? "active" : ""}
                    onClick={() => setRole("user")}
                  >
                    Patient
                  </button>
                </div>
                <div className="button-container">
                  <img
                    className={role === "doctor" ? "active" : ""}
                    src={doctorIcon}
                    alt="Doctor Icon"
                    onClick={() => setRole("doctor")}
                  />
                  <button
                    className={role === "doctor" ? "active" : ""}
                    onClick={() => setRole("doctor")}
                  >
                    Doctor
                  </button>
                </div>
              </div>
              <h1>Welcome!</h1>
              <SignUpSocialIcon />
              <SignUpForm selectedRole={role} />
            </div>
            {/* Right Side */}
            <div className="sign-up-right-side">
              <h3>Already have an account?</h3>
              <Link to="/login" className="login-btn-right-side">
                <span>Login</span>
                <img
                  src={whiteArrowIcon}
                  alt="White Arrow Icon"
                  className="arrow-icon"
                />
              </Link>
              <img
                src={illustrationImg}
                alt="Medical Illustration"
                className="sign-up-illustration-img"
              />
            </div>
          </div>
        </HelmetProvider>
      </motion.div>
    </AnimatePresence>
  );
}

export default SignUpPage;
