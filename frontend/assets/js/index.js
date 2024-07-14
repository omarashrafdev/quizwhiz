document.addEventListener("DOMContentLoaded", (event) => {
    // Login page reload
    const loginRedirect = document.getElementById("login-page");
    if (loginRedirect)
        loginRedirect.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = "/frontend/login.html";
        });

    // Login form submit
    const loginForm = document.getElementById("login-form");
    if (loginForm)
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const rememberMe = document.getElementById("remember-me").checked;

            try {
                const response = await fetch("http://127.0.0.1:8000/api/v1/login/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password, remember_me: rememberMe })
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();

                if (data.access) {
                    document.cookie = `token=${data.token}; path=/; ${rememberMe ? 'max-age=31536000;' : ''}`;
                    console.log("Login successful");
                    window.location.href = "/frontend/index.html"; // Redirect to home page or desired page
                } else {
                    throw new Error("Invalid login credentials");
                }
            } catch (error) {
                document.getElementById("error-message").classList.remove("hidden");
                console.error("There was a problem with the login request:", error);
            }
        });


    // Register page reload
    const registerRedirect = document.getElementById("register-page");
    if (registerRedirect)
        registerRedirect.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = "/frontend/register.html";
        });

    // Register form submit
    const registerForm = document.getElementById("register-form");
    if (registerForm)
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            if (password !== confirmPassword) {
                document.getElementById("error-message").textContent = "Passwords do not match.";
                document.getElementById("error-message").classList.remove("hidden");
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

                const data = await response.json();

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                if (response.status == 201) {
                    console.log("Registration successful");
                    window.location.href = "/frontend/login.html";
                } else {
                    throw new Error("Registration failed");
                }
            } catch (error) {
                document.getElementById("error-message").textContent = "An error occurred during registration. Please try again.";
                document.getElementById("error-message").classList.remove("hidden");
                console.error("There was a problem with the registration request:", error);
            }
        });
});
