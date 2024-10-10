/* Import assets */
import { useEffect } from "react";
import facebookIcon from "../assets/images/SignUp-Login-img/facebook-icon.png";
import gmailIcon from "../assets/images/SignUp-Login-img/gmail-icon.png";
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

const LoginPageSocialIcon = () => {
  const handleFacebookLogin = () => {
    try {
      window.location.href = `http://localhost:5000/auth/facebook/callback`;
    } catch (error) {
      console.error("Redirection failed:", error);
      // Handle the error appropriately
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BackEndUrl}/auth/google`;
  };
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      localStorage.setItem("token", token);
      window.location.href = "/";
    }
  }, []);

  return (
    <>
      {/* Social Login */}
      <div className="social-login">
        <button className="login-social-btn" onClick={handleFacebookLogin}>
          <img src={facebookIcon} alt="Facebook Icon" />
        </button>
        <button className="login-social-btn google" onClick={handleGoogleLogin}>
          <img src={gmailIcon} alt="Google Icon" />
        </button>
      </div>
    </>
  );
};

export default LoginPageSocialIcon;
