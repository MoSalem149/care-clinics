export const validateForm = ({ fullName, email, password, role }) => {
  let validationErrors = {};

  // Full Name validation
  if (!fullName.trim()) {
    validationErrors.fullName = "Full name is required";
  } else if (fullName.length < 3) {
    validationErrors.fullName = "Full name must be at least 3 characters long";
  }

  // Email validation
  const emailRegex = /^[^\s@]+[^.][^\s@]*@[^\s@]+\.[^\s@]+$/i;
  if (!email.trim()) {
    validationErrors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    validationErrors.email = "Invalid email format";
  }

  // Password validation
  if (!password) {
    validationErrors.password = "Password is required";
  } else if (password.length < 6) {
    validationErrors.password = "Password must be at least 6 characters long";
  }

  // Role validation
  if (!role.trim()) {
    validationErrors.role = "Role is required";
  }

  return validationErrors;
};
