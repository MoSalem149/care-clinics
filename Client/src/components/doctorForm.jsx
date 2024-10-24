import { useRef, useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";
/* Import CSS */
import "../styles/doctorForm.css";
function DoctorForm() {
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

  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [photo, setPhoto] = useState(null);
  const [fees, setFees] = useState("");
  const [department, setDepartment] = useState(""); // New state for department

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
      name,
      age,
      gender,
      phoneNumber,
      specialty,
      yearsOfExperience,
      fees: { consultation: fees },
      department,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/doctors/compelete-profile",
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
      } else {
        console.log(department);
        console.log(token);
        
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
          <div className="welcome-patient text-center mb-4">
            <h2 className="hello">
              <span className="hello-doc">Hello</span> Doc!
            </h2>
            <h5>Please complete your information</h5>
          </div>
          <div className="col-8 p-form-container d-flex align-items-center justify-content-center">
            <div>
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
                      name="name"
                      placeholder="Full Name"
                      value={name}
                      onChange={handleChange(setName)}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="age">Age</label>
                    <input
                      type="number"
                      className="form-control"
                      id="age"
                      name="age"
                      placeholder="Age"
                      value={age}
                      onChange={handleChange(setAge)}
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
                    <label htmlFor="specialty">Specialty</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      id="specialty"
                      name="specialty"
                      placeholder="Specialty"
                      value={specialty}
                      onChange={handleChange(setSpecialty)}
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="yearsOfExperience">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      placeholder="Years of Experience"
                      value={yearsOfExperience}
                      onChange={handleChange(setYearsOfExperience)}
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
                      name="fees"
                      placeholder="Consultation Fees"
                      value={fees}
                      onChange={handleChange(setFees)}
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
                      name="department"
                      value={department}
                      onChange={handleChange(setDepartment)}
                    >
                      <option value="">Select Department</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Internal Medicine">
                        Internal Medicine
                      </option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="General Dental Care">
                        General Dental Care
                      </option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
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
    </>
  );
}

export default DoctorForm;
