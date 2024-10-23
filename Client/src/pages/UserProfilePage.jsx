import { Helmet, HelmetProvider } from "react-helmet-async";
/* Import assets */
import patientImage from "../assets/images/User-Profile-Page-img/user-img.png";
/* Import Components */
import Header from "../components/Header";
/* Import CSS */
import "../styles/UserProfilePage.css";

function UserProfilePage() {
  /* JSX */
  return (
    <HelmetProvider>
      <div className="user-profile-page">
        {/* Helmet */}
        <Helmet>
          <title>User Profile Page</title>
        </Helmet>
        {/* Header */}
        <Header />
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
