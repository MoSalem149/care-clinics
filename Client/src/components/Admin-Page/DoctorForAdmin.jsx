import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../Doctor-details/DoctorContext";
import styles from "./CSS/DoctorForAdmin.module.css";
import { FaEdit } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import DeleteConfirmation from "./DeleteConfirmation";
import { MdDelete } from "react-icons/md";

const DoctorForAdmin = () => {
  const { doctors, setDoctors, setSelectedDoctor } = useContext(DoctorContext);
  const [successMessage, setSuccessMessage] = useState("");
  const [showUnapproved, setShowUnapproved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
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
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, [setDoctors, token]);

  const handleEdit = (doctor) => {
    navigate("/admin/edit-doctor-profile", { state: { doctor } });
    console.log(doctor);
  };

  const toggleUnapproved = () => {
    setShowUnapproved(!showUnapproved);
  };
  const handleDelete = async (doctorId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/Admin/doctors/${doctorId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the doctor");
      }

      // Update the state after successful deletion
      setDoctors((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor._id !== doctorId)
      );
      setSuccessMessage("Doctor deleted successfully!"); // Show success message
    } catch (error) {
      console.error("Error deleting doctor:", error);
    } finally {
      setIsModalOpen(false); // Close the modal after deletion
    }
  };

  const openModal = (doctor) => {
    setDoctorToDelete(doctor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDoctorToDelete(null);
  };

  const filteredDoctors = showUnapproved
    ? doctors.filter((doctor) => !doctor.isApproved)
    : doctors;

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

      {userRole === "admin" && (
        <div className={styles.createDoctorButtonWrapper}>
          <button className={styles.toggleButton} onClick={toggleUnapproved}>
            {showUnapproved ? "Show All Doctors" : "Show Unapproved Doctors"}
          </button>
          <Link to="/admin/create-doctor">
            <button className={styles.createDoctorButton}>
              Create New Doctor
            </button>
          </Link>
        </div>
      )}

      <div className={styles.DoctorsContainer}>
        {filteredDoctors.map((doctor) => (
          <div key={doctor._id} className={styles.DoctorContainer}>
            <div className={styles.ImageHolderForDoctors}>
              {userRole === "admin" && (
                <div className={styles.adminController}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(doctor)}
                  >
                    Edit
                    <FaEdit className={styles.EditIcon} />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => openModal(doctor)}
                  >
                    Delete
                    <MdDelete />
                  </button>
                </div>
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
      <DeleteConfirmation
        isOpen={isModalOpen}
        departmentName={doctorToDelete ? doctorToDelete.name : ""}
        onClose={closeModal}
        onConfirm={() => doctorToDelete && handleDelete(doctorToDelete._id)}
      />
    </div>
  );
};

export default DoctorForAdmin;
