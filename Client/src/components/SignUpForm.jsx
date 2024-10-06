import { useRef, useState } from "react";
/* Import JS */
import { validateForm } from "../utils/signUpFormValidation";
/* Import assets */
import blueArrowIcon from "../assets/images/SignUp-SignIn-img/blue-arrow-icon.png";

const SignUpForm = () => {
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
        <input
          type="hidden"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
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
        <img src={blueArrowIcon} alt="Blue Arrow Icon" />
      </button>
    </>
  );
};

export default SignUpForm;
