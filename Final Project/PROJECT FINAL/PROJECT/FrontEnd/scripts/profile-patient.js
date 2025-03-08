document.addEventListener("DOMContentLoaded", async function () {
    await fetchPatientData();
    await fetchDoctorsList();
  });
  
  const patientEmail = localStorage.getItem("userEmail"); // Get the logged-in patient's email
  console.log("Logged-in patient email:", patientEmail); // Debugging: Check the email
  
  // Fetch patient data from the API
  async function fetchPatientData() {
    if (!patientEmail) {
      console.error("No logged-in user email found.");
      document.getElementById("patient-section").innerHTML = "<p>Failed to load patient data. Please log in.</p>";
      return;
    }
  
    try {
      console.log("Fetching patient data for email:", patientEmail); // Debugging
      const response = await fetch(`http://localhost:3000/api/patient/data?email=${patientEmail}`);
      if (!response.ok) {
        throw new Error("Failed to fetch patient data");
      }
      const patient = await response.json();
      console.log("Patient data received:", patient); // Debugging
  
      // Populate patient details in the form
      document.getElementById("patient-name").textContent = patient.name;
      document.getElementById("patient-email").value = patient.email;
      document.getElementById("patient-phone").value = patient.phone_number; // Updated field name
      document.getElementById("patient-gender").textContent = patient.gender;
      document.getElementById("patient-image").src = patient.image || "patient.jpg";
    } catch (error) {
      console.error("Error fetching patient data:", error);
      document.getElementById("patient-section").innerHTML = "<p>Failed to load patient data.</p>";
    }
  }
  
  // Fetch the list of doctors from the API
  async function fetchDoctorsList() {
    try {
      const response = await fetch(`http://localhost:3000/api/doctors?email=${patientEmail}`);
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }
      const doctors = await response.json();
  
      const doctorsTable = document.getElementById("patient-doctors");
      doctorsTable.innerHTML = "";
  
      if (doctors.length === 0) {
        doctorsTable.innerHTML = '<tr><td colspan="2" class="no-data">No doctors available.</td></tr>';
        return;
      }
  
      doctors.forEach((doctor) => {
        const row = `
          <tr>
            <td>${doctor.name}</td>
            <td>${doctor.phone_number}</td> <!-- Updated field name -->
          </tr>
        `;
        doctorsTable.innerHTML += row;
      });
    } catch (error) {
      console.error("Error fetching doctors:", error);
      document.getElementById("patient-doctors").innerHTML = '<tr><td colspan="2" class="no-data">Failed to load doctors.</td></tr>';
    }
  }
  
  // Enable editing of patient profile
  function enablePatientEditing() {
    document.getElementById("patient-email").disabled = false;
    document.getElementById("patient-phone").disabled = false;
    document.getElementById("edit-button").style.display = "none";
    document.getElementById("save-button").style.display = "block";
  }
  
  // Update patient profile via API
  async function updatePatientProfile() {
    const email = document.getElementById("patient-email").value;
    const phone = document.getElementById("patient-phone").value;

    try {
      const response = await fetch("http://localhost:3000/api/updatePatient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully!");
      document.getElementById("patient-email").disabled = true;
      document.getElementById("patient-phone").disabled = true;
      document.getElementById("edit-button").style.display = "block";
      document.getElementById("save-button").style.display = "none";
    } catch (error) {
      console.error("Error updating patient profile:", error);
      alert("Failed to update profile. Please try again later.");
    }
  }