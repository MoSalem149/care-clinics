import { Helmet, HelmetProvider } from "react-helmet-async";
/* Import Icons */
import { FaPaperPlane } from "react-icons/fa";
/* Import assets */
import starsImg from "../assets/images/Department-img/stars-img.png";
import injectionImg from "../assets/images/Department-img/Injection-img.png";
import medicineImg from "../assets/images/Department-img/medicine-img.png";
/* Import Components */
import Header from "../components/Header";
/* Import CSS */
import "../styles/ContactUsPage.css";
import Footer from "../components/Footer";
import { useUsersProfileContext } from "../components/Context/GetUsersProfile";
function ContactUsPage() {
  const { currentUserProfile } = useUsersProfileContext();

  return (
    <HelmetProvider>
      <div className="contact-us-container">
        <Helmet>
          <title>Contact Us</title>
        </Helmet>
        <Header />
        <h2>Contact Us</h2>
        <h3>
          <img src={starsImg} alt="Stars Decoration" />
          <span className="high-quality-span">We Value Your Feedback</span> and
          Aim to Improve Our Services.
        </h3>
      </div>
      <div className="form-images-container">
        <img
          className="Injection-img"
          src={injectionImg}
          alt="Injection Illustration"
        />
        <div className="contact-us-form-container">
          <div className="contact-us-form-group">
            <div>
              <label>Full Name</label>
              <input type="text" placeholder="Full Name" required />
            </div>
          </div>
          <div className="contact-us-form-group">
            <div>
              <label>Email Address</label>
              <input type="email" placeholder="Email Address" required />
            </div>
          </div>
          <div className="contact-us-form-group">
            <div>
              <label>Phone Number</label>
              <input type="tel" placeholder="+20" required />
            </div>
          </div>
          <div className="contact-us-form-group">
            <div>
              <label htmlFor="message">Your Message or Complaint</label>
              <textarea
                id="message"
                placeholder="Please describe your message or complaint in detail..."
                required
              ></textarea>
            </div>
          </div>
          <button type="submit" className="submit-button">
            <FaPaperPlane style={{ marginRight: "8px" }} /> Submit
          </button>
        </div>
        <img
          className="medicine-img"
          src={medicineImg}
          alt="Medicine Illustration"
        />
      </div>
      <Footer />
    </HelmetProvider>
  );
}

export default ContactUsPage;
