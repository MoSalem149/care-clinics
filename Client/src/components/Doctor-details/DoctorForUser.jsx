import React, { useContext, useState } from "react";
import { DoctorContext } from "./DoctorContext";
import styles from "./DoctorForUser.module.css"; // Assuming you're using CSS modules

const DoctorForUser = () => {
  const { doctors } = useContext(DoctorContext);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Doctors List</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchBar}
      />
      <div className={styles.DoctorsContainer}>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div key={doctor._id} className={styles.DoctorContainer}>
              <div className={styles.ImageHolderForDoctors}>
                <img
                  className={styles.ProfileImage}
                  src={doctor.ProfileImage}
                  alt={doctor.name}
                />
              </div>
              <div className={styles.DoctorInfoContainer}>
                <p className={styles.DoctorName}>{doctor.name}</p>
                <p className={styles.DoctorSpecialty}>
                  Specialty:{" "}
                  <span className={styles.specialtySpan}>
                    {doctor.specialty}
                  </span>
                </p>
                <p className={styles.DoctorInfo}>
                  Age: {doctor.age} <br />
                  Gender: {doctor.gender} <br />
                  Years of Experience: {doctor.yearsOfExperience} <br />
                  Phone: {doctor.phoneNumber}
                  <br />
                  Availability:
                </p>
                {doctor.availability.map((slot) => (
                  <section className={styles.DoctorInfoAvail} key={slot._id}>
                    {slot.day}: {slot.startTime} - {slot.endTime}
                  </section>
                ))}
              </div>
              <button className={styles.BookAppointment}>
                Book Appointment
              </button>
            </div>
          ))
        ) : (
          <p>No doctors found</p>
        )}
      </div>
    </div>
  );
};

export default DoctorForUser;