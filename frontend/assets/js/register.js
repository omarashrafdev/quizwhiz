document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Clear previous error messages
        document.querySelectorAll("p.text-red-500").forEach(errorElement => {
            errorElement.textContent = "";
            errorElement.classList.add("hidden");
        });

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            document.getElementById("confirm-password-error").textContent = "Passwords do not match.";
            document.getElementById("confirm-password-error").classList.remove("hidden");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, username, password })
            });

            if (response.status === 201) {
                const data = await response.json();
                console.log("Registration successful", data);
                window.location.href = "/frontend/login.html"; // Redirect to home page or desired page
            } else if (response.status === 400) {
                const errors = await response.json();
                Object.keys(errors).forEach(field => {
                    const errorElement = document.getElementById(`${field}-error`);
                    if (errorElement) {
                        errorElement.textContent = errors[field];
                        errorElement.classList.remove("hidden");
                    }
                });
            } else {
                throw new Error("Unexpected response");
            }
        } catch (error) {
            console.error("There was a problem with the registration request:", error);
            document.getElementById("name-error").textContent = "An error occurred. Please try again.";
            document.getElementById("name-error").classList.remove("hidden");
        }
    });
});
