import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./CSS/EditDoctorProfile.module.css";

const EditDoctorProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const doctor = location.state?.doctor;

  useEffect(() => {
    if (!doctor) {
      console.error("No doctor found in location.state");
      navigate("/");
    }
  }, [doctor, navigate]);

  const [formData, setFormData] = useState(doctor || {});
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/Admin/doctors/${doctor._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        // console.log("Doctor updated successfully");
      } else {
        // console.error("Failed to update doctor");
      }
    } catch (error) {
      // console.error("Error updating doctor:", error);
    }
  };

  if (!doctor) {
    return <p>Loading doctor information...</p>;
  }

  return (
    <div className={styles.editDoctorProfile}>
      <h2>Edit Doctor Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Specialty:
          <input
            type="text"
            name="specialty"
            value={formData.specialty || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Age:
          <input
            type="number"
            name="age"
            value={formData.age || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Gender:
          <input
            type="text"
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Phone:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Availability:
          <input
            type="text"
            name="availability"
            value={JSON.stringify(formData.availability) || ""}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default EditDoctorProfile;
