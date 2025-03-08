# Hospital-Information-System-Web-Application
This project is a web-based Hospital Information System (HIS) designed for a specific medical department. It provides different functionalities for Admins, Doctors, and Patients to manage hospital records efficiently.

Features

1. Home Page

Navigation Bar (Navbar): A fixed navbar for easy navigation between pages.

Top 3 Doctors Section: Displays static information about three top doctors.

Patient Feedback Section: Patients can write and view feedback.

Footer: Includes contact information and copyright details.

2. Profile Page

Each user has a profile page with relevant functionalities:

Admin:

Add new doctors.

Retire doctors.

Remove patients.

View all doctors and patients in a structured table (Name, Email, Profile Picture, Phone Number, and a Remove Button).

Doctor:

Edit personal details (Birth Date, Email, and Phone Number).

View all patients in a structured table (Patient’s Name, Age, and Phone Number).

Patient:

Edit all personal details except Gender.

View all doctors in a structured table (Doctor’s Name and Phone Number).

Each user has the following attributes:

Name (First + Last), Birth Date, Gender, Email, and Phone Number.

Doctors have an additional field: Level of Expertise.

3. About Page

Displays information about the selected medical department.

Departments available:

Radiology

Cardiology

Ophthalmology

Surgery

Orthopedics

Dental

4. Login Page

Allows Admin, Doctor, and Patient to log in.

Requires Email and Password for authentication.

Basic JavaScript validation to check stored credentials.

5. Signup Page

Allows new patients to sign up.

Requires Name, Birth Date, Gender, Email, Phone Number, and Password.

Uses JavaScript to store and validate user data.

Tools and Technologies

Frontend: HTML, CSS, JavaScript, Bootstrap

Backend: Node.js (or any backend framework based on user preference)

Database: MySQL / Firebase / MongoDB

Authentication: JWT for secure login (optional bonus feature)

Installation

Clone the repository:

git clone https://github.com/your-repo/his-web-app.git

Navigate to the project directory:

cd his-web-app

Install dependencies (if using a backend framework like Node.js):

npm install

Run the application:

npm start

Open your browser and go to http://localhost:3000/.

Usage

Admin Login: Manage doctors and patients.

Doctor Login: Edit profile and view patient details.

Patient Login: Edit profile and view doctor details.

Explore Departments: Read about medical departments on the About Page.

Future Enhancements

Implement real-time patient feedback storage.

Integrate JWT authentication for secure user login.

Enhance UI design with animations and interactive components.

Add an appointment booking feature.

Contributing

Contributions are welcome! To contribute:

Fork the repository.

Submit issues for bugs or feature requests.

Create pull requests with improvements.

License

This project is licensed under the MIT License - see the LICENSE file for details.


