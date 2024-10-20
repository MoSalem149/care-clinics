import { useRef, useState } from "react";
import blueArrowIcon from "../assets/images/SignUp-Login-img/blue-arrow-icon.png";
import { validateForm } from "../utils/signUpFormValidation";

const SignUpForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [errors, setErrors] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm({ fullName, email, password, role });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const formData = {
      fullName,
      email,
      password,
      role,
    };

    try {
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
        setRole("");
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

  const handleSignUpClick = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  return (
    <>
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
        <input
          type="hidden"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </form>
      {feedbackMessage && (
        <div className={`feedback ${feedbackType}`}>{feedbackMessage}</div>
      )}
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
