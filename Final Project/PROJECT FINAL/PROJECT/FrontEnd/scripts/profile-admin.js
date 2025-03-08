document.addEventListener("DOMContentLoaded", async function () {
    await fetchAdminData();
    await fetchDoctors();
    await fetchPatients();
});
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("add-doctor-form");
    form.addEventListener("submit", addDoctor);
});

async function addDoctor(event) {
    event.preventDefault(); // Prevent form refresh

    const name = document.getElementById("doctor-name").value;
    const email = document.getElementById("doctor-email").value;
    const phone = document.getElementById("doctor-phone").value;
    const specialty = document.getElementById("doctor-specialty").value;
    const experience = document.getElementById("doctor-experience").value;
    const birthDate = document.getElementById("doctor-birth-date").value;
    const gender = document.getElementById("doctor-gender").value;
    const password = document.getElementById("doctor-password").value;

    if (!name || !email || !phone || !specialty || !experience || !birthDate || !gender || !password) {
        document.getElementById("form-message").textContent = "All fields are required!";
        return;
    }

    const [first_name, ...last_name_arr] = name.split(" ");
    const last_name = last_name_arr.join(" ") || "N/A"; // Handle cases where only one name is entered

    const doctorData = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone_number: phone,
        level_of_expertise: specialty,
        years_of_experience: experience,
        birth_date: birthDate,
        gender: gender,
        password: password
    };

    try {
        const response = await fetch(`http://localhost:3000/api/users?email=${localStorage.getItem("userEmail")}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(doctorData)
        });

        if (!response.ok) {
            throw new Error("Failed to add doctor");
        }

        document.getElementById("form-message").textContent = "Doctor added successfully!";
        document.getElementById("form-message").style.color = "green";

        document.getElementById("add-doctor-form").reset(); // Clear form
    } catch (error) {
        console.error("Error adding doctor:", error);
        document.getElementById("form-message").textContent = "Failed to add doctor.";
        document.getElementById("form-message").style.color = "red";
    }
}
const adminEmail = localStorage.getItem("userEmail");

// Fetch admin data from the API
async function fetchAdminData() {
    if (!adminEmail) {
        console.error("No logged-in user email found.");
        document.getElementById("admin-info").innerHTML = "<p>Failed to load admin data. Please log in.</p>";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/admin/data?email=${adminEmail}`);
        if (!response.ok) {
            throw new Error("Failed to fetch admin data");
        }
        const admin = await response.json();
        const adminInfo = document.getElementById("admin-info");
        adminInfo.innerHTML = `
            <img src="default.jpg" alt="Admin Image">
            <h2>${admin.name}</h2>
            <p>Email: ${admin.email}</p>
            <p>Phone: ${admin.phone}</p>
        `;
    } catch (error) {
        console.error("Error fetching admin data:", error);
        document.getElementById("admin-info").innerHTML = "<p>Failed to load admin data.</p>";
    }
}

// Fetch all doctors from the API
async function fetchDoctors() {
    try {
        const response = await fetch(`http://localhost:3000/api/doctors?email=${adminEmail}`);
        if (!response.ok) {
            throw new Error("Failed to fetch doctors");
        }
        const doctors = await response.json();

        const doctorsTable = document.getElementById("doctors-list");
        doctorsTable.innerHTML = "";

        if (doctors.length === 0) {
            doctorsTable.innerHTML = '<tr><td colspan="4" class="no-data">No doctors available.</td></tr>';
            return;
        }

        doctors.forEach((doctor) => {
            const row = `
                <tr>
                    <td><img src="default.jpg" width="50" height="50" style="border-radius: 50%;"></td>
                    <td>${doctor.name}</td>
                    <td>${doctor.phone_number}</td>
                    <td>${doctor.email}</td>
                    <td>
                        <button class="edit-btn" onclick="window.location.href='edit-doctor.html?id=${doctor._id}'">Edit</button>
                        <button class="delete-btn" onclick="deleteUser('${doctor._id}')">Delete</button>
                    </td>
                </tr>
            `;
            doctorsTable.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        document.getElementById("doctors-list").innerHTML = '<tr><td colspan="4" class="no-data">Failed to load doctors.</td></tr>';
    }
}

// Fetch all patients from the API
async function fetchPatients() {
    try {
        const response = await fetch(`http://localhost:3000/api/patients?email=${adminEmail}`);
        if (!response.ok) {
            throw new Error("Failed to fetch patients");
        }
        const patients = await response.json();

        const patientsTable = document.getElementById("patients-list");
        patientsTable.innerHTML = "";

        if (patients.length === 0) {
            patientsTable.innerHTML = '<tr><td colspan="5" class="no-data">No patients available.</td></tr>';
            return;
        }

        patients.forEach((patient) => {
            const row = `
                <tr>
                    <td><img src="default.jpg" width="50" height="50" style="border-radius: 50%;"></td>
                    <td>${patient.name}</td>
                    <td>${patient.age}</td>
                    <td>${patient.phone_number}</td>
                    <td>${patient.email}</td>
                    <td>
                        <button class="edit-btn" onclick="editUser('${patient._id}')">Edit</button>
                        <button class="delete-btn" onclick="deleteUser('${patient._id}')">Delete</button>
                    </td>
                </tr>
            `;
            patientsTable.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching patients:", error);
        document.getElementById("patients-list").innerHTML = '<tr><td colspan="5" class="no-data">Failed to load patients.</td></tr>';
    }
}

// Add a new user (doctor or patient)
function addUser(role) {
    if (role === "Doctor") {
        // Redirect to a form or modal to add a new doctor
        alert("Feature to add a new doctor will be implemented.");
    } else if (role === "Patient") {
        // Redirect to a form or modal to add a new patient
        alert("Feature to add a new patient will be implemented.");
    }
}

// Edit a user
function editUser(userId) {
    alert(`Editing user with ID: ${userId}`);
    // Redirect to a form or modal to edit the user
}

// Delete a user
async function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete user");
            }
            alert("User deleted successfully!");
            await fetchDoctors(); // Refresh the doctors list
            await fetchPatients(); // Refresh the patients list
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    }
}

// Delete all users (doctors or patients)
async function deleteAllUsers(role) {
    if (confirm(`Are you sure you want to delete all ${role}s?`)) {
        try {
            const response = await fetch(`http://localhost:3000/api/users/deleteAll/${role}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error(`Failed to delete all ${role}s`);
            }
            alert(`All ${role}s deleted successfully!`);
            if (role === "doctor") {
                await fetchDoctors(); // Refresh the doctors list
            } else if (role === "patient") {
                await fetchPatients(); // Refresh the patients list
            }
        } catch (error) {
            console.error(`Error deleting all ${role}s:`, error);
            alert(`Failed to delete all ${role}s.`);
        }
    }
}