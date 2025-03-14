export const validateEmployee = (name, value) => {
  const errors = {};

  // Validate First Name (letters only, minimum length 3)
  if (name === 'first_name') {
    const firstName = String(value).trim();
    if (!firstName) {
      errors.first_name = "First name is required.";
    } else if (firstName.length < 3) {
      errors.first_name = "First name must be at least 3 characters long.";
    } else if (!/^[A-Za-z]+$/.test(firstName)) {
      errors.first_name = "First name can only contain letters.";
    }
  }

  // Validate Last Name (letters only, minimum length 3)
  if (name === 'last_name') {
    const lastName = String(value).trim();
    if (!lastName) {
      errors.last_name = "Last name is required.";
    } else if (lastName.length < 3) {
      errors.last_name = "Last name must be at least 3 characters long.";
    } else if (!/^[A-Za-z]+$/.test(lastName)) {
      errors.last_name = "Last name can only contain letters.";
    }
  }

  // Validate Email with enhanced domain and TLD checks
  if (name === 'email') {
    const email = String(value).trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const commonDomainTypos = ["gamil.com", "hotnail.com", "yahhoo.com"];
    const validTLDs = [".com", ".net", ".org", ".edu", ".lk"];

    if (!email) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(email)) {
      errors.email = "Please enter a valid email address.";
    } else {
      // Extract domain part
      const domain = email.split("@")[1];

      // Check for common domain typos
      for (let typo of commonDomainTypos) {
        if (domain.includes(typo)) {
          errors.email = `Did you mean "${domain.replace(/gamil|hotnail|yahhoo/, "gmail.com")}"?`;
          break;
        }
      }

      // Check for incomplete or invalid TLDs
      const tld = domain.substring(domain.lastIndexOf("."));
      if (!validTLDs.includes(tld)) {
        errors.email = "Please enter a valid domain (e.g., .com, .net, .org, .edu, .lk).";
      }
    }
  }

  // Validate Mobile Number (10 digits)
  if (name === 'contact_number' || name === 'mobile') {
    const mobileNumber = String(value).trim();
    
    if (!mobileNumber) {
      errors.mobile = "Mobile number is required.";
    } else if (!/^(7\d{8})$/.test(mobileNumber)) {
      errors.mobile = "Mobile number must start with '7' and be exactly 9 digits.";
    }
  
    return errors;
  }
  

  return errors;
};
