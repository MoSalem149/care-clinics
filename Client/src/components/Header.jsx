import { useState } from "react";
import { Link } from "react-router-dom";
/* Import Icons */
import { FaSignOutAlt, FaBars } from "react-icons/fa";
/* Import assets */
import injectionImage from "../assets/images/User-Profile-Page-img/injection-img.png";
import toolImage from "../assets/images/User-Profile-Page-img/tool-img.png";
import searchIcon from "../assets/images/User-Profile-Page-img/search-icon.png";
import avatarImage from "../assets/images/Patient-Home-Page-img/avatar1.png";
/* Import CSS */
import "../styles/Header.css";

function Header() {
  /* State */
  const [menuActive, setMenuActive] = useState(false);

  // Function to handle menu toggle
  const handleMenuToggle = () => {
    setMenuActive(!menuActive);
  };
  return (
    <>
      {/* Header */}
      <header>
        <nav>
          <div className="logo">
            <h1 className="logo-text">
              <span className="header-span">C</span>are <span className="header-span">C</span>linics
            </h1>
          </div>
          <ul className={`nav-links ${menuActive ? "active" : ""}`}>
            <li>
              <Link className="active" to="/patient-home">
                Home
              </Link>
            </li>
            <li>
              <Link to="/department">Departments</Link>
            </li>
            <li>
              <Link to="/doctor">Doctors</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
          <div className="search-btn">
            <button className="search-button">
              Search <img src={searchIcon} alt="search icon"></img>
            </button>
          </div>
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
      {/* Header Images */}
    
    </>
  );
}

export default Header;
