import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./components/Context/userContext.jsx";
import { DoctorProvider } from "./components/Doctor-details/DoctorContext.jsx";
import { AppointmentsProvider } from "./components/Context/appointmentsContext.jsx";
import { ProfileImageProvider } from "./components/Context/profileImageContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DoctorProvider>
      <UserProvider>
        <ProfileImageProvider>
          <AppointmentsProvider>
            <App />
          </AppointmentsProvider>
        </ProfileImageProvider>
      </UserProvider>
    </DoctorProvider>
  </StrictMode>
);
