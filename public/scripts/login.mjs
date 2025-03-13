const apiUrl = window.location.origin.includes('localhost') 
    ? 'http://localhost:8000' 
    : 'https://demo25-n8yp.onrender.com';


// Login Script
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registered!', reg))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}

document.getElementById("login-form").addEventListener("submit", async function (event) {
event.preventDefault();

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

try {
    const response = await fetch(`${apiUrl}/api/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("token", data.token);
        window.location.href = "/index.html"; 
    } else {
        alert(data.error);  // error message to display
    }
} catch (error) {
    console.error("Login error:", error);
    alert("An error occurred while logging in.");
}
});

