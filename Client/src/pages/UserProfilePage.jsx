import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
/* Import Icons */
import { FaBars } from "react-icons/fa";
/* Import assets */
import injectionImage from "../assets/images/User-Profile-Page-img/injection-img.png";
import toolImage from "../assets/images/User-Profile-Page-img/tool-img.png";
import patientImage from "../assets/images/User-Profile-Page-img/user-img.png";
import searchIcon from "../assets/images/User-Profile-Page-img/search-icon.png";
/* Import CSS */
import "../styles/UserProfilePage.css";

function UserProfilePage() {
  /* State */
  const [menuActive, setMenuActive] = useState(false);

  // Function to handle menu toggle
  const handleMenuToggle = () => {
    setMenuActive(!menuActive);
  };

  /* JSX */
  return (
    <HelmetProvider>
      <div className="user-profile-page">
        {/* Helmet */}
        <Helmet>
          <title>User Profile Page</title>
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
            <div className="search-btn">
              <button className="search-button">
                Search <img src={searchIcon} alt="search icon"></img>
              </button>
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
        {/* Header Images */}
        <div className="header-images">
          <img
            className="injection-img"
            src={injectionImage}
            alt="Injection Image"
          />
          <img className="tool-img" src={toolImage} alt="Tool Image" />
        </div>
        {/* Patient Form and Appointments */}
        <div className="patient-container">
          {/* Patient Information Form */}
          <div className="form-container">
            <div className="form-header">
              <img
                className="patient-img"
                src={patientImage}
                alt="Patient Icon"
              />
              <h2>Patient Name</h2>
            </div>
            <div className="form-group">
              <div>
                <label>Full Name</label>
                <input type="text" placeholder="Full Name" />
              </div>
              <div>
                <label>Date Of Birth</label>
                <input type="date" />
              </div>
            </div>
            <div className="form-group">
              <div>
                <label>Email Address</label>
                <input type="email" placeholder="Email Address" />
              </div>
              <div>
                <label>Last Checkup Date</label>
                <input type="date" />
              </div>
            </div>
            <div className="form-group">
              <div>
                <label>Phone Number</label>
                <input type="tel" placeholder="+20" />
              </div>
              <div>
                <label>Blood Type</label>
                <input type="text" placeholder="Blood Type" />
              </div>
            </div>
            <div className="form-group">
              <div>
                <label>Family Medical History</label>
                <input type="text" placeholder="Family Medical History" />
              </div>
              <div>
                <label>Chronic Conditions</label>
                <input type="text" placeholder="If you have" />
              </div>
            </div>
            <label>Surgical History</label>
            <textarea placeholder="Surgical History"></textarea>
          </div>
          {/* Appointments Section */}
          <div className="appointment-container">
            <div className="appointment-header">My Appointments</div>
            <div className="appointment-details">
              <div className="appointment-time">Today 1:30 PM</div>
              <div className="appointment-doctor">With Dr. John Doe</div>
            </div>
            <button className="cancel-btn">Cancel</button>
            <div className="view-more">View More</div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
}

export default UserProfilePage;
