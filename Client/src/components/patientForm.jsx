import { useRef, useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
/* Import CSS */
import "../styles/patientForm.css";
function PatientForm() {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.style.backgroundColor = "#E6F7FF";
    document.body.style.marginTop = "20px";
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
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [lastCheckupDate, setLastCheckupDate] = useState("");
  const [surgicalHistory, setSurgicalHistory] = useState("");
  const [chronicConditions, setChronicConditions] = useState("");
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      phoneNumber,
      gender,
      bloodType,
      lastCheckupDate: new Date(lastCheckupDate),
      surgicalHistory,
      familyMedicalHistory,
      chronicConditions,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/users/profile/add-info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Profile information saved successfully");
        navigate("/patient-home");
      } else {
        alert(result.message || "Failed to save profile information");
      }
    } catch (error) {
      console.error("Error saving profile information:", error);
      alert("An error occurred");
    }
  };

  const handleConfirmClick = (e) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-8 p-form-container d-flex align-items-center justify-content-center">
            <div>
              <div className="welcome-patient text-center mb-4">
                <h2 className="hello">Hello!</h2>
                <h5>Please complete your information</h5>
              </div>

              <form
                ref={formRef}
                className="patient-form"
                onSubmit={handleSubmit}
                id="patientForm"
              >
                <div className="row mb-3">
                  <div className="col">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      id="fullName"
                      name="fullName"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={handleChange(setFullName)}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                      required
                      type="date"
                      className="form-control"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={dateOfBirth}
                      onChange={handleChange(setDateOfBirth)}
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
                      name="phoneNumber"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={handleChange(setPhoneNumber)}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="gender">Gender</label>
                    <select
                      required
                      className="form-control"
                      id="gender"
                      name="gender"
                      value={gender}
                      onChange={handleChange(setGender)}
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
                    <label htmlFor="bloodType">Blood Type</label>
                    <input
                      type="text"
                      className="form-control"
                      id="bloodType"
                      name="bloodType"
                      placeholder="Blood Type"
                      value={bloodType}
                      onChange={handleChange(setBloodType)}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="lastCheckupDate">Last Checkup Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="lastCheckupDate"
                      name="lastCheckupDate"
                      value={lastCheckupDate}
                      onChange={handleChange(setLastCheckupDate)}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="mb-3">
                    <label htmlFor="surgicalHistory">Surgical History</label>
                    <textarea
                      className="form-control"
                      id="surgicalHistory"
                      name="surgicalHistory"
                      rows="4"
                      placeholder="Enter any surgical history"
                      value={surgicalHistory}
                      onChange={handleChange(setSurgicalHistory)}
                    ></textarea>
                  </div>
                  <div className="mb-2">
                    <label htmlFor="chronicConditions">
                      Chronic Conditions
                    </label>
                    <textarea
                      className="form-control"
                      id="chronicConditions"
                      name="chronicConditions"
                      rows="4"
                      placeholder="Enter any chronic conditions"
                      value={chronicConditions}
                      onChange={handleChange(setChronicConditions)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="familyMedicalHistory">
                      Family Medical History
                    </label>
                    <textarea
                      className="form-control"
                      id="familyMedicalHistory"
                      name="familyMedicalHistory"
                      rows="4"
                      placeholder="Enter any family medical history"
                      value={familyMedicalHistory}
                      onChange={handleChange(setFamilyMedicalHistory)}
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="col-4 upload-container d-flex align-items-center justify-content-center">
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
            <div className="text-center pb-2">
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
      </div>
    </>
  );
}

export default PatientForm;
