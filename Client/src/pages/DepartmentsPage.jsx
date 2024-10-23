import { Helmet, HelmetProvider } from "react-helmet-async";
/* Import assets */
import starsImg from "../assets/images/Department-img/stars-img.png";
import mainImg from "../assets/images/Department-img/main-img.png";
import heartIcon from "../assets/images/Department-img/heart-icon.png";
import orthopedicsIcon from "../assets/images/Department-img/orthopedics-icon.png";
import healthcareIcon from "../assets/images/Department-img/healthcare-icon.png";
import toothIcon from "../assets/images/Department-img/tooth-icon.png";
import arrowIcon from "../assets/images/Department-img/Group.png";
import whiteArrowIcon from "../assets/images/Department-img/blue-arrow-img.png";
import injectionImg from "../assets/images/Department-img/Injection-img.png";
import medicineImg from "../assets/images/Department-img/medicine-img.png";
/* Import Components */
import Header from "../components/Header";
/* Import CSS */
import "../styles/DepartmentsPage.css";

function Departments() {
  /* JSX */
  return (
    /* Departments Page */
    <HelmetProvider>
      {/* Container */}
      <div className="departments-container">
        <Helmet>
          <title>Patient Home Page</title>
        </Helmet>
        {/* Header */}
        <Header />
        <div className="container">
          <h2>Our Departments</h2>
          <h3>
            <img src={starsImg} alt="Stars Decoration" />
            <span className="high-quality-span">High Quality</span> Services for
            You.
          </h3>
          <img className="main-img" src={mainImg} alt="Stars Decoration" />
          <div className="departments-cards">
            <div className="department-card">
              <img src={heartIcon} alt="Cardiology Icon" />
              <h4>Cardiology</h4>
              <p>
                Our cardiology department specializes in the diagnosis and
                treatment of heart diseases. We use advanced techniques to
                assess heart health, identify potential problems, and develop
                personalized treatment plans.
              </p>
              <a href="#" className="btn">
                Book Appointment
                <img className="arr" src={arrowIcon} alt="arrow icon" />
              </a>
            </div>
            <div className="department-card">
              <img src={orthopedicsIcon} alt="Orthopedics Icon" />
              <h4>Orthopedics</h4>
              <p>
                Our orthopedics department specializes in the diagnosis and
                treatment of musculoskeletal disorders. Our surgeons offer a
                wide range of services, including joint replacement, fracture
                repair, and sports medicine.
              </p>
              <a href="#" className="btn">
                Book Appointment
                <img src={arrowIcon} alt="arrow icon" />
              </a>
            </div>
            <div className="department-card">
              <img src={healthcareIcon} alt="Medicine Icon" />
              <h4>Internal Medicine</h4>
              <p>
                Our internal medicine department specializes in diagnosing and
                treating diseases of the adult human body. We provide care for a
                wide range of conditions, including diabetes, respiratory
                disorders, and digestive problems.
              </p>
              <a href="#" className="btn">
                Book Appointment
                <img className="arr" src={arrowIcon} alt="arrow icon" />
              </a>
            </div>
            <div className="department-card">
              <img src={toothIcon} alt="Tooth Icon" />
              <h4>General Dental Care</h4>
              <p>
                We are excited to meet you and provide the best dental care for
                your family.
              </p>
              <a href="#" className="btn">
                Book Appointment
                <img src={arrowIcon} alt="arrow icon" />
              </a>
            </div>
          </div>
          <div className="view-all">
            <a href="#" className="view-all-btn">
              View All Departments
              <img src={whiteArrowIcon} alt="arrow icon" />
            </a>
          </div>
        </div>
        <div className="background-images">
          <img
            className="Injection"
            src={injectionImg}
            alt="Main Illustration"
          />
          <img className="medicine" src={medicineImg} alt="Main Illustration" />
        </div>
      </div>
    </HelmetProvider>
  );
}

export default Departments;
