// routes/logs.js
import { Router } from 'express';
import HTTP_CODES from '../utils/httpCodes.mjs';
import Log from '../models/log.mjs'; // Import the Log model

const router = Router();

// Get all logs
router.get("/log", async (req, res) => {
    try {
        console.log("Fetching logs from the database...");
        const logs = await Log.getAllLogs();
        console.log("Logs fetched:", logs);
        res.status(200).json(logs);
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Create a new log
router.post("/log", async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        const newLog = await Log.createLog(title, description);
        res.status(201).json(newLog);
    } catch (error) {
        console.error("Error inserting log:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a log
router.delete("/log/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Log ID is required" });
        }

        const result = await Log.deleteLog(id);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Log not found" });
        }

        res.status(200).json({ message: "Log deleted successfully", deletedLog: result.rows[0] });
    } catch (error) {
        console.error("Error deleting log:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update a log
router.put("/log/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        const result = await Log.updateLog(id, title, description);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Log not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating log:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
