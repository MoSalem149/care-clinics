/* Reset Password Form Validation */
export const validateResetPasswords = (newPassword, confirmNewPassword) => {
  if (newPassword.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long.",
    };
  }

  if (newPassword !== confirmNewPassword) {
    return { isValid: false, message: "Passwords do not match." };
  }

  return { isValid: true, message: "Password is valid!" };
};

/* Function to handle form submission */
export const submitForm = (
  newPassword,
  confirmNewPassword,
  setErrorMessage,
  setSuccessMessage
) => {
  const validation = validateResetPasswords(newPassword, confirmNewPassword);

  if (!validation.isValid) {
    setErrorMessage(validation.message);
    return false;
  }

  setSuccessMessage("Password has been reset successfully!");
  return true;
};
