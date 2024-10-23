import { Link } from "react-router-dom";
import styles from "./CSS/sidebar.module.css"; // Your CSS file

const Sidebar = () => {
  return (
    <div>
      <aside className={styles.sidebar}>
        <nav>
          <ul>
            <li>
              <Link to="/admin/departments">Departments</Link>
            </li>
            <li>
              <Link to="/admin/doctors">Doctors</Link>
            </li>
            <li>
              <Link to="/admin/appointments">Appointments</Link>
            </li>
            <li>
              <Link to="/admin/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        <h1 className={styles.AdminHOne}>Welcome to the Admin Dashboard</h1>
      </main>
    </div>
  );
};

export default Sidebar;
