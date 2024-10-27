import { Helmet, HelmetProvider } from "react-helmet-async";
/* Import assets */
import patientImage from "../assets/images/User-Profile-Page-img/user-img.png";
/* Import Components */
import Header from "../components/Header";
/* Import CSS */
import "../styles/UserProfilePage.css";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { ClipLoader } from "react-spinners";

function UserProfilePage() {
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:5000/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
  
        const result = await response.json();
        const data = result.data.userProfile;
  
        // Update state with fetched data
        setFullName(data.fullName);
        setDateOfBirth(data.dateOfBirth);
        setLastCheckupDate(data.lastCheckupDate);
        setBloodType(data.bloodType);
        setFamilyHistory(data.familyHistory);
        setChronicConditions(data.chronicConditions);
        setPhoneNumber(data.phoneNumber);
        setSurgicalHistory(data.surgicalHistory);
        setAppointments(data.appointments);
       
  
  
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  
    // Set body styles
    document.body.style.backgroundColor = '#E6F7FF';
    document.body.style.marginTop = '20px';
    document.body.style.backgroundImage = "url('../../public/Vector.png'),url('../../public/Vector (1).png')";
    document.body.style.backgroundPosition = 'top right, top left';
    document.body.style.backgroundRepeat = 'no-repeat, no-repeat';
  
    // Cleanup function
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.marginTop = '';
      document.body.style.backgroundImage = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
    };
  }, []);
  
  
  
  const [isEditing, setIsEditing] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [fullName, setFullName] = useState("John Doe");
  const [dateOfBirth, setDateOfBirth] = useState("1990-01-01");
  const [email, setEmail] = useState("johndoe@example.com");
  const [lastCheckupDate, setLastCheckupDate] = useState("2023-10-01");
  const [phoneNumber, setPhoneNumber] = useState("+20 123456789");
  const [bloodType, setBloodType] = useState("O+");
  const [familyHistory, setFamilyHistory] = useState(["No significant history"]);
  const [chronicConditions, setChronicConditions] = useState(["None"]);
  const [surgicalHistory, setSurgicalHistory] = useState(["Appendectomy"]);
  const [appointments, setAppointments] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState([]);
  const [selectedTime, setSelectedTime] = useState([]);
  const [appointmentId, setAppointmentId] = useState("");
  const [loading, setLoading] = useState(false);
  
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    const suffix = hour < 12 ? "AM" : "PM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    times.push(`${hour12}:00 ${suffix}`);

    times.push(`${hour12}:30 ${suffix}`);
  }
  
  const handleDeleteAccount = async () => {
    try {
      // Show SweetAlert confirmation popup
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to recover this account!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });
  
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
  
        if (!token) {
          console.error("No token found");
          return;
        }
  
        const response = await fetch('http://localhost:5000/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
  
        if (!response.ok) {
          console.error('Failed to fetch user data');
          return;
        }
  
        const result = await response.json();
        console.log(result);
  
          
        const deleteResponse = await fetch(`http://localhost:5000/users/profile/delete`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
  
        if (!deleteResponse.ok) {
          throw new Error('Failed to delete account');
        }
  
        const deleteResult = await deleteResponse.json();
        console.log(deleteResult);
  
        // Show success message with SweetAlert
        Swal.fire(
          'Deleted!',
          'Your account has been deleted.',
          'success'
        );
  
        // Handle any additional logic here, e.g., logging out or redirecting
  
      }
  
    } catch (error) {
      console.error('Error deleting account:', error);
  
      // Show error message with SweetAlert
      Swal.fire(
        'Error!',
        'Something went wrong while deleting your account.',
        'error'
      );
    }
  };

  const handleCancelAppointment = async ({ appointmentID }) => { // Destructure parameter here
    console.log("Canceling appointment with ID:", appointmentID); // Log the appointmentID
    try {
      // Show SweetAlert confirmation popup
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to recover this appointment!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });
  
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
  
        if (!token) {
          console.error("No token found");
          return;
        }
  
        // Check user data
        const response = await fetch('http://localhost:5000/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
  
        if (!response.ok) {
          console.error('Failed to fetch user data');
          return;
        }
  
        // Delete appointment
        const deleteResponse = await fetch(`http://localhost:5000/users/profile/deleteAppointment/${appointmentID}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
  
        if (!deleteResponse.ok) {
          throw new Error('Failed to delete appointment');
        }
  
        const deleteResult = await deleteResponse.json();
        console.log(deleteResult);
  
        Swal.fire(
          'Deleted!',
          'Your appointment has been deleted.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
  
      // Show error message with SweetAlert
      Swal.fire(
        'Error!',
        'Something went wrong while deleting your appointment.',
        'error'
      );
    }
  };
  

  const handleSaveChanges = async () => {
    setLoading(true);

    appointments.forEach((appointment) => {
      const { _id} = appointment;
      console.log(_id);
    });
    const [time, modifier] = selectedTime.split(" ");
    let [hours, minutes] = time.split(":");
   
    if (hours === "12") {
      hours = modifier === "AM" ? "00" : "12";
    } else if (modifier === "PM") {
      hours = String(Number(hours) + 12);
    }
  
    hours = hours.padStart(2, "0");
    minutes = minutes.padStart(2, "0");
  
    const appointmentTime = `${appointmentDate}T${hours}:${minutes}:00Z`;
    
    console.log("Appointment Time String:", appointmentTime);
  
      const formData = {
      appointmentTime,
    };
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }
  
      const response = await fetch(
        `http://localhost:5000/users/profile/updateAppointment/${appointmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("Appointment updated successfully", result);
        Swal.fire({
          title: "Appointment Updated!",
          text: result.message,
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        console.error("Failed to update appointment", result.message, response.status, response.statusText);
        Swal.fire({
          title: "Error!",
          text: result.message || "Failed to update appointment.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
      setIsModifying(false);
      setAppointmentDate('');
      setSelectedTime('');
    }
  };
  
  

  const handleSave = async () => {
    setIsEditing(false);

    const updatedData = {
      fullName,
      dateOfBirth,
      email,
      lastCheckupDate,
      phoneNumber,
      bloodType,
      familyHistory,
      chronicConditions,
      surgicalHistory,
    };

    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch("http://localhost:5000/users/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();
      console.log("Profile updated successfully:", result);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <HelmetProvider>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <ClipLoader color="#3085d6" loading={loading} size={50} />
        </div>
      ) :
      (
      <div className="user-profile-page">
        {/* Helmet */}
        <Helmet>
          <title>User Profile Page</title>
        </Helmet>
        {/* Header */}
        <Header />
        <div className="container user-profile-page">
          <div className="row patient-container">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="user-card">
                <div className="form-header">
                  <img className="patient-img" src={patientImage} alt="Patient Icon" />
                  <h2>{fullName}</h2>
                </div>

                <div className="card-content">
                  {isEditing ? (
                    <>
                      <p>
                        <strong>Full Name:</strong>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </p>
                      <p>
                        <strong>Date Of Birth:</strong>
                        <input
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                      </p>
                      <p>
                        <strong>Email:</strong>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </p>
                      <p>
                        <strong>Last Checkup Date:</strong>
                        <input
                          type="date"
                          value={lastCheckupDate}
                          onChange={(e) => setLastCheckupDate(e.target.value)}
                        />
                      </p>
                      <p>
                        <strong>Phone Number:</strong>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </p>
                      <p>
                        <strong>Blood Type:</strong>
                        <input
                          type="text"
                          value={bloodType}
                          onChange={(e) => setBloodType(e.target.value)}
                        />
                      </p>
                      <p>
                        <strong>Family Medical History:</strong>
                        <input
                          type="text"
                          value={familyHistory}
                          onChange={(e) => setFamilyHistory(e.target.value)}
                        />
                      </p>
                      <p>
                        <strong>Chronic Conditions:</strong>
                        <input
                          type="text"
                          value={chronicConditions}
                          onChange={(e) => setChronicConditions(e.target.value)}
                        />
                      </p>
                      <p>
                        <strong>Surgical History:</strong>
                        <input
                          type="text"
                          value={surgicalHistory}
                          onChange={(e) => setSurgicalHistory(e.target.value)}
                        />
                      </p>
                    </>
                  ) : (
                    <>
                      <p><strong>Full Name:</strong> {fullName}</p>
                      <p><strong>Date Of Birth:</strong> {dateOfBirth}</p>
                      <p><strong>Email:</strong> {email}</p>
                      <p><strong>Last Checkup Date:</strong> {lastCheckupDate}</p>
                      <p><strong>Phone Number:</strong> {phoneNumber}</p>
                      <p><strong>Blood Type:</strong> {bloodType}</p>
                      <p><strong>Family Medical History:</strong> {familyHistory}</p>
                      <p><strong>Chronic Conditions:</strong> {chronicConditions}</p>
                      <p><strong>Surgical History:</strong> {surgicalHistory}</p>
                    </>
                  )}
                </div>
                <div className="card-actions">
                  {isEditing ? (
                    <button className="edit-bio-btn" onClick={handleSave}>
                      Save
                    </button>
                  ) : (
                    <button className="edit-bio-btn" onClick={() => setIsEditing(true)}>
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
  <div className="appointment-container">
    <div className="appointment-header">My Appointments</div>
    <div className="appointment-details">
      {isModifying ? (
        <>
        <div className="update-appointment-container">
          <div className="modification-inputs">
            <input
              type="date"
              className="styled-date-input"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
            <select
              className="time-select"
              required
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="" disabled>
                Choose time
              </option>
              {times.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
            </select>
          </div>
          <button className="update-appointments-btn" onClick={handleSaveChanges}>
  Update Appointment
</button>
        </div>
        </>
      ) : (
        <>
          <div className="appointment-time">
            {appointments.length > 0 ? (
              <ol className="appointment-list">
              {appointments
                .sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime))
                .map((appointment, index) => {
                  let appointmentDate = new Date(appointment.appointmentTime);
                  
                  const timezoneOffset = appointmentDate.getTimezoneOffset();
                  appointmentDate.setMinutes(appointmentDate.getMinutes() + timezoneOffset);
            
                  const formattedDate = appointmentDate.toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });
            
                  const { appointmentId, doctorName } = appointment;
                  console.log(appointmentId,"ccf",doctorName);
                  
            
                  return (
                    <li key={index} className="appointment-item">
                      <div className="appointment-info">
                        <span className="appointment-date">
                          <span className="booking-info-span">Date: </span> {formattedDate}
                        </span>
                        <span className="booking-doctor-name">
                          <span className="booking-info-span">with Dr. </span> {doctorName} 
                        </span>
                      </div>
                      <div className="appointment-actions">
                        <button className="book-modify-btn" onClick={() => {
                          setIsModifying(true);
                          setAppointmentDate(appointmentDate.toISOString().split('T')[0]); 
                          setAppointmentId(appointmentId)
                        }}>
                          Modify
                        </button>
                        <button 
                          className="book-cancel-btn" 
                          onClick={() => handleCancelAppointment({ appointmentID: appointmentId })}
                        >
                          Cancel
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ol>
            
            
            ) : (
              <p>No appointments available.</p>
            )}
          </div>
        </>
      )}
    </div>
  </div>
</div>
          </div>
          <button onClick={handleDeleteAccount} className="delete-btn">Delete account</button>
        </div>
      </div>
      )}
    </HelmetProvider>
  );
}

export default UserProfilePage;
