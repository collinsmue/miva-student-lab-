document.addEventListener("DOMContentLoaded", () => {

  const form       = document.getElementById("contactForm");
  const successMsg = document.getElementById("successMsg");

  const fields = {
    name:    document.getElementById("name"),
    email:   document.getElementById("email"),
    phone:   document.getElementById("phone"),
    subject: document.getElementById("subject"),
    message: document.getElementById("message")
  };

  function setError(fieldName, hasError) {
    const group = document.getElementById("grp-" + fieldName);
    if (!group) return;
    if (hasError) {
      group.classList.add("invalid");
    } else {
      group.classList.remove("invalid");
    }
  }

  function validateName() {
    const val = fields.name.value.trim();
    const ok  = val.length >= 2;
    setError("name", !ok);
    return ok;
  }

  function validateEmail() {
    const val = fields.email.value.trim();
    const re  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ok  = re.test(val);
    setError("email", !ok);
    return ok;
  }

  function validatePhone() {
    const val = fields.phone.value.trim();
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

  // Validate on blur, clear on input
  fields.name.addEventListener("blur",    validateName);
  fields.email.addEventListener("blur",   validateEmail);
  fields.phone.addEventListener("blur",   validatePhone);
  fields.subject.addEventListener("blur", validateSubject);
  fields.message.addEventListener("blur", validateMessage);

  Object.keys(fields).forEach((key) => {
    fields[key].addEventListener("input", () => setError(key, false));
  });

  // Handle form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const results = [
      validateName(),
      validateEmail(),
      validatePhone(),
      validateSubject(),
      validateMessage()
    ];

    const allValid = results.every(Boolean);

    if (!allValid) {
      const firstInvalid = form.querySelector(
        ".form-group.invalid input, .form-group.invalid textarea"
      );
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    successMsg.classList.add("show");
    form.reset();

    setTimeout(() => {
      successMsg.classList.remove("show");
    }, 6000);
  });

});
