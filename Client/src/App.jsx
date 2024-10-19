// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import SignUpPage from "./pages/SignUpPage";
// import LoginPage from "./pages/LoginPage";
// import ResetPasswordPage from "./pages/ResetPasswordPage";
// import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import PatientHomePage from "./pages/PatientHomePage";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientForm from "./components/patientForm";
import DoctorProfile from "./components/doctorForm";

const App = () => {
  return (
<<<<<<< HEAD
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
=======
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<SignUpPage />} />
    //     <Route path="/login" element={<LoginPage />} />
    //     <Route path="/forget-password" element={<ForgetPasswordPage />} />
    //     {/* <Route path="/reset-password" element={<ResetPasswordPage />} /> */}
    //     <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    //     <Route path="/signup" element={<SignUpPage />} />
    //   </Routes>
    // </Router>
    <PatientHomePage />
>>>>>>> d31eb5b98d47fee6c25118949274e377013eee74
  );
};

export default App;   
