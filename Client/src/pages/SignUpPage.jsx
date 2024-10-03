import { useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { validateForm } from "../utils/SignUpFormValidation";
/* Import assets */
import patientIcon from "../assets/images/SignUp-SignIn-img/patient-icon.png";
import doctorIcon from "../assets/images/SignUp-SignIn-img/doctor-icon.png";
import facebookIcon from "../assets/images/SignUp-SignIn-img/facebook-icon.png";
import gmailIcon from "../assets/images/SignUp-SignIn-img/gmail-icon.png";
import blueArrowIcon from "../assets/images/SignUp-SignIn-img/blue-arrow-icon.png";
import whiteArrowIcon from "../assets/images/SignUp-SignIn-img/white-arrow-icon.png";
import illustrationImg from "../assets/images/SignUp-SignIn-img/illustration-img.png";
/* Import CSS */
import "../styles/SignUpPage.css";

const SignUpPage = () => {
  /* State */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [errors, setErrors] = useState({});

  /* Reference to form */
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get the validation errors
    const validationErrors = validateForm({ fullName, email, password, role });

    // Check if there are any validation errors
    if (Object.keys(validationErrors).length === 0) {
      // If no errors, proceed with form submission logic
      console.log("Full Name:", fullName);
      console.log("Email:", email);
      console.log("Password:", password);
      console.log("Role:", role);
    } else {
      // Set the errors in the state to display them
      setErrors(validationErrors);
      console.log("Form contains errors:", validationErrors);
    }
  };

  const handleSignUpClick = () => {
    // Manually trigger form submission
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  /* JSX */
  return (
    <AnimatePresence>
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
            <div className="left-side">
              <div className="user-switch">
                <div className="button-container">
                  <img
                    className={role === "patient" ? "active" : ""}
                    src={patientIcon}
                    alt="Patient Icon"
                    onClick={() => setRole("patient")}
                  />
                  <button
                    className={role === "patient" ? "active" : ""}
                    onClick={() => setRole("patient")}
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
              {/* Header */}
              <h1>Welcome!</h1>
              {/* Social Login */}
              <div className="social-login">
                <button className="social-btn">
                  <img src={facebookIcon} alt="Facebook Icon" />
                </button>
                <button className="social-btn google">
                  <img src={gmailIcon} alt="Google Icon" />
                </button>
              </div>
              {/* Form */}
              <form
                className="sign-up-form"
                ref={formRef}
                onSubmit={handleSubmit}
              >
                <div className="input-container">
                  <div className="label-error-container">
                    <label htmlFor="full-name">Full Name</label>
                    {errors.fullName && (
                      <span className="error">{errors.fullName}</span>
                    )}
                  </div>
                  <input
                    type="text"
                    id="full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div className="input-container">
                  <div className="label-error-container">
                    <label htmlFor="email">Email Address</label>
                    {errors.email && (
                      <span className="error">{errors.email}</span>
                    )}
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                  />
                </div>
                <div className="input-container">
                  <div className="label-error-container">
                    <label htmlFor="password">Password</label>
                    {errors.password && (
                      <span className="error">{errors.password}</span>
                    )}
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                </div>
                {/* Hidden role input */}
                <input
                  type="hidden"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </form>
              {/* Sign Up Button */}
              <button
                type="button"
                className="sign-up-btn"
                onClick={handleSignUpClick}
              >
                <span className="sign-up-span">Sign Up</span>
                <img src={blueArrowIcon} alt="Blue Arrow Icon" />
              </button>
            </div>
            {/* Right Side */}
            <div className="right-side">
              <h3>Already have an account?</h3>
              <button className="sign-in-btn">
                <span>Sign In</span>
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
          </div>
        </HelmetProvider>
      </motion.div>
    </AnimatePresence>
  );
};

export default SignUpPage;
