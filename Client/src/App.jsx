import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
/* Import Pages */
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import PatientHomePage from "./pages/PatientHomePage";
// import DepartmentsPage from "./pages/DepartmentsPage";
// import UserProfilePage from "./pages/UserProfilePage";
/* Import Components */
import Department from "./components/Departments/Department";
import AdminDashBoard from "./components/Admin-Page/AdminDashBord";
import CreateDepartment from "./components/Admin-Page/CreateDepartment";
import EditDepartment from "./components/Admin-Page/EditComponent";
import Doctor from "./components/Doctor-details/Doctor";
import { DoctorProvider } from "./components/Doctor-details/DoctorContext";
import EditDoctorProfile from "./components/Admin-Page/EditDoctorProfile";
import "bootstrap/dist/css/bootstrap.min.css";
import PatientForm from "./components/patientForm";
import DoctorForm from "./components/doctorForm";
import CreateDoctor from "./components/Admin-Page/CreateDoctor";
/* Import CSS */
import "./App.css";
import DoctorForUser from "./components/Doctor-details/DoctorForUser";
import Appointments from "./components/Admin-Page/Appointments";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/department" element={<Department />} />
        <Route path="/doctor" element={<DoctorForUser />}></Route>
        <Route path="/department/doctors" element={<Doctor />} />
        <Route path="/admin" element={<AdminDashBoard />} />
        <Route path="/admin/create-department" element={<CreateDepartment />} />
        <Route path="/admin/edit-department" element={<EditDepartment />} />
        <Route
          path="/admin/edit-doctor-profile"
          element={<EditDoctorProfile />}
        />
        <Route path="/admin/create-doctor" element={<CreateDoctor />} />

        <Route path="/admin/Appointments" element={<Appointments />} />
        <Route path="/doctor-form" element={<DoctorForm />} />
        <Route path="/user-form" element={<PatientForm />} />
        <Route path="/patient-home" element={<PatientHomePage />} />
      </Routes>
    </Router>
    // <DepartmentsPage />
    // <UserProfilePage />
  );
};

export default App;
