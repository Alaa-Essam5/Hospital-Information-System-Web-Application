document.addEventListener("DOMContentLoaded", async function () {
    await fetchDoctorData();
    await fetchPatientsList();
    // إضافة التحقق من وجود الأزرار قبل إضافة الـ event listeners
    const editButton = document.getElementById("edit-button");
    const saveButton = document.getElementById("save-button");
    const cancelButton = document.getElementById("cancel-button");

    if (editButton && saveButton && cancelButton) {
        editButton.addEventListener("click", enableDoctorEditing);
        saveButton.addEventListener("click", updateDoctorProfile);
        cancelButton.addEventListener("click", cancelEditing);
    } else {
        console.error("Buttons not found!");
    }
});

const doctorEmail = localStorage.getItem("userEmail");

async function fetchDoctorData() {
    if (!doctorEmail) {
        console.error("No user email found in localStorage.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/doctor/data?email=${doctorEmail}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const doctor = await response.json();
        document.getElementById("doctor-name").textContent = doctor.name || "";
        document.getElementById("doctor-email").value = doctor.email || "";
        document.getElementById("doctor-phone").value = doctor.phone || "";

        // إصلاح تنسيق تاريخ الميلاد
        document.getElementById("doctor-birthdate").value = doctor.birthDate ? doctor.birthDate.split('T')[0] : "";

        document.getElementById("doctor-expertise").value = doctor.expertiseLevel || "";
    } catch (error) {
        console.error("Error fetching doctor data:", error);
    }
}

async function fetchPatientsList() {
    if (!doctorEmail) return;

    try {
        const response = await fetch(`http://localhost:3000/api/patients?email=${doctorEmail}`);
        if (!response.ok) {
            throw new Error("Failed to fetch patients");
        }

        const patients = await response.json();
        const patientsTable = document.getElementById("doctor-patients");
        patientsTable.innerHTML = "";

        if (patients.length === 0) {
            patientsTable.innerHTML = '<tr><td colspan="3" class="no-data">No patients available.</td></tr>';
            return;
        }

        patients.forEach((patient) => {
            const row = `
                <tr>
                    <td>${patient.name}</td>
                    <td>${patient.age}</td>
                    <td>${patient.phone_number}</td>
                </tr>
            `;
            patientsTable.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching patients:", error);
        document.getElementById("doctor-patients").innerHTML = '<tr><td colspan="3" class="no-data">Failed to load patients.</td></tr>';
    }
}

// تفعيل وضع التعديل:
function enableDoctorEditing() {
    document.getElementById("doctor-email").disabled = false;
    document.getElementById("doctor-phone").disabled = false;
    document.getElementById("doctor-birthdate").disabled = false;
    document.getElementById("doctor-expertise").disabled = true;

    document.getElementById("edit-button").style.display = "none";
    document.getElementById("save-button").style.display = "block";
    document.getElementById("cancel-button").style.display = "inline-block"; // إظهار زر الإلغاء
}
async function updateDoctorProfile() {
    const userId = document.getElementById("doctor-id").value.trim();  // جلب معرّف الطبيب
    const email = document.getElementById("doctor-email").value.trim();
    const phone = document.getElementById("doctor-phone").value.trim();
    const birthdate = document.getElementById("doctor-birthdate").value.trim();
    const expertise = document.getElementById("doctor-expertise").value.trim();

    // التحقق من أن جميع الحقول مليئة
    if (!userId || !email || !phone || !birthdate || !expertise) {
        alert("All fields must be filled!");
        return;
    }

    try {
        // إرسال البيانات باستخدام PUT لتحديث بيانات الطبيب
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
            method: "PUT", // استخدام PUT لتحديث البيانات
            headers: {
                "Content-Type": "application/json"  // تحديد نوع المحتوى
            },
            body: JSON.stringify({
                email,
                phone,  // حقل الهاتف
                birthdate,  // تاريخ الميلاد
                expertise  // مستوى الخبرة
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to update profile");
        }

        // إظهار رسالة نجاح
        alert("Profile updated successfully!");

        // جلب البيانات لتحديث العرض (إذا كنت بحاجة لإعادة تحميل البيانات بعد التحديث)
        fetchDoctorData();

        // إغلاق وضع التحرير
        cancelEditing();

    } catch (error) {
        // التعامل مع الأخطاء
        console.error("Error updating doctor profile:", error);
        alert("Failed to update profile. Please try again later.");
    }
}

// إلغاء التعديل:
function cancelEditing() {
    fetchDoctorData();  // جلب البيانات مرة أخرى بعد الإلغاء

    // إلغاء تمكين الحقول لتصبح غير قابلة للتعديل
    document.getElementById("doctor-email").disabled = true;
    document.getElementById("doctor-phone").disabled = true;
    document.getElementById("doctor-birthdate").disabled = true;
    document.getElementById("doctor-expertise").disabled = true;

    // إظهار زر "تحرير" وإخفاء أزرار "حفظ" و "إلغاء"
    document.getElementById("edit-button").style.display = "none"; // إخفاء زر التعديل
    document.getElementById("save-button").style.display = "block"; // إظهار زر الحفظ
    document.getElementById("cancel-button").style.display = "block"; // إظهار زر الإلغاء

}
