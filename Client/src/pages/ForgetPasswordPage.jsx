import { Helmet, HelmetProvider } from "react-helmet-async";
/* Import Components */
import ForgetPasswordForm from "../components/ForgetPasswordForm";
/* Import CSS */
import "../styles/ForgetPasswordPage.css";

function ForgetPasswordPage() {
  /* JSX */
  return (
    /* Forget Password Page */
    <HelmetProvider>
      <div className="forget-password-container">
        {/* Helmet */}
        <Helmet>
          <title>Forget Password Page</title>
        </Helmet>
        {/* Header */}
        <h2 className="forget-password-header">Forget Password</h2>
        {/* Forget Password Form */}
        <ForgetPasswordForm />
      </div>
    </HelmetProvider>
  );
}

export default ForgetPasswordPage;
