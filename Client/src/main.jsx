import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./components/Context/userContext.jsx";
import { DoctorProvider } from "./components/Doctor-details/DoctorContext.jsx";
import { AppointmentsProvider } from "./components/Context/appointmentsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <DoctorProvider>
        <AppointmentsProvider>
          <App />
        </AppointmentsProvider>
      </DoctorProvider>
    </UserProvider>
  </StrictMode>
);
