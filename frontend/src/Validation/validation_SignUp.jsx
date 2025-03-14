// validation_SignUp.js

export const validateForm = (name, value) => {
  switch (name) {
    case "firstName":
      if (!value) {
        return "First name is required";
      } else if (value.length < 3) {
        return "First name must be at least 3 characters long.";
      }
      return "";
    case "lastName":
      if (!value) {
        return "Last name is required";
      } else if (value.length < 3) {
        return "Last name must be at least 3 characters long.";
      }
      return "";
    case "email":
      // General email pattern for most email addresses
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const commonDomainTypos = ["gamil.com", "hotnail.com", "yahhoo.com"];
      const validTLDs = [".com", ".net", ".org", ".edu", ".lk"];

      if (!value) {
        return "Email is required";
      }

      if (!emailPattern.test(value)) {
        return "Please enter a valid email address";
      }

      // Check for common domain typos
      const domain = value.split("@")[1];
      for (let typo of commonDomainTypos) {
        if (domain.includes(typo)) {
          return `Did you mean "${domain.replace(/gamil|hotnail|yahhoo/, 'gmail.com')}"?`;
        }
      }

      // Check for incomplete TLDs (e.g., ".c")
      const tld = domain.substring(domain.lastIndexOf("."));
      if (!validTLDs.includes(tld)) {
        return "Please enter a complete domain (e.g., .com, .net, .org, .edu, .lk)";
      }

      return "";
    case "password":
      if (!value) {
        return "Password is required";
      }
      // Password validation for at least 8 characters with numbers, symbols, capital, and small letters
      const passwordPattern =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      if (!passwordPattern.test(value)) {
        return "Please enter at least 8 characters with a number, symbol, capital, and small letter";
      }
      return "";
    case "password1":
      if (!value) {
        return "Password is required";
      }
      return "";
    default:
      return "";
  }
};
