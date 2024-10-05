/* Reset Password Form Validation */
export const validateResetPasswords = (newPassword, confirmNewPassword) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (!passwordRegex.test(newPassword)) {
    return {
      isValid: false,
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    };
  }

  if (newPassword !== confirmNewPassword) {
    return { isValid: false, message: "Passwords do not match." };
  }

  return { isValid: true, message: "Password is valid!" };
};

/* Function to handle form submission */

export const submitForm = async (
  newPassword,
  confirmNewPassword,
  setErrorMessage,
  setSuccessMessage,
  token
) => {
  const validation = validateResetPasswords(newPassword, confirmNewPassword);

  if (!validation.isValid) {
    setErrorMessage(validation.message);
    return false;
  }

  // Proceed with the fetch request
  try {
    const res = await fetch(`http://localhost:5000/doctors/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMessage(data.error || "An error occurred.");
      return false;
    } else {
      setSuccessMessage("Password has been reset successfully!");
      return true;
    }
  } catch (error) {
    console.error("Error during password reset:", error);
    setErrorMessage("An error occurred. Please try again.");
    return false;
  }
};
