import { useState, useRef } from "react";
/* Import assets */
import axios from "axios";
import blueArrowIcon from "../assets/images/SignUp-Login-img/blue-arrow-icon.png";

const ForgetPasswordForm = () => {
  /* State */
  const [emailAddress, setEmailAddress] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState("");

  /* Reference to form */
  const formRef = useRef(null);
  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/users/forgot-password",
        {
          email: emailAddress,
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <>
      {/* Forget Password Form */}
      <form
        className="forget-password-form"
        ref={formRef}
        onSubmit={handleSendResetLink}
      >
        <label htmlFor="emailAddress">Email Address</label>
        <input
          type="email"
          id="emailAddress"
          placeholder="Email Address"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          required
        />
        {/* Send Reset Link Button */}
        <button className="send-reset-link-btn">
          <span>Send Reset Link</span>
          <img
            src={blueArrowIcon}
            alt="Blue Arrow Icon"
            className="arrow-icon"
          />
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
    </>
  );
};

export default ForgetPasswordForm;
