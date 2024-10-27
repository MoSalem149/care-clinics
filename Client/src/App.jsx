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
import ContactUsPage from "./pages/ContactUsPage";
import UserProfilePage from "./pages/UserProfilePage";
/* Import Components */
import AdminDashBoard from "./components/Admin-Page/AdminDashBord";
import ProtectedRouteForAdmin from "./components/Context/ProtectedRouteForAdmin";
import CreateDepartment from "./components/Admin-Page/CreateDepartment";
import EditDepartment from "./components/Admin-Page/EditComponent";
import Doctor from "./components/Doctor-details/Doctor";
// import { DoctorProvider } from "./components/Doctor-details/DoctorContext";
import EditDoctorProfile from "./components/Admin-Page/EditDoctorProfile";
import PatientForm from "./components/patientForm";
import DoctorForm from "./components/doctorForm";
import DoctorProfile from "./pages/doctorProfile";
import CreateDoctor from "./components/Admin-Page/CreateDoctor";
import DoctorForUser from "./components/Doctor-details/DoctorForUser";
import { GetUsersProvider } from "./components/Context/GetUsersContext";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
/* Import CSS */
import "./App.css";
import DepartmentParent from "./components/Departments/DepartmentParent";
import Booking from "./components/Booking";
import { AppointmentsProvider } from "./components/Context/appointmentsContext";

const App = () => {
  return (
    <GetUsersProvider>
      <AppointmentsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forget-password" element={<ForgetPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/doctor-form" element={<DoctorForm />} />
            <Route path="/user-form" element={<PatientForm />} />
            <Route path="/patient-home" element={<PatientHomePage />} />
            <Route path="/doctor-profile" element={<DoctorProfile />} />
            <Route path="/department/doctors/book" element={<Booking />} />
            <Route path="/Contact" element={<ContactUsPage />} />
            <Route path="/user-profile" element={<UserProfilePage />} />

            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/department" element={<DepartmentParent />} />
            <Route path="/doctor" element={<DoctorForUser />}></Route>
            <Route path="/department/doctors" element={<Doctor />} />

            <Route
              path="/admin"
              element={
                <ProtectedRouteForAdmin>
                  <AdminDashBoard />
                </ProtectedRouteForAdmin>
              }
            />
            <Route
              path="/admin/create-department"
              element={
                <ProtectedRouteForAdmin>
                  <CreateDepartment />
                </ProtectedRouteForAdmin>
              }
            />

            <Route
              path="/admin/edit-department"
              element={
                <ProtectedRouteForAdmin>
                  <EditDepartment />
                </ProtectedRouteForAdmin>
              }
            />
            <Route
              path="/admin/edit-doctor-profile"
              element={
                <ProtectedRouteForAdmin>
                  <EditDoctorProfile />
                </ProtectedRouteForAdmin>
              }
            />
            <Route
              path="/admin/create-doctor"
              element={
                <ProtectedRouteForAdmin>
                  <CreateDoctor />
                </ProtectedRouteForAdmin>
              }
            />

            <Route path="/doctor-form" element={<DoctorForm />} />
            <Route path="/user-form" element={<PatientForm />} />
            <Route path="/patient-home" element={<PatientHomePage />} />
          </Routes>
        </Router>
      </AppointmentsProvider>
    </GetUsersProvider>

    // <DepartmentsPage />
    // <UserProfilePage />
    // <ContactUsPage />
    // <Header />
    // <Footer />
  );
};

export default App;
