import React, { createContext, useState, useEffect } from "react";

const DoctorContext = createContext();

const DoctorProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const GetAllDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/doctors/GetAllDoctors");
        const Doctordata = await res.json();
        setDoctors(Doctordata);
      } catch (error) {
        // console.error("Error Fetching Doctors", error);
      }
    };
    GetAllDoctors();
  }, []);

  return (
    <DoctorContext.Provider value={{ doctors, setDoctors }}>
      {children}
    </DoctorContext.Provider>
  );
};

export { DoctorContext, DoctorProvider };
