import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientForm from "./components/patientForm";
import DoctorProfile from "./components/doctorForm";

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
         <Route path="/doctor-form" element={<DoctorProfile/>}/>
         <Route path="/user-form" element={<PatientForm/>}/>
      </Routes>
    </Router>
  );
};

export default App;   
