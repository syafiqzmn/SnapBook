    // Demonstration only: customer accounts are saved in this browser using localStorage.
    // This is suitable for a front-end prototype, not for real customer data.
    document.getElementById("registerForm").addEventListener("submit", function(event) {
      event.preventDefault();

      const fullName = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const phone = document.getElementById("phone").value.trim();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const feedback = document.getElementById("feedback");

      feedback.className = "alert d-none";
      feedback.textContent = "";

      if (password !== confirmPassword) {
        showMessage("Passwords do not match. Please check again.", "danger");
        return;
      }

      const customers = JSON.parse(localStorage.getItem("snapbookCustomers") || "[]");
      const usernameExists = customers.some(customer => customer.username.toLowerCase() === username.toLowerCase());
      const emailExists = customers.some(customer => customer.email === email);

      if (usernameExists) {
        showMessage("This username is already registered. Please choose another.", "danger");
        return;
      }

      if (emailExists) {
        showMessage("This email address is already registered.", "danger");
        return;
      }

      customers.push({ fullName, email, phone, username, password });
      localStorage.setItem("snapbookCustomers", JSON.stringify(customers));

      showMessage("Account created successfully! You can now sign in using your new username and password.", "success");
      document.getElementById("registerForm").reset();
    });

    function showMessage(message, type) {
      const feedback = document.getElementById("feedback");
      feedback.className = "alert alert-" + type;
      feedback.textContent = message;
    }
  