import React, { useState } from "react";
import styles from "./CSS/AdminDashBord.module.css";
import Department from "../Departments/Department";
import CreateDepartment from "./CreateDepartment";
import DoctorForAdmin from "./DoctorForAdmin";
import Appointment from "./Appointments";
import { Navigate, useNavigate } from "react-router-dom";
import { useUsers } from "../Context/userContext";
const AdminDashBoard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false); // New state for logout confirmation
  const navigate = useNavigate();
  const { clearUserData } = useUsers();
  const { logout } = useUsers();

  const renderSection = () => {
    switch (activeSection) {
      case "departments":
        return <Department />;
      case "doctors":
        return <DoctorForAdmin />;
      case "appointments":
        return <Appointment />;
      case "settings":
        return <div>Settings Section</div>;
      default:
        return <Department />;
    }
  };
  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    clearUserData();
    logout();
    navigate("/signup");
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };
  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <ul className={styles.navList}>
          <li>
            <button onClick={() => setActiveSection("departments")}>
              Department
            </button>
          </li>
          <li>
            <button onClick={() => setActiveSection("doctors")}>Doctors</button>
          </li>
          <li>
            <button onClick={() => setActiveSection("appointments")}>
              Appointments
            </button>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </aside>
      <main className={styles.mainContent}>
        <h1 className={styles.AdminHOne}>Welcome to the Admin Dashboard</h1>
        {renderSection()}
      </main>
      {showLogoutConfirmation && (
        <div className={styles.logoutConfirmationBox}>
          <p>Are you sure you want to log out?</p>
          <button onClick={confirmLogout}>Yes</button>
          <button onClick={cancelLogout}>No</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashBoard;
