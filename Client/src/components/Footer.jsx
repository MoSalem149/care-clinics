import { Link } from "react-router-dom";
/* Import Icons */
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
/* Import CSS */
import "../styles/Footer.css";

function Footer() {
  /* JSX */
  return (
    <>
      {/* Footer */}
      <footer>
        <div className="footer-container">
          <div className="footer-logo">
            <h1 className="footer-logo-text">
              <span>C</span>are <span>C</span>linics
            </h1>
          </div>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
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
          <div className="social-media">
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
          <div className="footer-contact">
            <p>© 2024 Care Clinics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
