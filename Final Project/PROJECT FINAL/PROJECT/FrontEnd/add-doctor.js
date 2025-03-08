document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("add-doctor-form");
    const message = document.getElementById("form-message");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // منع إعادة تحميل الصفحة

        // الحصول على القيم المدخلة
        const doctorName = document.getElementById("doctor-name");
        const doctorEmail = document.getElementById("doctor-email");
        const doctorPhone = document.getElementById("doctor-phone");
        const doctorSpecialty = document.getElementById("doctor-specialty");
        const doctorExperience = document.getElementById("doctor-experience");
        const doctorBirthDate = document.getElementById("doctor-birth-date");
        const doctorGender = document.getElementById("doctor-gender");
        const doctorPassword = document.getElementById("doctor-password");

        // تحقق من وجود جميع الحقول
        if (
            doctorName && doctorEmail && doctorPhone && doctorSpecialty &&
            doctorExperience && doctorBirthDate && doctorGender && doctorPassword
        ) {
            // تحقق من ملء الحقول
            if (
                !doctorName.value || !doctorEmail.value || !doctorPhone.value ||
                !doctorSpecialty.value || !doctorExperience.value ||
                !doctorBirthDate.value || !doctorGender.value || !doctorPassword.value
            ) {
                message.textContent = "Please fill all the fields."; // إذا كانت هناك حقول فارغة
                return;
            }

            // تقسيم الاسم الكامل إلى الاسم الأول والاسم الأخير
            const nameParts = doctorName.value.trim().split(" ");
            const first_name = nameParts[0] || "";
            const last_name = nameParts.slice(1).join(" ") || "";

            // جمع البيانات
            const doctorData = {
                first_name: first_name,
                last_name: last_name,
                email: doctorEmail.value,
                phone_number: doctorPhone.value,
                level_of_expertise: doctorSpecialty.value,
                experience: doctorExperience.value,
                birth_date: doctorBirthDate.value,
                gender: doctorGender.value,
                password: doctorPassword.value
            };

            try {
                // الحصول على البريد الإلكتروني للمسؤول المخزن في localStorage
                const adminEmail = localStorage.getItem("userEmail");

                if (!adminEmail) {
                    message.textContent = "Admin email not found in localStorage.";
                    return;
                }

                const response = await fetch(`http://localhost:3000/api/users?email=${adminEmail}&email=essam@gmail.com`, {  // المسار يجب أن يكون مناسبًا للـ API
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(doctorData)
                });

                if (!response.ok) {
                    throw new Error("Error adding doctor.");
                }

                alert("Doctor added successfully!");

                // إعادة تعيين الحقول
                form.reset();

                // إعادة التوجيه إلى صفحة الملف الشخصي بعد الإضافة
                window.history.back();

            } catch (error) {
                message.textContent = error.message;
                console.error(error); // طباعة الخطأ في السجل
            }
        } else {
            message.textContent = "Please fill all the fields."; // الرسالة في حال كانت الحقول فارغة
        }
    });
});
