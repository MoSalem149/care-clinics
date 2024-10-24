import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useUsers } from "./userContext";

const AppointmentContext = createContext();

export const AppointmentsProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userRole } = useUsers();

  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token || userRole !== "admin") {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/Admin/Appointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await res.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Could not load appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token, userRole]);

  const contextValue = useMemo(
    () => ({
      appointments,
      loading,
      error,
    }),
    [appointments, loading, error]
  );

  return (
    <AppointmentContext.Provider value={contextValue}>
      {children}
    </AppointmentContext.Provider>
  );
};

export { AppointmentContext };

export const useAppointments = () => {
  return useContext(AppointmentContext);
};
