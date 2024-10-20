import React, { useEffect, useState } from "react";
import styles from "./Department.module.css";
import starImg from "../../../src/assets/images/Department-img/stars-img.png";
import mainImg from "../../../src/assets/images/Department-img/main-img.png";
import arrowIcon from "../../../src/assets/images/Department-img/Group.png";
import CreateDepartment from "../Admin-Page/CreateDepartment";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdCreateNewFolder } from "react-icons/md";
import ConfirmationModal from "../Admin-Page/DeleteConfirmation";
import { Link, useNavigate } from "react-router-dom";
import Doctor from "../Doctor-details/Doctor";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("http://localhost:5000/users/departments");
        if (!res.ok) {
          throw new Error("Failed to fetch departments");
        }
        const data = await res.json();

        setDepartments(data);
      } catch (error) {
        // console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);
  const handleEdit = (department) => {
    navigate("/admin/edit-department", { state: { department } });
  };
  const handleDoctors = (department) => {
    navigate("/department/doctors", { state: { department } });
  };
  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setIsModalOpen(true);
  };
  const token =
    localStorage.getItem("token") ||
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  const handleDeleteConfirm = async () => {
    if (departmentToDelete) {
      try {
        const res = await fetch(
          `http://localhost:5000/Admin/departments/${departmentToDelete._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to delete department");
        }

        setDepartments((prevDepartments) =>
          prevDepartments.filter(
            (department) => department._id !== departmentToDelete._id
          )
        );
        setIsModalOpen(false);
        setDepartmentToDelete(null);
      } catch (error) {
        // console.error("Error deleting department:", error);
      }
    }
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setDepartmentToDelete(null);
  };

  return (
    <div className={styles.departmentsContainer}>
      <div className={styles.Departmentcontainer}>
        <h2>Our Departments</h2>
        <h2>
          <img src={starImg} alt="Stars Decoration" />
          <span className={styles.highQualitySpan}>High Quality</span> Services
          for You.
        </h2>
        <img className={styles.mainImg} src={mainImg} alt="Main Decoration" />
        <div className={styles.createDepartmentWrapper}>
          {userRole === "admin" && (
            <Link
              to="/admin/create-department"
              className={styles.createDepartmentButton}
            >
              Create Department
              <MdCreateNewFolder className={styles.createButton} />
            </Link>
          )}
        </div>
        <div className={styles.departmentsCards}>
          {departments.map((department) => (
            <div key={department._id} className={styles.departmentCard}>
              <div className={styles.departmentImageContainer}>
                <img
                  className={styles.departmentImage}
                  src={department.image}
                  alt={department.name}
                />
              </div>
              {userRole === "admin" && (
                <div className={styles.adminIcons}>
                  <FaEdit
                    className={styles.icon}
                    onClick={() => handleEdit(department)}
                  />
                  <MdDelete
                    className={styles.icon}
                    onClick={() => handleDeleteClick(department)}
                  />
                </div>
              )}
              <h4>{department.name}</h4>
              <p>{department.bio}</p>
              <button
                onClick={() => handleDoctors(department)}
                className={styles.BooksBtn}
              >
                Book Appointment
                <img className={styles.arr} src={arrowIcon} alt="Arrow Icon" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        departmentName={departmentToDelete?.name}
        onClose={handleModalClose}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
export default Department;
