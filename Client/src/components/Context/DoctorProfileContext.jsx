import { createContext, useContext, useState } from "react";

const DoctorProfileContext = createContext();

export const useDoctorProfile = () => useContext(DoctorProfileContext);

export const DoctorProfileProvider = ({ children }) => {
  const [doctorProfile, setDoctorProfile] = useState({
    name: "",
    age: "",
    gender: "",
    phoneNumber: "",
    specialty: "",
    yearsOfExperience: "",
    profileImage: null,
    fees: "",
    department: "",
  });
  const clearDoctorProfile = () => {
    setDoctorProfile({});
  };

  return (
    <DoctorProfileContext.Provider
      value={{ doctorProfile, setDoctorProfile, clearDoctorProfile }}
    >
      {children}
    </DoctorProfileContext.Provider>
  );
};
