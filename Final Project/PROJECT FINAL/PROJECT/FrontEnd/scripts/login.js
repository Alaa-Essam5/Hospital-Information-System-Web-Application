document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const errorMsg = document.getElementById("login-error");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
      errorMsg.textContent = "Email and password are required!";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed!");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Save user data to localStorage
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userEmail", email); // Store the logged-in user's email

      // Redirect based on role
      switch (data.role) {
        case "Admin":
          window.location.href = "home-admin.html";
          break;
        case "Doctor":
          window.location.href = "home-doctor.html";
          break;
        case "Patient":
          window.location.href = "home-patient.html";
          break;
        default:
          errorMsg.textContent = "Unknown user role!";
      }
    } catch (error) {
      console.error("Login Error:", error);
      errorMsg.textContent = error.message || "Login failed! Please try again.";
    }
  });
});