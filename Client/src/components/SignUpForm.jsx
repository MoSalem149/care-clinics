import { useRef, useState } from "react";
/* Import assets */
import blueArrowIcon from "../assets/images/SignUp-Login-img/blue-arrow-icon.png";
/* Import JS */
import { validateForm } from "../utils/signUpFormValidation";
import { useNavigate } from "react-router-dom";

const SignUpForm = ({ selectedRole }) => {
  /* State */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  /* Reference to form */
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = validateForm({ fullName, email, password, role: selectedRole });
  
    // If validation fails, display errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    setErrors({});
  
    const formData = {
      fullName,
      email,
      password,
      role: selectedRole,
    };
  
    try {
      // Send form data to the backend
      const response = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setFeedbackMessage(result.message || "Registration successful!");
        setFeedbackType("success");
  
        formRef.current.reset();
        setFullName("");
        setEmail("");
        setPassword("");
  
        setTimeout(() => {
          if (selectedRole === "doctor") {
            navigate("/doctor-form");
          } else if (selectedRole === "user") {
            navigate("/user-form");
          }
        }, 2000);
      } else {
        setFeedbackMessage(result.message || "An error occurred.");
        setFeedbackType("error");
      }
    } catch (error) {
      setFeedbackMessage("An error occurred. Please try again.");
      setFeedbackType("error");
      console.error("Error:", error);
    }
  };
  

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

  /* Handle external button click */
  const handleSignUpClick = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  return (
    <>
      {/* Sign Up Form */}
      <form className="sign-up-form" ref={formRef} onSubmit={handleSubmit}>
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
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Full Name"
            required
          />
        </div>
        <div className="input-container">
          <div className="label-error-container">
            <label htmlFor="email">Email Address</label>
            {errors.email && <span className="error">{errors.email}</span>}
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
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {/* Hidden input to keep role for submission */}
        <input type="hidden" value={selectedRole} />
      </form>
      {/* Display Feedback */}
      {feedbackMessage && (
        <div className={`feedback ${feedbackType}`}>{feedbackMessage}</div>
      )}
      {/* Sign Up Button */}
      <button
        type="button"
        className="sign-up-btn-left-side"
        onClick={handleSignUpClick}
      >
        <span>Sign Up</span>
        <img
          src={blueArrowIcon}
          alt="Blue Arrow Icon"
          className="arrow-icon"
        />
      </button>
    </>
  );
};

export default SignUpForm;
