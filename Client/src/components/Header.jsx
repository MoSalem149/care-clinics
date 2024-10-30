// Header.js
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBars } from "react-icons/fa";
import avatarImage from "../assets/images/Patient-Home-Page-img/avatar1.png"; // Default avatar
import { DoctorContext } from "./Doctor-details/DoctorContext";
import { useUsers } from "./Context/userContext";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { useUsersProfileContext } from "./Context/GetUsersProfile";
import "../styles/Header.css";
import { ProfileImageContext } from "../components/Context/profileImageContext";

function Header() {
  const { profileImage, currentUser } = useUsersProfileContext();
  const { theProfileImage, clearProfileImage } =
    useContext(ProfileImageContext);
  const { doctors } = useContext(DoctorContext);
  const { clearUserData } = useUsers();
  const [menuActive, setMenuActive] = useState(false);
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    console.log("Current profile image:", currentUser);
  }, [currentUser]);
  useEffect(() => {
    console.log("Current profile image:", theProfileImage);
  }, [theProfileImage]);

  const handleMenuToggle = () => {
    setMenuActive(!menuActive);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    if (userRole === "doctor") {
      const matchedDoctor = doctors.find((doctor) => doctor.user === userId);
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
        // clearProfileImage();

        Swal.fire({
          title: "Signed Out",
          text: "You have successfully signed out.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/signup");
        });
      }
    });
  };

  return (
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
        <div className="link">
          <a href="#" className="profile-img" onClick={handleProfileClick}>
            <img
              src={
                theProfileImage ||
                (currentUser && currentUser.profileImage) ||
                avatarImage
              }
              alt="Profile"
            />
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
  );
}

export default Header;
