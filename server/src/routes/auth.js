import { Router } from "express"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db/connection.js";
import { config } from "../config/env.js";

const router = Router();

function validateRegisterationInput(first_name, surname, email, password) {
    if (!first_name?.trim() || !surname?.trim() || !email?.trim() || !password?.trim()) {
        return "Missing required fields";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Invalid email format";
    }

    if (password.length < 8) {
        return "Password must be at least 8 characters";
    }

    return null;
}

// Register student user
router.post('/register/student', async (req, res) => {
    let {first_name, surname, email, password} = req.body;

    const validationError = validateRegisterationInput(first_name, surname, email, password);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    email = email.trim().toLowerCase();

    try {
        const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(email);

        if (existingUser) {
            return res.status(409).json({ error: "Email is already in use" });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const result = db.prepare(
            "INSERT INTO users (first_name, surname, email, password_hash, role) VALUES (?, ?, ?, ?, ?)"
        ).run(first_name, surname, email, passwordHash, "student");

        res.status(201).json({
            id: result.lastInsertRowid,
            first_name,
            surname,
            email,
            role: "student",
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "An error has occured" });
    }
});

// Register business account
router.post('/register/business', async (req, res) => {
    let {first_name, surname, email, password, business_name} = req.body;

    const validationError = validateRegisterationInput(first_name, surname, email, password);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    if (!business_name?.trim()) {
        return res.status(400).json({ error: "Business name is required."})
    }

    email = email.trim().toLowerCase();

    try {
        const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
        if (existingUser) {
            return res.status(409).json({ error: "Email is already in use" });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        // Register user first
        const userResult = db.prepare(
            "INSERT INTO users (first_name, surname, email, password_hash, role) VALUES (?, ?, ?, ?, ?)"
        ).run(first_name, surname, email, passwordHash, "business_owner");

        const userId = userResult.lastInsertRowid;

        // Register the business second
        const businessResult = db.prepare(
            "INSERT INTO businesses (name, owner_id) VALUES (?, ?)"
        ).run(business_name, userId);

        res.status(201).json({
            id: userId,
            first_name,
            surname,
            email,
            role: "business_owner",
            business: {
                id: businessResult.lastInsertRowid,
                business_name,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error has occured" });
    }
});

// Login route
router.post('/login', async (req, res) => {
    let {email, password} = req.body;

    if (!email?.trim() || !password?.trim()) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    email = email.trim().toLowerCase();

    try {
        // Check if user exists or email is correct
        const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Check password is correct
        const passwordMatches = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatches) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // assign a token to the user
        const token = jwt.sign(
            { userId: user.id, role: user.role},
            config.jwtSecret,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                surname: user.surname,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error has occurred." });
    }
});

export default router;