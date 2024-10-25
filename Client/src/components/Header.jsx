import { useState } from "react";
import { Link } from "react-router-dom";
/* Import Icons */
import { FaSignOutAlt, FaBars } from "react-icons/fa";
/* Import assets */
import injectionImage from "../assets/images/User-Profile-Page-img/injection-img.png";
import toolImage from "../assets/images/User-Profile-Page-img/tool-img.png";
import searchIcon from "../assets/images/User-Profile-Page-img/search-icon.png";
import avatarImage from "../assets/images/Patient-Home-Page-img/avatar1.png";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "./Doctor-details/DoctorContext";
import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useUsers } from "./Context/userContext";
/* Import CSS */
import "../styles/Header.css";

function Header() {
  const { doctors } = useContext(DoctorContext);
  const { clearUserData } = useUsers();
  /* State */
  const [menuActive, setMenuActive] = useState(false);
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();
  // Function to handle menu toggle
  const handleMenuToggle = () => {
    setMenuActive(!menuActive);
  };
  const token = localStorage.getItem("token");
  const handleProfileClick = (e) => {
    e.preventDefault();
    if (userRole === "doctor") {
      const userId = jwtDecode(token).id;
      console.log("userID", userId);

      const matchedDoctor = doctors.find((doctor) => doctor.user === userId);
      console.log(doctors);

      if (matchedDoctor) {
        navigate("/doctor-profile", { state: { doctor: matchedDoctor } });
      } else {
        console.error("Doctor not found");
      }
    } else if (userRole === "user") {
      navigate("/user-profile");
    } else {
      console.error("Unknown role, unable to navigate");
    }
  };
  const handleSignOut = () => {
    clearUserData();
    navigate("/signup");
  };
  return (
    <>
      {/* Header */}
      <header>
        <nav>
          <div className="logo">
            <h1 className="logo-text">
              <span className="header-span">C</span>are{" "}
              <span className="header-span">C</span>linics
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
            <a href="#" className="profile-img" onClick={handleProfileClick}>
              <img src={avatarImage} alt="Profile" />
            </a>

            <a href="" className="logout-btn" onClick={handleSignOut}>
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
