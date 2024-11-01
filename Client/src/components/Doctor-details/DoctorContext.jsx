import React, { createContext, useState, useEffect } from "react";

const DoctorContext = createContext();

const DoctorProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const GetAllDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/doctors/GetAllDoctors");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const Doctordata = await res.json();
        setDoctors(Doctordata);
      } catch (error) {
        console.error("Error Fetching Doctors", error);
      }
    };
    GetAllDoctors();
  }, []);

  console.log("Doctors in Context:", doctors);

  return (
    <DoctorContext.Provider
      value={{ doctors, setDoctors, selectedDoctor, setSelectedDoctor }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export { DoctorContext, DoctorProvider };
