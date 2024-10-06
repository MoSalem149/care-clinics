import { useState, useRef } from "react";
/* Import assets */
import blueArrowIcon from "../assets/images/SignUp-Login-img/blue-arrow-icon.png";

const ForgetPasswordForm = () => {
  /* State */
  const [emailAddress, setEmailAddress] = useState("");

  /* Reference to form */
  const formRef = useRef(null);

  return (
    <>
      {/* Forget Password Form */}
      <form className="forget-password-form" ref={formRef}>
        <label htmlFor="emailAddress">Email Address</label>
        <input
          type="email"
          id="emailAddress"
          placeholder="Email Address"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          required
        />
      </form>
      {/* Send Reset Link Button */}
      <button className="send-reset-link-btn">
        <span>Send Reset Link</span>
        <img src={blueArrowIcon} alt="Blue Arrow Icon" className="arrow-icon" />
      </button>
    </>
  );
};

export default ForgetPasswordForm;
