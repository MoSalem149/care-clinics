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

export const submitForm = async (
  newPassword,
  confirmNewPassword,
  setErrorMessage,
  setSuccessMessage,
  token,
  createdBy
) => {
  const validation = validateResetPasswords(newPassword, confirmNewPassword);
  console.log("Validation result:", validation);

  if (!validation.isValid) {
    setErrorMessage(validation.message);
    return { isValid: false, message: validation.message };
  }

  console.log("Validation passed. CreatedBy:", createdBy);
  const url =
    createdBy === "admin"
      ? `http://localhost:5000/doctors/reset-password`
      : `http://localhost:5000/users/reset-password`;

  console.log("URL:", url);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword }),
    });

    console.log("Response Status:", res.status);

    const data = await res.json();
    console.log("Response Data:", data);

    if (!res.ok) {
      setErrorMessage(data.error || "An error occurred.");
      return { isValid: false, message: data.error || "An error occurred." };
    } else {
      setSuccessMessage("Password has been reset successfully!");
      return {
        isValid: true,
        message: "Password has been reset successfully!",
      };
    }
  } catch (error) {
    console.error("Error during password reset:", error);
    setErrorMessage("An error occurred. Please try again.");
    return { isValid: false, message: "An error occurred. Please try again." };
  }
};
