// src/components/ConfirmationModal.js
import React from "react";
import styles from "./CSS/DeleteConfirmation.module.css";

const ConfirmationModal = ({ isOpen, departmentName, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Are you sure you want to delete {departmentName}?</h3>
        <div className={styles.modalButtons}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Yes
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
