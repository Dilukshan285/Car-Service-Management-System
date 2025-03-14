export const validateForm = (name, value) => {
  switch (name) {
    case "email":
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const commonDomainTypos = ["gamil.com", "hotnail.com", "yahhoo.com"];
      const validTLDs = [".com", ".net", ".org", ".edu", "lk"];

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
          return `Did you mean "${domain.replace(/gamil|hotnail|yahhoo/, "gmail.com")}"?`;
        }
      }

      // Check for incomplete TLDs (e.g., ".c")
      const tld = domain.substring(domain.lastIndexOf("."));
      if (!validTLDs.includes(tld)) {
        return "Please enter a complete domain (e.g., .com, .net, .org, .edu, .lk)";
      }

      return ""; // If all checks pass

    case "password":
      if (!value) {
        return "Password is required";
      }
      return '';

    default:
      return '';
  }
};
