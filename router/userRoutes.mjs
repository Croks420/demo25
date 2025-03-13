import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.mjs'; // Import the User class

dotenv.config();
const router = Router();
const SECRET_KEY = process.env.JWT_SECRET;

// Register user
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(409).json({ error: "Username is already taken" });
        }

        const newUser = await User.create(username, password);
        res.status(201).json({ message: "User registered", user: newUser });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Login user
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const user = await User.findByUsername(username);

        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const isValid = await User.validatePassword(user.password_hash, password);

        if (!isValid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
