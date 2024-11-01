import { useRef, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDoctorProfile } from "./Context/DoctorProfileContext";
import "../styles/doctorForm.css";
import { useState } from "react";
function DoctorProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const { doctorProfile, setDoctorProfile } = useDoctorProfile();

  useEffect(() => {
    document.body.style.backgroundColor = "#E6F7FF";
    document.body.style.marginTop = "30px";
    document.body.style.backgroundImage =
      "url('../../public/Vector.png'),url('../../public/Vector (1).png')";
    document.body.style.backgroundPosition = "top right, top left";
    document.body.style.backgroundRepeat = "no-repeat, no-repeat";
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.marginTop = "";
      document.body.style.backgroundImage = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
    };
  }, []);

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (key) => (e) => {
    setDoctorProfile((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDoctorProfile((prevProfile) => ({
      ...prevProfile,
      profileImage: file || null,
    }));
    console.log("File selected:", file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Doctor Profile State:", doctorProfile);

    const formData = new FormData();
    Object.entries(doctorProfile).forEach(([key, value]) => {
      if (value && key !== "profileImage") {
        formData.append(key, value);
      }
    });

    if (doctorProfile.profileImage) {
      formData.append("profileImage", doctorProfile.profileImage);
      console.log("Profile Image:", doctorProfile.profileImage);
    }

    // Log FormData for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/doctors/compelete-profile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDoctorProfile(data);
        Swal.fire({
          title: "Success!",
          text: "Profile information saved successfully",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/doctor-profile", { state: { data } });
        });
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        Swal.fire({
          title: "Error!",
          text:
            errorData.message ||
            "An error occurred while saving profile information",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error saving profile information:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while saving profile information",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const handleConfirmClick = (e) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="welcome-patient text-center mb-4">
          <h2 className="hello">
            <span className="hello-doc">Hello</span> Doc!
          </h2>
          <h5>Please complete your information</h5>
        </div>
        <div className="col-8 p-form-container d-flex align-items-center justify-content-center">
          <form
            ref={formRef}
            className="patient-form"
            onSubmit={handleSubmit}
            id="patientForm"
          >
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="name">Full Name</label>
                <input
                  required
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Full Name"
                  value={doctorProfile.name || ""}
                  onChange={handleChange("name")}
                />
              </div>
              <div className="col">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  className="form-control"
                  id="age"
                  placeholder="Age"
                  value={doctorProfile.age || ""}
                  onChange={handleChange("age")}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="phone">Phone Number</label>
                <input
                  required
                  type="tel"
                  className="form-control"
                  id="phone"
                  placeholder="Phone Number"
                  value={doctorProfile.phoneNumber || ""}
                  onChange={handleChange("phoneNumber")}
                />
              </div>
              <div className="col">
                <label htmlFor="gender">Gender</label>
                <select
                  required
                  className="form-control"
                  id="gender"
                  value={doctorProfile.gender || ""}
                  onChange={handleChange("gender")}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="specialty">Specialty</label>
                <input
                  required
                  type="text"
                  className="form-control"
                  id="specialty"
                  placeholder="Specialty"
                  value={doctorProfile.specialty || ""}
                  onChange={handleChange("specialty")}
                />
              </div>
              <div className="col">
                <label htmlFor="yearsOfExperience">Years of Experience</label>
                <input
                  type="number"
                  className="form-control"
                  id="yearsOfExperience"
                  placeholder="Years of Experience"
                  value={doctorProfile.yearsOfExperience || ""}
                  onChange={handleChange("yearsOfExperience")}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="fees">Consultation Fees</label>
                <input
                  type="number"
                  className="form-control"
                  id="fees"
                  placeholder="Consultation Fees"
                  value={doctorProfile.fees || ""}
                  onChange={handleChange("fees")}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col">
                <label htmlFor="department">Department</label>
                <select
                  required
                  className="form-control"
                  id="department"
                  value={doctorProfile.department || ""}
                  onChange={handleChange("department")}
                >
                  <option value="">Select Department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="General Dental Care">
                    General Dental Care
                  </option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="col-4 upload-doc-container d-flex align-items-center justify-content-center">
          <p className="upload-text">Upload your photo</p>
          <div
            className="photo-upload text-center"
            onClick={handleDivClick}
            style={{ cursor: "pointer" }}
          >
            <FaUpload size={40} style={{ color: "#1e84b5" }} />
            <input
              type="file"
              className="form-control"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="confirm-container pb-2">
          <button
            type="button"
            className="btn save-btn btn-primary mt-4"
            onClick={handleConfirmClick}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
