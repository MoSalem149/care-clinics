import "../styles/SignInPage.css";

const SignInPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <h2>Welcome Back</h2>
        <div className="social-buttons">
          <button className="social-btn">Sign In with Facebook</button>
          <button className="social-btn">Sign In with Google</button>
        </div>
        <form className="auth-form">
          <input type="email" placeholder="Email Address" />
          <input type="password" placeholder="Password" />
          <a href="/forgot-password" className="forgot-password">
            Forgot password?
          </a>
          <button className="auth-btn">Sign In</button>
        </form>
      </div>
      <div className="auth-right">
        <h2>Do not have an account?</h2>
        <button className="switch-btn">Sign Up</button>
      </div>
    </div>
  );
};

export default SignInPage;
