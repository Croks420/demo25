import { Router } from 'express';
import HTTP_CODES from '../utils/httpCodes.mjs';
import pool from "../db.mjs";

const router = Router();

// Fetch logs
router.get("/log", async (req, res) => {
    try {
        console.log("Fetching logs from the database...");
        const result = await pool.query("SELECT * FROM logs ORDER BY log_date DESC");
        console.log("Logs fetched:", result.rows);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/log", async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        const result = await pool.query(
            "INSERT INTO logs (title, description) VALUES ($1, $2) RETURNING *",
            [title, description]
        );

        res.status(201).json(result.rows[0]); // Use 201 directly instead of HTTP_CODES.CREATED
    } catch (error) {
        console.error("Error inserting log:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/log/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Log ID is required" });
        }

        const result = await pool.query("DELETE FROM logs WHERE id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Log not found" });
        }

        res.status(200).json({ message: "Log deleted successfully", deletedLog: result.rows[0] });
    } catch (error) {
        console.error("Error deleting log:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/log/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        // Update the log in the database
        const result = await pool.query(
            "UPDATE logs SET title = $1, description = $2 WHERE id = $3 RETURNING *",
            [title, description, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Log not found" });
        }

        // Return the updated log
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating log:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;