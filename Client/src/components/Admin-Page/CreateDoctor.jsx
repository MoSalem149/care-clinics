import React, { useState } from "react";
import styles from "./CSS/CreateDoctor.module.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const CreateDoctor = () => {
  const [doctorData, setDoctorData] = useState({
    fullName: "",
    email: "",
    age: "",
    gender: "",
    phoneNumber: "",
    specialty: "",
    yearsOfExperience: "",
    bio: "",
    department: "",
    fees: "",
  });
  const [availability, setAvailability] = useState([
    { day: "", startTime: "", endTime: "" },
  ]);
  const [profileImage, setProfileImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const timeOptions = [];
  for (let hour = 1; hour <= 12; hour++) {
    timeOptions.push(`${hour}:00 AM`);
    timeOptions.push(`${hour}:30 AM`);
    timeOptions.push(`${hour}:00 PM`);
    timeOptions.push(`${hour}:30 PM`);
  }

  useEffect(() => {
    setDoctorData((prevData) => ({
      ...prevData,
      department: prevData.specialty,
    }));
  }, [doctorData.specialty]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({ ...doctorData, [name]: value });
  };
  const handleAvailabilityChange = (index, key, value) => {
    const updatedSlots = [...availability];
    updatedSlots[index][key] = value;
    setAvailability(updatedSlots);
  };
  const handleAddAvailability = () => {
    setAvailability([...availability, { day: "", startTime: "", endTime: "" }]);
  };
  const handleFeesChange = (e) => {
    const value = e.target.value;
    setDoctorData((prevData) => ({
      ...prevData,
      fees: value,
    }));
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in doctorData) {
      formData.append(key, doctorData[key]);
    }
    formData.append("availability", JSON.stringify(availability));
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/Admin/doctors", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setSuccessMessage("Doctor created successfully!");
        setErrorMessage("");
        setTimeout(() => {
          navigate("/admin");
        }, 5000);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.error);
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      console.error("Error creating doctor:", error);
      setErrorMessage(error.message);
    }
  };
  return (
    <form className={styles.CreateDoctor_form} onSubmit={handleSubmit}>
      <p className={styles.Header}>Create Doctor</p>
      <div className={styles.CreateDoctor_formGroup}>
        <label>Full Name:</label>
        <input
          type="text"
          name="fullName"
          value={doctorData.fullName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className={styles.CreateDoctor_formGroup}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={doctorData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className={styles.CreateDoctor_formGroup}>
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={doctorData.age}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.CreateDoctor_formGroup}>
        <label>Gender:</label>
        <input
          type="text"
          name="gender"
          value={doctorData.gender}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.CreateDoctor_formGroup}>
        <label>Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          value={doctorData.phoneNumber}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.CreateDoctor_formGroup}>
        <label>Specialty:</label>
        <input
          type="text"
          name="specialty"
          value={doctorData.specialty}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className={styles.CreateDoctor_formGroup}>
        <label>Years of Experience:</label>
        <input
          type="number"
          name="yearsOfExperience"
          value={doctorData.yearsOfExperience}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.CreateDoctor_availability}>
        <h3>Availability</h3>
        {availability.map((slot, index) => (
          <div key={index} className={styles.CreateDoctor_availabilitySlot}>
            <select
              value={slot.day}
              onChange={(e) =>
                handleAvailabilityChange(index, "day", e.target.value)
              }
            >
              <option value="">Select Day</option>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              value={slot.startTime}
              onChange={(e) =>
                handleAvailabilityChange(index, "startTime", e.target.value)
              }
            >
              <option value="">Start Time</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <select
              value={slot.endTime}
              onChange={(e) =>
                handleAvailabilityChange(index, "endTime", e.target.value)
              }
            >
              <option value="">End Time</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          type="button"
          className={styles.CreateDoctor_addButton}
          onClick={handleAddAvailability}
        >
          Add Availability Slot
        </button>
      </div>
      <div className={styles.CreateDoctor_formGroup}>
        <h3 className={styles.Fees}>Fees</h3>
        <input
          type="number"
          value={doctorData.fees}
          onChange={handleFeesChange}
          placeholder="Fees"
          required
        />
      </div>
      <div className={styles.CreateDoctor_formGroup}>
        <label>Bio:</label>
        <textarea
          name="bio"
          value={doctorData.bio}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.CreateDoctor_formGroup}>
        <label>Profile Image:</label>
        <input type="file" name="profileImage" onChange={handleImageChange} />
      </div>
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      {errorMessage && <h1 className={styles.errorMessage}>{errorMessage}</h1>}
      <button type="submit" className={styles.CreateDoctor_submitButton}>
        Create Doctor
      </button>
    </form>
  );
};
export default CreateDoctor;
