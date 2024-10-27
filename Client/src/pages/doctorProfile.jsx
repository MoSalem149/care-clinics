import { useEffect, useState } from "react";
import "../styles/doctorProfile.css";
import avatarImage from "../assets/images/Patient-Home-Page-img/avatar1.png";
import { FaSignOutAlt, FaBars } from "react-icons/fa";
import infoImage from "../../public/Icon.png";
import feesImage from "../../public/Vector11.png";
import timeImage from "../../public/Vector12.png";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";
import { UserContext } from "../components/Context/userContext";
import { useContext } from "react";
function DoctorProfile() {
  const location = useLocation();
  const { doctor } = location.state;
  const { currentUser } = useContext(UserContext);
  const [isOwnerOfPof, setIsOwnerOfPof] = useState(false);

  useEffect(() => {
    if (currentUser && doctor) {
      if (currentUser.id === doctor.user) {
        setIsOwnerOfPof(true);
      }
    }
  }, [currentUser, doctor]);
  useEffect(() => {
    if (doctor) {
      setName(doctor.name);
      setSpecialty(doctor.specialty);
      setAvailability(doctor.availability);
      setAge(doctor.age);
      setGender(doctor.gender);
      setYearsOfExperience(doctor.yearsOfExperience);
      setPhoneNumber(doctor.phoneNumber);
      setDay(doctor.availability.day);
      setStartTime(doctor.availability.startTime);
      setEndTime(doctor.availability.endTime);
      setFees(doctor.fees.consultation);
      setAppointments(doctor.appointments);
      setBio(doctor.bio);
      setImage(doctor.profileImage || doctor.ProfileImage);
    }
    console.log(doctor);

    document.body.style.backgroundColor = "#E6F7FF";
    document.body.style.marginTop = "20px";
    document.body.style.backgroundImage =
      "url('../../public/Vector.png'),url('../../public/Vector (1).png')";
    document.body.style.backgroundPosition = "top right, top left";
    document.body.style.backgroundRepeat = "no-repeat, no-repeat";

    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.marginTop = "";
      document.body.style.backgroundImage = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
    };
  }, [doctor]);

  const [menuActive, setMenuActive] = useState(false);
  const handleMenuToggle = () => {
    setMenuActive(!menuActive);
  };
  const [isEditingCard1, setIsEditingCard1] = useState(false);
  const [isEditingCard2, setIsEditingCard2] = useState(false);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(avatarImage);

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [languages, setLanguages] = useState("");
  const [availability, setAvailability] = useState([]);
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [fees, setFees] = useState("");
  const [selectedAppointmentTime, setSelectedAppointmentTime] = useState("");
  const [appointmentDay, setAppointmentDay] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [appointmentTime, setAppointmentTime] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(doctor._id);

  const handleAddDay = () => {
    if (!day || !startTime || !endTime) {
      return;
    }
    const dayExists = availability.some(
      (availableDay) => availableDay.day === day
    );

    if (dayExists) {
      alert("This day has already been selected.");
      return;
    }
    if (availability.length >= 3) {
      alert("You can only add a maximum of 3 days.");
      return;
    }
    setAvailability([...availability, { day, startTime, endTime }]);
    setDay("");
    setStartTime("");
    setEndTime("");
  };
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const times = [];

  for (let hour = 0; hour < 24; hour++) {
    const suffix = hour < 12 ? "AM" : "PM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    times.push(`${hour12}:00 ${suffix}`);

    times.push(`${hour12}:30 ${suffix}`);
  }

  const handleDeleteAccount = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to recover this account!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");

        const doctorResponse = await fetch(
          `http://localhost:5000/users/profile/delete/${doctor._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!doctorResponse.ok) {
          throw new Error("Failed to delete account");
        }

        Swal.fire("Deleted!", "Your account has been deleted.", "success");

      }
    } catch (error) {
      console.error("Error deleting account:", error);

      Swal.fire(
        "Error!",
        "Something went wrong while deleting your account.",
        "error"
      );
    }
  };

  const handleEditCard1 = () => {
    setIsEditingCard1(true);
  };

  const handleSaveCard1 = async () => {
    setIsEditingCard1(false);

    const updatedData = {
      name,
      specialty,
      bio,
      image,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const doctorResponse = await fetch(
        "http://localhost:5000/doctors/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!doctorResponse.ok) {
        console.error("Failed to fetch doctor data");
        return;
      }

      const doctorResult = await doctorResponse.json();
      console.log(doctorResult);

      const doctorId = doctorResult.data.doctor._id;

      const response = await fetch(
        `http://localhost:5000/doctors/update-doctor/${doctorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Card updated successfully", result);
      } else {
        console.error(
          "Failed to update card",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditCard2 = () => {
    setIsEditingCard2(true);
  };

  const handleSaveCard2 = async () => {
    setIsEditingCard2(false);

    const updatedData = {
      age,
      gender,
      yearsOfExperience,
      phoneNumber,
      availability,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const doctorResponse = await fetch(
        "http://localhost:5000/doctors/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!doctorResponse.ok) {
        console.error("Failed to fetch doctor data");
        return;
      }

      const doctorResult = await doctorResponse.json();
      console.log(doctorResult);

      const doctorId = doctorResult.data.doctor._id;

      const response = await fetch(
        `http://localhost:5000/doctors/update-doctor/${doctorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Card updated successfully", result);
      } else {
        console.error(
          "Failed to update card",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleBooking = async () => {
    setLoading(true);
    
    const [time, modifier] = selectedAppointmentTime.split(" ");
    let [hours, minutes] = time.split(":");
  
    if (hours === "12") {
      hours = modifier === "AM" ? "00" : "12";
    } else if (modifier === "PM") {
      hours = String(Number(hours) + 12);
    }
  
    hours = hours.padStart(2, "0");
    minutes = minutes.padStart(2, "0");
  
    const appointmentTime = `${appointmentDay}T${hours}:${minutes}:00Z`;
    setAppointmentTime(appointmentTime);
  
    const formData = { appointmentTime };
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }
  
      const response = await fetch(
        `http://localhost:5000/users/profile/book/${doctor._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
  
      const result = await response.json();
  
      if (response.ok) {
        console.log(result.data.doctorName);
        console.log("Appointment booked successfully", result);
        
        Swal.fire({
          title: "Appointment Booked!",
          text: result.message,
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        console.error(
          "Failed to book appointment",
          result.message,
          response.status,
          response.statusText
        );
        Swal.fire({
          title: "Error!",
          text: result.message || "Failed to book appointment.",
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
    }
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      {<Header />}
       {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <ClipLoader color="#3085d6" loading={loading} size={50} />
        </div>
      ) :
      (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="doc-card mb-4">
              <div
                className={`doctor-card ${
                  isEditingCard1 ? "card-editing" : ""
                }`}
              >
                <div className="doctor-img">
                  {isEditingCard1 ? (
                    <>
                      <label
                        htmlFor="profile-picture"
                        className="profile-label"
                      >
                        Choose Profile Picture
                      </label>
                      <input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="profile-input"
                      />
                    </>
                  ) : (
                    <img src={image} alt="Profile" className="profile-img" />
                  )}
                </div>

                <div className="doctor-info">
                  {isEditingCard1 ? (
                    <>
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="edit-input"
                      />
                      <label htmlFor="">Specialty</label>
                      <input
                        type="text"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="edit-input"
                      />
                    </>
                  ) : (
                    <>
                      <span className="doctor-name">{name}</span>
                      <span className="doctor-specialty">{specialty}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="doctor-bio">
                {isEditingCard1 ? (
                  <textarea
                    className="bio-input"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write your bio here..."
                  ></textarea>
                ) : (
                  <div>{bio === "" ? "Please write your bio." : bio}</div>
                )}
              </div>

              {isOwnerOfPof && (
                <div className="card-actions">
                  {isEditingCard1 ? (
                    <button className="edit-bio-btn" onClick={handleSaveCard1}>
                      Save
                    </button>
                  ) : (
                    <button className="edit-bio-btn" onClick={handleEditCard1}>
                      Edit
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="doc-card mb-4">
                <div className="about-doctor-card">
                  <div className="about-header">
                    <a href="#" className="info-icon">
                      <img src={infoImage} alt="Profile" />
                    </a>
                    <span className="about-text">About The Doctor</span>
                  </div>

                  <div className="doctor-details">
                    {isEditingCard2 ? (
                      <>
                        <p>
                          <strong>Age:</strong>
                          <input
                            type="text"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="edit-input"
                          />
                        </p>
                        <p>
                          <strong>Gender:</strong>
                          <input
                            type="text"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="edit-input"
                          />
                        </p>
                        <p>
                          <strong>Experience:</strong>
                          <input
                            type="text"
                            value={yearsOfExperience}
                            onChange={(e) =>
                              setYearsOfExperience(e.target.value)
                            }
                            className="edit-input"
                          />
                        </p>
                        <p>
                          <strong>Phone Number:</strong>
                          <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="edit-input"
                          />
                        </p>
                        <p>
                          <strong>Languages:</strong>
                          <input
                            type="text"
                            value={languages}
                            onChange={(e) => setLanguages(e.target.value)}
                            className="edit-input"
                          />
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>Age:</strong> {age}
                        </p>
                        <p>
                          <strong>Gender:</strong> {gender}
                        </p>
                        <p>
                          <strong>Experience:</strong> {yearsOfExperience}
                        </p>
                        <p>
                          <strong>Phone Number:</strong> {phoneNumber}
                        </p>
                        <p>
                          <strong>Languages:</strong> {languages}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="availability-section">
                    <strong>Available Days :</strong>
                    {availability.length === 0 ? (
                      <p>Please add available days.</p>
                    ) : (
                      availability.map((slot, index) => (
                        <div key={index}>
                          <span>{slot.day}:</span>{" "}
                          <span>
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                      ))
                    )}

                    {isEditingCard2 && (
                      <div className="add-day-form">
                        <select
                          required
                          value={day}
                          onChange={(e) => setDay(e.target.value)}
                        >
                          <option value="" disabled>
                            Select a day
                          </option>
                          {daysOfWeek.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <select
                          required
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        >
                          <option value="" disabled>
                            Select start time
                          </option>
                          {times.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <select
                          required
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        >
                          <option value="" disabled>
                            Select end time
                          </option>
                          {times.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <button onClick={handleAddDay}>Add Day</button>
                      </div>
                    )}
                  </div>
                  {isOwnerOfPof && (
                    <div className="card-actions">
                      {isEditingCard2 ? (
                        <button
                          className="edit-bio-btn"
                          onClick={handleSaveCard2}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="edit-bio-btn"
                          onClick={handleEditCard2}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {isOwnerOfPof && (
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="doc-card mb-4">
                  <div className="about-doctor-card">
                    <div className="about-header">
                      <span className="about-text">Booked Appointments : </span>
                    </div>
                    {appointments.length > 0 ? (
                      <ol>
                        {appointments
                          .sort(
                            (a, b) =>
                              new Date(a.appointmentTime) -
                              new Date(b.appointmentTime)
                          )
                          .map((appointment, index) => {
                            let appointmentDate = new Date(
                              appointment.appointmentTime
                            );

                            const timezoneOffset =
                              appointmentDate.getTimezoneOffset();
                            appointmentDate.setMinutes(
                              appointmentDate.getMinutes() + timezoneOffset
                            );

                            const formattedDate =
                              appointmentDate.toLocaleString("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              });

                            return <li key={index}>Date: {formattedDate}</li>;
                          })}
                      </ol>
                    ) : (
                      <p>No appointments available.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isOwnerOfPof && (
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="booking-div doc-card">
                <div className="booking-info-txt">
                  <h5>Booking Information</h5>
                </div>
                <div className=" booking-info">
                  <div className="booking-details">
                    <div className="booking-fees">
                      <img src={feesImage} alt="fees image" />
                      <span>
                        <span className="fees-txt">{fees.consultation}</span>{" "}
                        EGP
                      </span>
                    </div>
                    <div className="booking-duration">
                      <img src={timeImage} alt="time image" />
                      <span>
                        Waiting Time : <span className="fees-txt">30 min</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="appointments-container">
                  <div className="appointment-txt">
                    <h5>Select appointment day</h5>
                  </div>

                  <input
                    type="date"
                    className="styled-date-input"
                    value={appointmentDay}
                    onChange={(e) => setAppointmentDay(e.target.value)}
                  />
                </div>

                <div className="appointments-container">
                  <div className="appointment-txt">
                    <h5>Select appointment time</h5>
                  </div>
                  <select
                    className="time-select"
                    required
                    value={selectedAppointmentTime}
                    onChange={(e) => setSelectedAppointmentTime(e.target.value)}
                  >
                    <option value="" disabled>
                      choose time
                    </option>
                    {times.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="booking-btn-container">
                  <div className="booking-btn mt-3">
                    <button className="edit-bio-btn" onClick={handleBooking}>
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isOwnerOfPof && (
            <button onClick={handleDeleteAccount} className="delete-btn">
              Delete account
            </button>
          )}
        </div>
      </div>
      )}
    </>
  );
}
export default DoctorProfile;
