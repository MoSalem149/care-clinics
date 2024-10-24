import { Helmet, HelmetProvider } from "react-helmet-async";
/* Import assets */
import patientImage from "../assets/images/User-Profile-Page-img/user-img.png";
/* Import Components */
import Header from "../components/Header";
/* Import CSS */
import "../styles/UserProfilePage.css";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';


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
          throw new Error('Failed to fetch doctor data');
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
        setAppointments(data.appointments)
  
      } catch (error) {
        console.error('Error fetching doctor data:', error);
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
  
        // API call to get the doctor's ID
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
  
          
        // API call to delete the doctor account using the doctor ID
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

  const handleSave = async () => {
    setIsEditing(false);

    // Prepare the updated patient data
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
      const token = localStorage.getItem("token"); // Get the token from local storage
      const response = await fetch("http://localhost:5000/users/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Set the authorization header
        },
        body: JSON.stringify(updatedData), // Send the updated data
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();
      console.log("Profile updated successfully:", result);
      // Optionally handle successful update (e.g., show a message or refresh data)
    } catch (error) {
      console.error("Error updating profile:", error);
      // Optionally handle errors (e.g., show an error message)
    }
  };

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
        <div className="container user-profile-page">
          <div className="row patient-container">
            <div className="col-6">
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
            <div className="col-6">
              <div className="appointment-container">
                <div className="appointment-header">My Appointments</div>
                <div className="appointment-details">
                <div className="appointment-time">
  {appointments.length > 0 ? (
    <ol>
      {appointments
        .sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime))
        .map((appointment, index) => {
          let appointmentDate = new Date(appointment.appointmentTime);

          const timezoneOffset = appointmentDate.getTimezoneOffset();
          appointmentDate.setMinutes(appointmentDate.getMinutes() + timezoneOffset);

          const formattedDate = appointmentDate.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          return (
            <li key={index}>
              Date: {formattedDate}
            </li>
          );
        })}
    </ol>
  ) : (
    <p>No appointments available.</p>
  )}
</div>
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleDeleteAccount} className="delete-btn">Delete account</button>
        </div>
      </div>
    </HelmetProvider>
  );
}

export default UserProfilePage;
