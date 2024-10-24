import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../Doctor-details/DoctorContext";
import GetUsersContext from "../Context/GetUsersContext";
import styles from "./CSS/appointments.module.css";
import { AppointmentContext } from "../Context/appointmentsContext";

const Appointments = () => {
  const { appointments, loading, error } = useContext(AppointmentContext);
  const { doctors } = useContext(DoctorContext);
  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useContext(GetUsersContext);

  const getUserName = (userId) => {
    if (!userId) return "Unknown User";
    const user = users.find((user) => user._id === userId);
    return user ? user.fullName : "Unknown User";
  };

  const doctorMap = doctors.map((doc) => ({
    id: doc._id,
    name: doc.name,
  }));

  if (loading || usersLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error || usersError) {
    return <div className={styles.error}>Error: {error || usersError}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Appointments</h1>
      {appointments.length === 0 ? (
        <div className={styles.noAppointments}>No appointments found.</div>
      ) : (
        <table className={styles.appointments}>
          <thead>
            <tr>
              <th>User</th>
              <th>Doctor</th>
              <th>Appointment Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => {
              const userId = appointment.user;
              const doctorId = appointment.doctor;
              const userName = getUserName(userId);
              const doctor = doctorMap.find((doc) => {
                return doc.id === doctorId;
              });
              const displayedDoctorName = doctor
                ? doctor.name
                : "Unknown Doctor";
              return (
                <tr key={appointment._id}>
                  <td>{userName}</td>
                  <td>{displayedDoctorName}</td>
                  <td>
                    {new Date(appointment.appointmentTime).toLocaleString()}
                  </td>
                  <td>{appointment.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Appointments;
