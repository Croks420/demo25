// Logout
document.getElementById("logout-button").addEventListener("click", () => {
    // removes stored token
    localStorage.removeItem("token");

    // sends the user back to the login
    window.location.href = "/login.html";
});

async function fetchLogs() {
    try {
        console.log("Fetching logs from the server...");

        const response = await fetch("http://localhost:8000/api/log");
        console.log("Response received:", response);

        if (!response.ok) {
            throw new Error('Failed to fetch logs');
        }

        const logs = await response.json();
        console.log("Logs data:", logs);

        const logsList = document.getElementById("logs-list");
        logsList.innerHTML = "";

        logs.forEach(log => {
            const listItem = document.createElement("li");
            const logDate = new Date(log.log_date).toLocaleDateString();
            listItem.textContent = `${logDate}: ${log.title} - ${log.description}`;

            // edit button
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.style.marginLeft = "10px";
            editButton.onclick = () => editLog(log);

            // delete button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.style.marginLeft = "10px";
            deleteButton.onclick = () => deleteLog(log.id);

            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);
            logsList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching logs:", error);
    }
}

fetchLogs();

document.getElementById("log-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    if (!title || !description) {
        alert("Title and description are required.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/api/log", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, description })
        });

        if (!response.ok) {
            throw new Error("Failed to add log");
        }

        const newLog = await response.json();
        console.log("Log added:", newLog);

        // Refresh the log
        fetchLogs();

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
    } catch (error) {
        console.error("Error adding log:", error);
    }
});

function editLog(log) {
    document.getElementById("edit-title").value = log.title;
    document.getElementById("edit-description").value = log.description;

    document.getElementById("log-form").style.display = "none";
    document.getElementById("edit-log-form").style.display = "block";

    document.getElementById("edit-log-form").onsubmit = async (event) => {
        event.preventDefault();

        const title = document.getElementById("edit-title").value;
        const description = document.getElementById("edit-description").value;

        if (!title || !description) {
            alert("Title and description are required.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/log/${log.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, description })
            });

            if (!response.ok) {
                throw new Error("Failed to update log");
            }

            const updatedLog = await response.json();
            console.log("Log updated:", updatedLog);

            fetchLogs();

            document.getElementById("log-form").style.display = "block";
            document.getElementById("edit-log-form").style.display = "none";
        } catch (error) {
            console.error("Error updating log:", error);
        }
    };
}

document.getElementById("cancel-edit").addEventListener("click", () => {
    document.getElementById("log-form").style.display = "block";
    document.getElementById("edit-log-form").style.display = "none";
});

// Delete a Log
async function deleteLog(id) {
    if (!confirm("Are you sure you want to delete this log?")) return;

    try {
        const response = await fetch(`http://localhost:8000/api/log/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to delete log");
        }

        console.log("Log deleted successfully");
        fetchLogs(); // another refresh
    } catch (error) {
        console.error("Error deleting log:", error);
    }
}