 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import SignUpPage from "./pages/SignUpPage";
 import LoginPage from "./pages/LoginPage";
 import ResetPasswordPage from "./pages/ResetPasswordPage";
 import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import PatientHomePage from "./pages/PatientHomePage";
import "./App.css";
<<<<<<< HEAD
import Department from "./components/Departments/Department";
import AdminDashBoard from "./components/Admin-Page/AdminDashBord";
import CreateDepartment from "./components/Admin-Page/CreateDepartment";
import EditDepartment from "./components/Admin-Page/EditComponent";
import Doctor from "./components/Doctor-details/Doctor";
import { DoctorProvider } from "./components/Doctor-details/DoctorContext";
import EditDoctorProfile from "./components/Admin-Page/EditDoctorProfile";
const App = () => {
  return (
    <Router>
      <DoctorProvider>
        <Routes>
          <Route path="/" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/department" element={<Department />} />
          <Route path="/department/doctors" element={<Doctor />} />
          <Route path="/admin" element={<AdminDashBoard />} />
          <Route
            path="/admin/create-department"
            element={<CreateDepartment />}
          />
          <Route path="/admin/edit-department" element={<EditDepartment />} />
          <Route
            path="/admin/edit-doctor-profile"
            element={<EditDoctorProfile />}
          />
        </Routes>
      </DoctorProvider>
=======
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientForm from "./components/patientForm";
import DoctorForm from "./components/doctorForm";

const App = () => {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} /> 
         <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> 
         <Route path="/signup" element={<SignUpPage />} /> 
         <Route path="/doctor-form" element={<DoctorForm/>}/>
         <Route path="/user-form" element={<PatientForm/>}/>
         <Route path="/patient-home" element={<PatientHomePage/>}/>

      </Routes>
>>>>>>> 85b19a12526b6d029bb8f7b7c1347223fcba0e25
    </Router>
  );
};

export default App;   
