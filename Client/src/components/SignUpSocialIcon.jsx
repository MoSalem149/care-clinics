/* Import assets */
import facebookIcon from "../assets/images/SignUp-Login-img/facebook-icon.png";
import gmailIcon from "../assets/images/SignUp-Login-img/gmail-icon.png";

const SignUpPageSocialIcon = () => {
  /* JSX */
  return (
    <>
      {/* Social Sign Up */}
      <div className="social-sign-up">
        <button className="sign-up-social-btn">
          <img src={facebookIcon} alt="Facebook Icon" />
        </button>
        <button className="sign-up-social-btn google">
          <img src={gmailIcon} alt="Google Icon" />
        </button>
      </div>
    </>
  );
};

export default SignUpPageSocialIcon;
