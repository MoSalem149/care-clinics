import { useRef, useState } from "react";
import { Link } from "react-router-dom";
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

function SignUpPage() {
  /* State */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [errors, setErrors] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  /* Reference to form */
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    const validationErrors = validateForm({ fullName, email, password, role });

    // If validation fails, display errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear any existing errors if the form is valid
    setErrors({});

    const formData = {
      fullName,
      email,
      password,
      role,
    };

    try {
      // Send form data to the backend
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      // Handle success or failure response from the server
      if (response.ok) {
        setFeedbackMessage(result.message || "Registration successful!");
        setFeedbackType("success");

        // Reset the form
        formRef.current.reset();
        setFullName("");
        setEmail("");
        setPassword("");
        setRole("patient");
      } else {
        setFeedbackMessage(result.message || "An error occurred.");
        setFeedbackType("error");
      }
    } catch (error) {
      // Handle fetch error
      setFeedbackMessage("An error occurred. Please try again.");
      setFeedbackType("error");
      console.error("Error:", error);
    }
  };

  /* Clear specific field errors on change */
  const handleInputChange = (field, value) => {
    switch (field) {
      case "fullName":
        setFullName(value);
        if (errors.fullName) {
          setErrors((prevErrors) => ({ ...prevErrors, fullName: "" }));
        }
        break;
      case "email":
        setEmail(value);
        if (errors.email) {
          setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
        }
        break;
      case "password":
        setPassword(value);
        if (errors.password) {
          setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
        }
        break;
      default:
        break;
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
        <HelmetProvider>
          <div className="sign-up-container">
            <Helmet>
              <title>Sign Up Page</title>
            </Helmet>

            {/* Left Side */}
            <div className="signUp-left-side">
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

              <h1>Welcome!</h1>

              <div className="signUp-social-login">
                <button className="signUp-social-btn">
                  <img src={facebookIcon} alt="Facebook Icon" />
                </button>
                <button className="signUp-social-btn google">
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
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
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
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Password"
                    required
                  />
                </div>

                {/* Hidden input to keep role for submission */}
                <input
                  type="hidden"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </form>

              {/* Display Feedback */}
              {feedbackMessage && (
                <div className={`feedback ${feedbackType}`}>
                  {feedbackMessage}
                </div>
              )}

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
            <div className="signUp-right-side">
              <h3>Already have an account?</h3>
              <Link to="/login" className="signUp-btn">
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
                className="signUp-illustration-img"
              />
            </div>
          </div>
        </HelmetProvider>
      </motion.div>
    </AnimatePresence>
  );
}

export default SignUpPage;
