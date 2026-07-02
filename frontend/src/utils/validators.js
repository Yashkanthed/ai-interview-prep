export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isStrongPassword = (password) =>
  // At least 8 chars, one letter, one number
  /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);

export const validateRegisterForm = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (!isStrongPassword(password))
    errors.password = 'Password must be 8+ characters with letters and numbers';
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  if (!isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  return errors;
};
