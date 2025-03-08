document.addEventListener("DOMContentLoaded", async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (!userId) {
        alert("User ID is missing or invalid.");
        window.location.href = "profile-admin.html";  // إعادة توجيه إذا كان الـ ID غير موجود
        return;
    }

    // جلب بيانات المستخدم من الـ API الفعلي
    const user = await fetchUserData(userId);

    if (user) {
        // تعبئة البيانات في النموذج
        document.getElementById("name").value = user.name;
        document.getElementById("email").value = user.email;
        document.getElementById("phone").value = user.phone;
    } else {
        alert("User not found");
    }
});

// جلب بيانات المستخدم من الـ API
async function fetchUserData(userId) {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
        if (response.ok) {
            const userData = await response.json();
            return userData;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred while fetching user data.");
        return null;
    }
}

// حفظ التعديلات من خلال الـ API
document.getElementById("edit-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    // التأكد من أن جميع الحقول تم ملؤها
    if (!name || !email || !phone) {
        alert("Please fill in all fields.");
        return;
    }

    // التأكد من أن الـ userId موجود قبل محاولة الحفظ
    const userId = new URLSearchParams(window.location.search).get('id');
    if (!userId) {
        alert("User ID is missing.");
        return;
    }

    // إرسال البيانات المحدثة إلى الـ API
    const updatedUser = await saveUserData(userId, { name, email, phone });

    if (updatedUser) {
        alert("Profile updated successfully!");
        setTimeout(() => {
            window.location.href = "profile-admin.html"; // العودة إلى الصفحة الرئيسية بعد التحديث
        }, 1000); // تأخير قليل بعد التحديث لضمان تجربة أفضل
    } else {
        alert("Failed to update profile");
    }
});

// حفظ بيانات المستخدم باستخدام PUT أو PATCH
async function saveUserData(userId, updatedData) {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
            method: 'PUT',  // استخدم PUT لتحديث البيانات
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            const updatedUser = await response.json();
            return updatedUser;
        } else {
            throw new Error('Failed to update user data');
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred while saving user data.");
        return null;
    }
}
