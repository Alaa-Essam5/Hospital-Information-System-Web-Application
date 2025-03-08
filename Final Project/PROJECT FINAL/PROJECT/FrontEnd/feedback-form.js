document.addEventListener("DOMContentLoaded", function () {
    const feedbackForm = document.querySelector(".contact-form");
    const messageElement = document.createElement("p");
    messageElement.style.marginTop = "10px";
    feedbackForm.appendChild(messageElement);

    feedbackForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = feedbackForm.querySelector("input[placeholder='Your Name']").value.trim();
        const email = feedbackForm.querySelector("input[placeholder='Your Email']").value.trim();
        const message = feedbackForm.querySelector("textarea[placeholder='Your Message']").value.trim();

        if (!name || !email || !message) {
            messageElement.textContent = "All fields are required.";
            messageElement.style.color = "red";
            return;
        }

        const feedbackData = { name, email, message };

        try {
            const response = await fetch("http://localhost:3000/api/feedback/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feedbackData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || "Failed to submit feedback.");
            }

            messageElement.textContent = "Feedback submitted successfully!";
            messageElement.style.color = "green";
            feedbackForm.reset();
        } catch (error) {
            console.error("Error submitting feedback:", error);
            messageElement.textContent = "Error submitting feedback. Please try again.";
            messageElement.style.color = "red";
        }
    });
});