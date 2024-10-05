import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
/* Import assets */
import blueArrowIcon from "../assets/images/SignUp-SignIn-img/blue-arrow-icon.png";
import whiteArrowIcon from "../assets/images/SignUp-SignIn-img/white-arrow-icon.png";
/* Import JS */
import { submitForm } from "../utils/resetPasswordFormValidation";
/* Import CSS */
import "../styles/ResetPasswordPage.css";

const ResetPasswordPage = () => {
  /* State */
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* Reference to form */
  const formRef = useRef(null);
  const { token } = useParams();

  console.log("Received token:", token);

  /* Function to handle external button click */
  const handleExternalButtonClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  /* Function to handle form submission */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Clear messages */
    setErrorMessage("");
    setSuccessMessage("");

    /* Perform validation */
    const validation = submitForm(
      newPassword,
      confirmNewPassword,
      setErrorMessage,
      setSuccessMessage,
      token
    );
    if (!validation.isValid) {
      setErrorMessage(validation.message);
      return;
    }
  };

  /* JSX */
  return (
    /* Reset Password Page */
    <HelmetProvider>
      <div className="reset-password-container">
        {/* Helmet */}
        <Helmet>
          <title>Reset Password Page</title>
        </Helmet>
        <h2 className="reset-password-header">Reset Password</h2>
        {/* Form */}
        <form
          className="reset-password-form"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmNewPassword"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
          {/* Error and Success Messages */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {!errorMessage && successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
        </form>
        {/* Submit Button */}
        <button
          onClick={handleExternalButtonClick}
          className="reset-password-btn"
        >
          <span>Reset Password</span>
          <img
            src={whiteArrowIcon}
            alt="White Arrow Icon"
            className="arrow-icon"
          />
        </button>
        {/* Back to Login Page Button */}
        <Link to="/login" className="back-to-login-page-btn">
          <span>Back to Login</span>
          <img
            src={blueArrowIcon}
            alt="Blue Arrow Icon"
            className="arrow-icon"
          />
        </Link>
      </div>
    </HelmetProvider>
  );
};

export default ResetPasswordPage;
