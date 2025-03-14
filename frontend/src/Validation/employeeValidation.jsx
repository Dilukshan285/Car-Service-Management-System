export const validateEmployee = (field, value) => {
  const errors = {};

  switch (field) {
    case "first_name":
      if (!value.trim()) {
        errors.first_name = "First name is required.";
      } else if (value.trim().length < 3) {
        errors.first_name = "First name must be at least 3 characters long.";
      }
      break;

    case "last_name":
      if (!value.trim()) {
        errors.last_name = "Last name is required.";
      } else if (value.trim().length < 3) {
        errors.last_name = "Last name must be at least 3 characters long.";
      }
      break;

    case "email":
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const commonDomainTypos = {
        "gamil.com": "gmail.com",
        "hotnail.com": "hotmail.com",
        "yahhoo.com": "yahoo.com"
      };
      const validTLDs = [".com", ".net", ".org", ".edu", ".lk"];

      if (!value.trim()) {
        errors.email = "Email is required.";
      } else if (!emailPattern.test(value)) {
        errors.email = "Please enter a valid email address.";
      } else {
        const [, domain] = value.split("@");
        const typo = Object.keys(commonDomainTypos).find(typo => domain === typo);
        
        if (typo) {
          errors.email = `Did you mean "${value.replace(typo, commonDomainTypos[typo])}"?`;
        } else {
          const tld = domain.substring(domain.lastIndexOf("."));
          if (!validTLDs.includes(tld)) {
            errors.email = "Please enter a valid domain (e.g., .com, .net).";
          }
        }
      }
      break;

    case "mobile":
      if (!value.trim()) {
        errors.mobile = "Contact number is required.";
      } else if (!/^\d{9,12}$/.test(value.replace(/\D/g, ''))) {
        errors.mobile = "Contact number must be between 9 and 12 digits.";
      }
      break;

    case "role":
      if (!value) {
        errors.role = "Role is required.";
      }
      break;

    default:
      break;
  }

  return errors;
};