import { useState } from "react";
import { useNavigate } from "react-router-dom";
/* Import assets */
import blueArrowIcon from "../assets/images/SignUp-Login-img/blue-arrow-icon.png";
const LoginForm = () => {
  /* State */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  /* Navigate */
  const navigate = useNavigate();

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
      const response = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      // Check if the login is successful
      if (response.ok && result.token) {
        // Store the token and user details
        localStorage.setItem("token", result.token); 

        displayFeedback("Login successful!", "login-success");

        // Redirect to the exam page after successful login
        setTimeout(() => {
        navigate('/')        }, 1500);
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

  /* Function to handle forget password */
  const handleForgetPassword = () => {
    navigate("/forget-password");
  };

  /* JSX */
  return (
    <>
      {/* Login Form */}
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
        {/* Forget Password Button */}
        <button
          type="button"
          className="forget-password"
          onClick={handleForgetPassword}
        >
          Forget password?
        </button>
        {/* Feedback Message */}
        {feedback && (
          <p className={`feedback-message ${feedbackType}`}>{feedback}</p>
        )}
      </form>
      {/* Login Button */}
      <button className="login-btn" type="submit" onClick={handleSubmit}>
        <span>Login</span>
        <img src={blueArrowIcon} alt="Blue Arrow Icon" />
      </button>
    </>
  );
};

export default LoginForm;
