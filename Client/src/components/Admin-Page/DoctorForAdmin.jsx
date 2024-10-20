import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../Doctor-details/DoctorContext";
import styles from "./CSS/DoctorForAdmin.module.css";
import { FaEdit } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const DoctorForAdmin = () => {
  const { doctors, setDoctors } = useContext(DoctorContext);
  const [successMessage, setSuccessMessage] = useState("");
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:5000/Admin/doctors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        // console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [setDoctors, token]);

  const handleEdit = (doctor) => {
    navigate("/admin/edit-doctor-profile", { state: { doctor } });
  };

  return (
    <div className={styles.DepartmentsContainer}>
      <div className={styles.DepartmentContainer}>
        <h2>
          Our <span className={styles.headerSpan}>Doctors</span>
        </h2>
        <h2>
          <span className={styles.headerSpan}>The best experts, </span> Just for
          You.
        </h2>
      </div>
      <div className={styles.DoctorsContainer}>
        {doctors.map((doctor) => (
          <div key={doctor._id} className={styles.DoctorContainer}>
            <div className={styles.ImageHolderForDoctors}>
              {userRole === "admin" && (
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(doctor._id)}
                >
                  Edit
                  <FaEdit className={styles.EditIcon} />
                </button>
              )}
              <img
                className={styles.ProfileImage}
                src={doctor.ProfileImage}
                alt={doctor.name}
              />
            </div>

            <p className={styles.DoctorName}>{doctor.name}</p>
            <p className={styles.DoctorSpecialty}>
              Specialty:{" "}
              <span className={styles.specialtySpan}>{doctor.specialty}</span>
            </p>
            <p className={styles.DoctorInfo}>
              Age: {doctor.age} <br />
              Gender: {doctor.gender} <br />
              Years of Experience: {doctor.yearsOfExperience} <br />
              Phone: {doctor.phoneNumber}
              <br />
              availability:{" "}
            </p>
            {doctor.availability.map((slot) => (
              <section className={styles.DoctorInfoAvail} key={slot._id}>
                {slot.day}: {slot.startTime} - {slot.endTime}
              </section>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorForAdmin;
