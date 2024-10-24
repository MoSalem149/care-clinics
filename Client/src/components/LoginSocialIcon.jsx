import { useEffect } from "react";
import facebookIcon from "../assets/images/SignUp-Login-img/facebook-icon.png";
import gmailIcon from "../assets/images/SignUp-Login-img/gmail-icon.png";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useUsers } from "./Context/userContext";

const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

const LoginPageSocialIcon = () => {
  const { updateUserRole } = useUsers();
  const navigate = useNavigate();

  const handleFacebookLogin = () => {
    try {
      window.location.href = `http://localhost:5000/auth/facebook/callback`;
    } catch (error) {
      console.error("Redirection failed:", error);
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
      try {
        const decoded = jwtDecode(token);
        // console.log("Decoded token:", decoded);

        const { role } = decoded;
        updateUserRole(role);

        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/department");
        }
      } catch (error) {
        // console.error("Failed to decode token:", error);
      }
    } else {
      // console.log("No token found in cookies.");
    }
  }, [updateUserRole, navigate]);

  return (
    <div className="social-login">
      <button className="login-social-btn" onClick={handleFacebookLogin}>
        <img src={facebookIcon} alt="Facebook Icon" />
      </button>
      <button className="login-social-btn google" onClick={handleGoogleLogin}>
        <img src={gmailIcon} alt="Google Icon" />
      </button>
    </div>
  );
};

export default LoginPageSocialIcon;
