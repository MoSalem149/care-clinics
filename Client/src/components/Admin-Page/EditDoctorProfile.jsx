import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DoctorContext } from "../Doctor-details/DoctorContext"; // Adjust the import path
import styles from "./CSS/EditDoctorProfile.module.css";

const EditDoctorProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setDoctors, setSelectedDoctor } = useContext(DoctorContext);

  const doctor = state?.doctor;
  const [doctorData, setDoctorData] = useState({
    name: state.doctor.name || "",
    age: state.doctor.age || "",
    gender: state.doctor.gender || "",
    phoneNumber: "",
    specialty: state.doctor.specialty || "",
    yearsOfExperience: state.doctor.yearsOfExperience || "",
    bio: state.doctor.bio || "",
    department: state.doctor.department || "",
    profileImage: state.doctor.profileImage || "",
    fees: state.doctor.fees || { consultation: "" },
    isApproved: state.doctor?.isApproved || false,
  });
  const handleApprovalChange = (e) => {
    setDoctorData({ ...doctorData, isApproved: e.target.checked });
  };

  const [availability, setAvailability] = useState(
    state.doctor.availability || [{ day: "", startTime: "", endTime: "" }]
  );

  const [fees, setFees] = useState(state.doctor.fees || { consultation: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const timeOptions = [];
  for (let hour = 1; hour <= 12; hour++) {
    timeOptions.push(`${hour}:00 AM`);
    timeOptions.push(`${hour}:30 AM`);
    timeOptions.push(`${hour}:00 PM`);
    timeOptions.push(`${hour}:30 PM`);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({ ...doctorData, [name]: value });
  };
  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    const phoneNumberPattern = /^\+20(10|11|12|15)\d{8}$/;

    setDoctorData((prevData) => ({
      ...prevData,
      phoneNumber: value,
    }));

    if (value !== "" && !phoneNumberPattern.test(value)) {
      setErrorMessage(
        "Phone number must be in the correct format: +20(10|11|12|15)XXXXXXXX"
      );
    } else {
      setErrorMessage("");
    }
  };

  const handleAvailabilityChange = (index, key, value) => {
    const updatedSlots = [...availability];
    updatedSlots[index][key] = value;
    setAvailability(updatedSlots);
  };
  const handleAddAvailability = () => {
    setAvailability([...availability, { day: "", startTime: "", endTime: "" }]);
  };

  const handleFeesChange = (type, value) => {
    setFees((prevData) => ({
      ...prevData,
      [type]: value,
    }));
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const updatedFields = {};

    for (const key in doctorData) {
      if (doctorData[key] !== state.doctor[key] && doctorData[key] !== "") {
        updatedFields[key] = doctorData[key];
      }
    }
    for (const key in updatedFields) {
      formData.append(key, updatedFields[key]);
    }
    formData.append("availability", JSON.stringify(availability));

    if (JSON.stringify(fees) !== JSON.stringify(state.doctor.fees)) {
      formData.append("fees", JSON.stringify(fees));
    }

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/Admin/doctors/${state.doctor._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error);
        throw new Error(data.error);
      }
      setSuccessMessage("Doctor profile updated successfully!");
      setSelectedDoctor(data.doctor);
      setErrorMessage("");
      setDoctors((prev) =>
        prev.map((doctor) =>
          doctor._id === data.doctor._id ? data.doctor : doctor
        )
      );
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (error) {
      // console.error(error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <form className={styles.EditDoctor_form} onSubmit={handleSubmit}>
      <p className={styles.Header}>Edit Doctor Profile</p>
      <div className={styles.EditDoctor_formGroup}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={doctorData.name}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.EditDoctor_formGroup}>
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={doctorData.age}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.EditDoctor_formGroup}>
        <label>Gender:</label>
        <input
          type="text"
          name="gender"
          value={doctorData.gender}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.EditDoctor_formGroup}>
        <label>Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          value={doctorData.phoneNumber}
          onChange={handlePhoneNumberChange}
        />
      </div>
      <div className={styles.EditDoctor_formGroup}>
        <label>Specialty:</label>
        <input
          type="text"
          name="specialty"
          value={doctorData.specialty}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.EditDoctor_formGroup}>
        <label>Years of Experience:</label>
        <input
          type="number"
          name="yearsOfExperience"
          value={doctorData.yearsOfExperience}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.EditDoctor_formGroup}>
        <label>Bio:</label>
        <textarea
          name="bio"
          value={doctorData.bio}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.EditDoctor_formGroup}>
        <h3 className={styles.fees}>Fees:</h3>
        <input
          type="number"
          placeholder={doctorData.fees.consultation || "Enter Consultation Fee"}
          onChange={(e) => handleFeesChange("consultation", e.target.value)}
        />
      </div>
      <div className={styles.EditDoctor_formGroup}>
        <h3 className={styles.fees}>Availability:</h3>
        {availability.map((slot, index) => (
          <div key={index} className={styles.EditDoctor_availabilitySlot}>
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
          className={styles.EditDoctor_addButton}
          onClick={handleAddAvailability}
        >
          Add Availability Slot
        </button>
      </div>
      <div className={styles.EditDoctor_formGroup}>
        <label>Profile Image:</label>
        <input type="file" name="profileImage" onChange={handleImageChange} />
      </div>
      <div className={styles.EditDoctorProfile_Approved}>
        <label htmlFor="isApproved" className={styles.label}>
          Is Approved:
        </label>
        <input
          type="checkbox"
          id="isApproved"
          name="isApproved"
          checked={doctorData.isApproved}
          onChange={handleApprovalChange}
          className={styles.checkbox}
        />
      </div>

      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
      <button type="submit" className={styles.EditDoctor_submitButton}>
        Update Doctor
      </button>
    </form>
  );
};

export default EditDoctorProfile;
