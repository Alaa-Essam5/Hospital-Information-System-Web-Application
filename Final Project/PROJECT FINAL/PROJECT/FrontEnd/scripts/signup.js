document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");
    const errorMsg = document.getElementById("signup-error");
  
    signupForm.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const formData = {
        first_name: document.getElementById("signup-first-name").value.trim(),
        last_name: document.getElementById("signup-last-name").value.trim(),
        birth_date: document.getElementById("signup-birth-date").value.trim(),
        gender: document.getElementById("signup-gender").value.trim(),
        email: document.getElementById("signup-email").value.trim(),
        phone_number: document.getElementById("signup-phone-number").value.trim(),
        password: document.getElementById("signup-password").value.trim(),
        role: document.getElementById("signup-role").value.trim(),
      };
  
      try {
        const response = await fetch("http://localhost:3000/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Signup failed!");
        }
  
        alert("User created successfully! Please login.");
        window.location.href = "login.html";
      } catch (error) {
        console.error("Signup Error:", error);
        errorMsg.textContent = error.message || "Signup failed! Please try again.";
      }
    });
  });