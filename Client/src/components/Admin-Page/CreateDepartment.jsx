import React, { useState } from "react";
import styles from "./CSS/CreateDepartment.module.css";
import { useNavigate } from "react-router-dom";

const CreateDepartment = () => {
  const navigate = useNavigate();
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    bio: "",
    image: null,
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewDepartment((prev) => ({ ...prev, profileImage: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newDepartment.name);
    formData.append("bio", newDepartment.bio);
    formData.append("profileImage", newDepartment.profileImage);
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
      const res = await fetch("http://localhost:5000/Admin/departments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create department");
      }
      setSuccessMessage("Department created successfully!");
      setNewDepartment({ name: "", bio: "", image: null });
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (error) {
      // console.error("Error creating department:", error.message);
    }
  };

  return (
    <div className={styles.createDepartmentContainer}>
      <h2>Create New Department</h2>
      <form onSubmit={handleSubmit} className={styles.departmentForm}>
        <input
          type="text"
          name="name"
          placeholder="Department Name"
          value={newDepartment.name}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="bio"
          placeholder="Department Bio"
          value={newDepartment.bio}
          onChange={handleInputChange}
          required
        />
        <input
          type="file"
          name="image"
          placeholder="Upload Image"
          onChange={handleFileChange}
        />
        <button type="submit">Create Department</button>
      </form>
      {successMessage && (
        <h1 className={styles.successMessage}>{successMessage}</h1>
      )}
    </div>
  );
};

export default CreateDepartment;
