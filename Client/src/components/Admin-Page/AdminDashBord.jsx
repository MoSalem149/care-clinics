import React, { useState } from "react";
import styles from "./CSS/AdminDashBord.module.css";
import Department from "../Departments/Department";
import CreateDepartment from "./CreateDepartment";
import DoctorForAdmin from "./DoctorForAdmin";
const AdminDashBoard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "departments":
        return <Department />;
      case "doctors":
        return <DoctorForAdmin />;
      case "appointments":
        return <div>Appointments Section</div>;
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
        <h1>Welcome to the Admin Dashboard</h1>
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminDashBoard;
