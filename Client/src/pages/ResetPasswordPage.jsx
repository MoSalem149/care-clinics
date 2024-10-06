import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
/* Import assets */
import blueArrowIcon from "../assets/images/SignUp-SignIn-img/blue-arrow-icon.png";
/* Import Components */
import ResetPasswordForm from "../components/ResetPasswordForm";
/* Import CSS */
import "../styles/ResetPasswordPage.css";

const ResetPasswordPage = () => {
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
        {/* Reset Password Form */}
        <ResetPasswordForm />
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
