import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
/* Import assets */
import whiteArrowIcon from "../assets/images/SignUp-Login-img/white-arrow-icon.png";
/* Import JS */
import { submitForm } from "../utils/resetPasswordFormValidation.js";

const ResetPasswordForm = () => {
  /* State */
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* Reference to form */
  const formRef = useRef(null);
  const { token } = useParams();

  const queryParams = new URLSearchParams(window.location.search);
  const createdBy = queryParams.get("createdBy");

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
    const validation = await submitForm(
      newPassword,
      confirmNewPassword,
      setErrorMessage,
      setSuccessMessage,
      token,
      createdBy
    );
    if (!validation.isValid) {
      console.log("Setting error message:", validation.message);
      setErrorMessage(validation.message);
      return;
    } else {
      console.log("Setting success message:", validation.message);
      setSuccessMessage(validation.message);
    }
  };

  /* Jsx */
  return (
    <>
      {/* Reset Password Form */}
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
    </>
  );
};

export default ResetPasswordForm;
