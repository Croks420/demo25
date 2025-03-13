const apiUrl = window.location.origin.includes('localhost') 
    ? 'http://localhost:8000' 
    : 'https://demo25-n8yp.onrender.com';


// Register script
document.getElementById("register-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("new-username").value;
    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/api/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration successful!");
            window.location.href = "login.html";  // sends you back to login
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Registration error:", error);
        alert("An error occurred while registering.");
    }
});