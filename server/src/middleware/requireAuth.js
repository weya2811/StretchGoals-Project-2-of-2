import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) { // Check if there is a token
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace(/^Bearer\s+/i, ""); // Get only the token from the string
    if (!token) {
        return res.status(401).json({ error: "Malformed token" });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;

        next() // Continue to the route if the token is verified

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" });
        }
        
        return res.status(401).json({ error: "Invalid token" })
    }
}

export default requireAuth;