/* =========================================================
   contact.js  -  COS106 Web Technologies Practical
   Contact form validation - ALL validation logic lives here.
   Rules:
     - No field may be empty
     - Email must match a standard pattern
     - Phone must contain only digits (7-15 digits)
     - Inline error messages shown next to each field
     - Submission is prevented when any field is invalid
     - A success message is shown after valid submission
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* --------------------------------------------------
     DOM REFERENCES
  -------------------------------------------------- */
  const form       = document.getElementById("contactForm");
  const successMsg = document.getElementById("successMsg");

  /* Individual input fields */
  const fields = {
    name:    document.getElementById("name"),
    email:   document.getElementById("email"),
    phone:   document.getElementById("phone"),
    subject: document.getElementById("subject"),
    message: document.getElementById("message")
  };

  /* --------------------------------------------------
     HELPER - show or clear the error state on a field group
  -------------------------------------------------- */
  function setError(fieldName, hasError) {
    const group = document.getElementById("grp-" + fieldName);
    if (!group) return;
    if (hasError) {
      group.classList.add("invalid");
    } else {
      group.classList.remove("invalid");
    }
  }

  /* --------------------------------------------------
     INDIVIDUAL VALIDATORS
     Each function validates one field and returns true/false.
  -------------------------------------------------- */

  function validateName() {
    const val = fields.name.value.trim();
    const ok  = val.length >= 2;
    setError("name", !ok);
    return ok;
  }

  function validateEmail() {
    const val = fields.email.value.trim();
    /* Practical email regex: requires local@domain.tld */
    const re  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ok  = re.test(val);
    setError("email", !ok);
    return ok;
  }

  function validatePhone() {
    const val = fields.phone.value.trim();
    /* Digits only, between 7 and 15 characters */
    const re  = /^\d{7,15}$/;
    const ok  = re.test(val);
    setError("phone", !ok);
    return ok;
  }

  function validateSubject() {
    const val = fields.subject.value.trim();
    const ok  = val.length > 0;
    setError("subject", !ok);
    return ok;
  }

  function validateMessage() {
    const val = fields.message.value.trim();
    const ok  = val.length >= 10;
    setError("message", !ok);
    return ok;
  }

  /* --------------------------------------------------
     REAL-TIME VALIDATION
     Validate on blur so the user sees errors when
     they leave a field, and clear errors as they type.
  -------------------------------------------------- */
  fields.name.addEventListener("blur",    validateName);
  fields.email.addEventListener("blur",   validateEmail);
  fields.phone.addEventListener("blur",   validatePhone);
  fields.subject.addEventListener("blur", validateSubject);
  fields.message.addEventListener("blur", validateMessage);

  /* Clear the error styling as the user types into any field */
  Object.keys(fields).forEach((key) => {
    fields[key].addEventListener("input", () => setError(key, false));
  });

  /* --------------------------------------------------
     FORM SUBMIT HANDLER
     Runs all validators; blocks submission if any fail.
  -------------------------------------------------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    /* Run all validators and collect results */
    const results = [
      validateName(),
      validateEmail(),
      validatePhone(),
      validateSubject(),
      validateMessage()
    ];

    const allValid = results.every(Boolean);

    if (!allValid) {
      /* Focus the first invalid field to help the user */
      const firstInvalid = form.querySelector(
        ".form-group.invalid input, .form-group.invalid textarea"
      );
      if (firstInvalid) firstInvalid.focus();
      return; /* stop submission */
    }

    /* All fields are valid - show success message and reset form */
    successMsg.classList.add("show");
    form.reset();

    /* Auto-hide the success message after 6 seconds */
    setTimeout(() => {
      successMsg.classList.remove("show");
    }, 6000);
  });

}); /* end DOMContentLoaded */
