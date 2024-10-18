import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
/* Import Icons */
import { FaSignOutAlt, FaBars } from "react-icons/fa";
/* Import assets */
import avatarImage from "../assets/images/Patient-Home-Page-img/avatar1.png";
import blueArrowImage from "../assets/images/Patient-Home-Page-img/blue-arrow-icon.png";
import mainBgImage from "../assets/images/Patient-Home-Page-img/main-bg-img.png";
/* Import CSS */
import "../styles/PatientHomePage.css";

function PatientHomePage() {
  /* State */
  const [menuActive, setMenuActive] = useState(false);

  // Function to handle menu toggle
  const handleMenuToggle = () => {
    setMenuActive(!menuActive);
  };

  /* JSX */
  return (
    /* Patient Home Page */
    <HelmetProvider>
      {/* Container */}
      <div className="patient-home-page">
        <Helmet>
          <title>Patient Home Page</title>
        </Helmet>
        {/* Header */}
        <header>
          <nav>
            <div className="logo">
              <h1 className="logo-text">
                <span>C</span>are <span>C</span>linics
              </h1>
            </div>
            <ul className={`nav-links ${menuActive ? "active" : ""}`}>
              <li>
                <a className="active" href="#">
                  Home
                </a>
              </li>
              <li>
                <a href="#">Departments</a>
              </li>
              <li>
                <a href="#">Doctors</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
            <div className="link">
              <a href="#" className="profile-img">
                <img src={avatarImage} alt="Profile" />
              </a>
              <a href="#" className="logout-btn">
                <FaSignOutAlt /> Sign Out
              </a>
            </div>
            <button
              className="menu-toggle"
              aria-label="Toggle Menu"
              onClick={handleMenuToggle}
            >
              <FaBars />
            </button>
          </nav>
        </header>
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
    </HelmetProvider>
  );
}

export default PatientHomePage;
