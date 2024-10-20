import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./CSS/EditDepartment.module.css";

const EditComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { department } = location.state;
  const [updatedDepartment, setUpdatedDepartment] = useState({
    name: department.name,
    bio: department.bio,
    profileImage: department.profileImage,
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUpdatedDepartment((prev) => ({ ...prev, profileImage: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", updatedDepartment.name);
    formData.append("bio", updatedDepartment.bio);

    if (updatedDepartment.profileImage) {
      formData.append("profileImage", updatedDepartment.profileImage);
    }

    const token =
      localStorage.getItem("token") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
      // console.error("No auth token found");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/Admin/departments/${department._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        // console.error("Response data:", data);
        throw new Error(data.message || "Failed to update department");
      }

      setSuccessMessage("Department updated successfully!");
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (error) {
      // console.error("Error updating department:", error.message);
    }
  };
  return (
    <form onSubmit={handleSubmit} className={styles["EditDepartment-form"]}>
      <h2 className={styles["EditDepartment-h2"]}>Update Department</h2>
      {successMessage && (
        <p className={styles["EditDepartment-successMessage"]}>
          {successMessage}
        </p>
      )}
      <input
        type="text"
        name="name"
        value={updatedDepartment.name}
        onChange={handleInputChange}
        placeholder="Department Name"
        required
        className={styles["EditDepartment-input"]}
      />
      <textarea
        name="bio"
        value={updatedDepartment.bio}
        onChange={handleInputChange}
        placeholder="Department Bio"
        required
        className={styles["EditDepartment-textarea"]}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles["EditDepartment-inputFile"]}
      />
      <button type="submit" className={styles["EditDepartment-button"]}>
        Update Department
      </button>
    </form>
  );
};

export default EditComponent;
