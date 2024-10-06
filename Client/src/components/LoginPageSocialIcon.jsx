/* Import assets */
import facebookIcon from "../assets/images/SignUp-SignIn-img/facebook-icon.png";
import gmailIcon from "../assets/images/SignUp-SignIn-img/gmail-icon.png";

const LoginPageSocialIcon = () => {
  /* JSX */
  return (
    <>
      {/* Social Login */}
      <div className="social-login">
        <button className="login-social-btn ">
          <img src={facebookIcon} alt="Facebook Icon" />
        </button>
        <button className="login-social-btn google">
          <img src={gmailIcon} alt="Google Icon" />
        </button>
      </div>
    </>
  );
};

export default LoginPageSocialIcon;
