import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from "../db.mjs";

dotenv.config();
const router = Router();
const SECRET_KEY = process.env.JWT_SECRET

// Register a new user
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
            [username, hashedPassword]
        );

        res.status(201).json({ message: "User registered", user: result.rows[0] });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Login user and generate JWT
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rowCount === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const isValid = await bcrypt.compare(password, user.rows[0].password_hash);

        if (!isValid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.rows[0].id, username: user.rows[0].username }, SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;
