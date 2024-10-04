import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import Login from "./pages/Login";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<SignUpPage />} /> 
        <Route path="/" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
