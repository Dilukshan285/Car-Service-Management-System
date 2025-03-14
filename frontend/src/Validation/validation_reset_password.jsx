// validation_reset_password.js

// Password validation pattern (At least 8 characters, including a number, symbol, capital, and small letter)
const passwordPattern =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

// Function to validate the password according to the pattern
export const validatePassword = (password) => {
  if (!passwordPattern.test(password)) {
    return "Please enter at least 8 characters with a number, symbol, capital, and small letter.";
  }
  return "";
};

// Function to check if passwords match
export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return "Passwords do not match!";
  }
  return "";
};
