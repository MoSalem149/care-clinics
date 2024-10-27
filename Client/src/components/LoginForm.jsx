import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "./Context/userContext";
import { jwtDecode } from "jwt-decode";
/* Import assets */
import blueArrowIcon from "../assets/images/SignUp-Login-img/blue-arrow-icon.png";
const LoginForm = () => {
  /* State */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const { updateUserRole, updateAuthToken } = useUsers();

  const navigate = useNavigate();

  const displayFeedback = (message, type) => {
    setFeedback(message);
    setFeedbackType(type);
    if (type === "success") {
      setTimeout(() => {
        setFeedback("");
      }, 3000);
    }
  };

  /* Function to handle form submission */
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      displayFeedback("Email and password are required.", "error");
      return;
    }
  
    const formData = { email, password };
  
    try {
      const response = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok && result.token) {
        localStorage.setItem("token", result.token);
  
        const decoded = jwtDecode(result.token);
        const userRole = decoded.role;
        localStorage.setItem("userRole", userRole);
  
        displayFeedback("Login successful!", "login-success");
  
        setTimeout(() => {
          if (result.hasProfile) {
            if (userRole === "user") {
              navigate("/patient-home");
            } else if (userRole === "doctor") {
              navigate("/doctor-home");
            } else {
              navigate("/patient-home");
            }
          } else {
            if (userRole === "user") {
              navigate("/user-form");
            } else if (userRole === "doctor") {
              navigate("/doctor-form");
            }
          }
        }, 1500);
      } else {
        displayFeedback(`Login failed: ${result.message}`, "error");
      }
    } catch (error) {
      displayFeedback(`An error occurred: ${error.message}`, "error");
      console.error("Fetch error:", error);
    }
  };
  
  
  

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (feedbackType === "error") {
      setFeedback("");
    }
  };

  const handleForgetPassword = () => {
    navigate("/forget-password");
  };

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleChange(setEmail)}
          placeholder="Email Address"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handleChange(setPassword)}
          placeholder="Password"
          required
        />
        <button
          type="button"
          className="forget-password"
          onClick={handleForgetPassword}
        >
          Forget password?
        </button>
        {feedback && (
          <p className={`feedback-message ${feedbackType}`}>{feedback}</p>
        )}
      </form>
      <button className="login-btn" type="submit" onClick={handleSubmit}>
        <span>Login</span>
        <img src={blueArrowIcon} alt="Blue Arrow Icon" />
      </button>
    </>
  );
};

export default LoginForm;
