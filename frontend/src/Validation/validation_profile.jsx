export const validateProfile = (field, value) => {
  const errors = {};

  // Validation logic for required fields
  if (field === "firstName") {
    if (!value) {
      errors.firstName = "First name is required.";
    } else if (value.length < 3) {
      errors.firstName = "First name must be at least 3 characters long.";
    }
  }

  if (field === "lastName") {
    if (!value) {
      errors.lastName = "Last name is required.";
    } else if (value.length < 3) {
      errors.lastName = "Last name must be at least 3 characters long.";
    }
  }

  if (field === "email") {
    // Enhanced email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const commonDomainTypos = ["gamil.com", "hotnail.com", "yahhoo.com"];
    const validTLDs = [".com", ".net", ".org", ".edu", ".lk"];

    if (!value) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(value)) {
      errors.email = "Please enter a valid email address.";
    } else {
      // Check for common domain typos
      const domain = value.split("@")[1];
      for (let typo of commonDomainTypos) {
        if (domain.includes(typo)) {
          errors.email = `Did you mean "${domain.replace(
            /gamil|hotnail|yahhoo/,
            "gmail.com"
          )}"?`;
          break;
        }
      }

      // Check for incomplete TLDs (e.g., ".c")
      const tld = domain.substring(domain.lastIndexOf("."));
      if (!validTLDs.includes(tld)) {
        errors.email =
          "Please enter a complete domain (e.g., .com, .net, .org, .edu, .lk)";
      }
    }
  }

  // Validation logic for optional fields (validate only if they contain a value)
  if (field === "mobileNumber" && value) {
    const mobileNumber = String(value).trim();

    if (!/^(7\d{8})$/.test(mobileNumber)) {
      errors.mobileNumber =
        "Mobile number must start with '7' and be exactly 9 digits.";
    }
  }

  if (field === "postalCode" && value && !/^\d{3,5}$/.test(value)) {
    errors.postalCode = "Postal code must be between 3 and 5 digits.";
  }

  if (field === "address" && value && value.length < 10) {
    errors.address = "Address must be at least 10 characters.";
  }

  return errors;
};
