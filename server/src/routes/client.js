import express from 'express';
import db from '../db/connection.js';
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// Fetch upcoming events for client
router.get('/upcoming-events', requireAuth, (req, res) => {
    try {
        const clientId = req.user?.userId || req.user?.id;

        if (!clientId) {
            return res.status(401).json({ error: 'Unauthorized user token' });
        }

        const query = `
            SELECT
                e.id,
                e.title,
                e.start,
                e.end,
                (u.first_name || ' ' || u.surname) AS instructor_name
            FROM events e
            JOIN users u ON e.user_id = u.id
            WHERE e.client_id = ? AND e.start >= datetime('now')
            ORDER BY e.start ASC
        `;

        const events = db.prepare(query).all(clientId);

        res.status(200).json(events);
    } catch (error) {
        console.log("Error fetching client events:", error)
        res.status(500).json({ error: 'Failed to load upcoming events' });
    }
});

export default router;