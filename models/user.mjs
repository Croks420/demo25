import pool from "../db.mjs";
import bcrypt from "bcrypt";

class User {
    static async findByUsername(username) {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        return result.rows[0];
    }

    static async create(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
            [username, hashedPassword]
        );
        return result.rows[0];
    }

    static async validatePassword(storedHash, password) {
        return bcrypt.compare(password, storedHash);
    }

    static async getAllUsers() {
        const result = await pool.query("SELECT id, username FROM users");
        return result.rows;
    }
}

export default User;
