import React, { useState } from "react";
import styles from "./CSS/AdminDashBord.module.css";
import Department from "../Departments/Department";
import CreateDepartment from "./CreateDepartment";
import DoctorForAdmin from "./DoctorForAdmin";
import Appointment from "./Appointments";
import { Navigate, useNavigate } from "react-router-dom";
const AdminDashBoard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

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
            <button onClick={() => setActiveSection("settings")}>
              Settings
            </button>
          </li>
        </ul>
      </aside>
      <main className={styles.mainContent}>
        <h1 className={styles.AdminHOne}>Welcome to the Admin Dashboard</h1>
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminDashBoard;
