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
import Swal from "sweetalert2";
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
    } else if (userRole === "admin") {
      navigate("/admin");
    } else {
      console.error("Unknown role, unable to navigate");
    }
  };

  const handleSignOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sign me out",
    }).then((result) => {
      if (result.isConfirmed) {
        clearUserData();
        Swal.fire({
          title: "Signed Out",
          text: "You have successfully signed out.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          console.log("Navigating to signup page");
          navigate("/signup");
        });
      }
    });
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

  <button className="logout-btn" onClick={handleSignOut}>
    <FaSignOutAlt /> Sign Out
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
    </>
  );
}

export default Header;
