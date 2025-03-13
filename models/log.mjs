// models/Log.js
import pool from "../db.mjs";

class Log {
    static async getAllLogs() {
        try {
            const result = await pool.query("SELECT * FROM logs ORDER BY log_date DESC");
            return result.rows;
        } catch (error) {
            throw new Error("Error fetching logs: " + error.message);
        }
    }

    static async createLog(title, description) {
        try {
            const result = await pool.query(
                "INSERT INTO logs (title, description) VALUES ($1, $2) RETURNING *",
                [title, description]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error("Error inserting log: " + error.message);
        }
    }

    static async deleteLog(id) {
        try {
            const result = await pool.query("DELETE FROM logs WHERE id = $1 RETURNING *", [id]);
            return result;
        } catch (error) {
            throw new Error("Error deleting log: " + error.message);
        }
    }

    static async updateLog(id, title, description) {
        try {
            const result = await pool.query(
                "UPDATE logs SET title = $1, description = $2 WHERE id = $3 RETURNING *",
                [title, description, id]
            );
            return result;
        } catch (error) {
            throw new Error("Error updating log: " + error.message);
        }
    }
}

export default Log;
