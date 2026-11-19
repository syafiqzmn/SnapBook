    let selectedRole = "customer";

    // Select Customer or Admin
    function selectRole(role) {

      selectedRole = role;

      document.getElementById("customerTab")
        .classList.toggle("active", role === "customer");

      document.getElementById("adminTab")
        .classList.toggle("active", role === "admin");

    }

    // Show / Hide Password
    function togglePassword() {

      const password = document.getElementById("password");
      const icon = document.getElementById("passwordIcon");

      if (password.type === "password") {

        password.type = "text";
        icon.className = "fa-regular fa-eye-slash";

      } else {

        password.type = "password";
        icon.className = "fa-regular fa-eye";

      }

    }

    // Protect About and Portfolio: customer must log in first.
    function openProtectedSection(section) {
      const currentUser = localStorage.getItem("snapbookCurrentUser");

      if (currentUser) {
        window.location.href = "customer-dashboard.html#" + section;
        return false;
      }

      showPopup(
        "error",
        "Login Required",
        "Please log in as a customer first to view " + (section === "packages" ? "the Portfolio" : "the About section") + "."
      );

      setTimeout(function() {
        closePopup();
        document.getElementById("username").focus();
      }, 2200);

      return false;
    }

    // Popup Notification
    function showPopup(type, title, message) {

      const overlay = document.getElementById("popupOverlay");
      const card = document.getElementById("popupCard");
      const icon = document.getElementById("popupIcon");

      card.className = "popup-card " + type;

      if (type === "success") {
        icon.innerHTML = '<i class="fa-solid fa-check"></i>';
      } else {
        icon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      }

      document.getElementById("popupTitle").textContent = title;
      document.getElementById("popupMessage").textContent = message;

      overlay.classList.add("show");

    }

    function closePopup() {
      document.getElementById("popupOverlay").classList.remove("show");
    }

    // LOGIN SYSTEM
    document.getElementById("loginForm").addEventListener("submit", function(event) {

      event.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;

      let validLogin = false;

      if (selectedRole === "customer") {

        // Demo Customer accounts
        if (username === "customer1" && password === "12345") {
          validLogin = true;
        }

        // Check registered Customer accounts
        const customers = JSON.parse(
          localStorage.getItem("snapbookCustomers") || "[]"
        );

        const registeredCustomer = customers.find(customer =>
          customer.username === username &&
          customer.password === password
        );

        if (registeredCustomer) {
          validLogin = true;
        }

      } else {

        // Admin account
        if (username === "admin" && password === "admin123") {
          validLogin = true;
        }

      }

      if (validLogin) {

        if (selectedRole === "customer") {

          localStorage.setItem("snapbookCurrentUser", username);

          showPopup(
            "success",
            "Login Successful!",
            "Welcome back, " + username + "! Entering Customer Dashboard..."
          );

          setTimeout(function() {
            window.location.href = "customer-dashboard.html";
          }, 1500);

        } else {

          showPopup(
            "success",
            "Admin Login Successful!",
            "Welcome, Admin! Entering Admin Dashboard..."
          );

          setTimeout(function() {
            window.location.href = "admin-dashboard.html";
          }, 1500);

        }

      } else {

        showPopup(
          "error",
          "Login Failed!",
          "Invalid username or password. Please try again."
        );

        setTimeout(function() {
          closePopup();
        }, 2000);

      }

    });

  