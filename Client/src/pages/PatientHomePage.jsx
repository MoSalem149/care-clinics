import { Helmet, HelmetProvider } from "react-helmet-async";
/* Import assets */
import blueArrowImage from "../assets/images/Patient-Home-Page-img/blue-arrow-icon.png";
import mainBgImage from "../assets/images/Patient-Home-Page-img/main-bg-img.png";
/* Import Components */
import Header from "../components/Header";
import HeaderParent from "../components/HeaderParent";
/* Import CSS */
import "../styles/PatientHomePage.css";
import Footer from "../components/Footer";
import { useUsersProfileContext } from "../components/Context/GetUsersProfile";
function PatientHomePage() {
  const { currentUserProfile } = useUsersProfileContext();
  /* JSX */
  return (
    /* Patient Home Page */
    <HelmetProvider>
      {/* Container */}
      <div className="patient-home-page">
        {/* Helmet */}
        <Helmet>
          <title>Patient Home Page</title>
        </Helmet>
        {/* Header */}
        <Header />
        {/* Hero */}
        <section className="hero">
          <div className="hero-content">
            <h2>
              We Care for <span>Your Health</span>
            </h2>
            <h2>
              Every <span>Moment</span>
            </h2>
            <p>
              At Care Clinics, we prioritize your health with personalized care
              and expert medical services, ensuring you receive the attention
              you deserve.
            </p>
            <a href="#" className="hero-btn">
              <span>Book Appointment</span>
              <img src={blueArrowImage} alt="Arrow" />
            </a>
          </div>
          <div className="hero-image">
            <img
              className="main-img"
              src={mainBgImage}
              alt="Doctor Illustration"
            />
          </div>
        </section>
      </div>
      <Footer />
    </HelmetProvider>
  );
}

export default PatientHomePage;
