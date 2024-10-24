import React, { useContext, useEffect, useState } from "react";
import styles from "./Doctors.module.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdCreateNewFolder } from "react-icons/md";
import ConfirmationModal from "../Admin-Page/DeleteConfirmation";
import starImg from "../../../src/assets/images/Department-img/stars-img.png";
import mainImg from "../../../src/assets/images/Department-img/main-img.png";
import arrowIcon from "../../../src/assets/images/Department-img/Group.png";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { DoctorContext } from "./DoctorContext";
import Header from "../Header";
const Doctor = () => {
  const location = useLocation();
  const { department } = location.state;
  const { doctors } = useContext(DoctorContext);
  const navigate = useNavigate();
  const FilterData = doctors.filter(
    (doctor) =>
      doctor.specialty === department.name && doctor.isApproved === true
  );
  const handleBook = (doctor) => {
    navigate("book", { state: { doctor } });
  };

  return (
    <>
      <Header />
      <div className={styles.DepartmentsContainer}>
        <div className={styles.DepartmentContainer}>
          <h2>
            Our <span className={styles.headerSpan}>Doctors</span>
          </h2>
          <h2>
            <img src={starImg} alt="Stars Decoration" />
            <span className={styles.headerSpan}>The best experts, </span> Just
            for You.
          </h2>
          <img className={styles.departmentImage} src={department.image} />
          <h3 className={styles.Departmentheader}>{department.name}</h3>
        </div>
        <div className={styles.DoctorsContainer}>
          {FilterData.map((doctor) => (
            <div key={doctor._id} className={styles.DoctorContainer}>
              <div className={styles.ImageHolderForDoctors}>
                <img src={doctor.ProfileImage} />
              </div>
              <p className={styles.DoctorName}>{doctor.name}</p>
              <p className={styles.DoctorSpecialty}>
                Specialty:{" "}
                <span className={styles.specialtySpan}>{doctor.specialty}</span>
              </p>
              <p className={styles.DoctorBio}>{doctor.bio}</p>
              <button
                className={styles.BookAppointment}
                onClick={() => handleBook(doctor)}
              >
                Book Appointment
                <div className={styles.arrowIconHolder}>
                  <img src={arrowIcon} className={styles.arrowIcon} />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Doctor;
