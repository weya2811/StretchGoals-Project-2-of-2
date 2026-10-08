import express from 'express';
import db from '../db/connection.js';
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// Fetch upcoming events for client
router.get('/upcoming-events', requireAuth, (req, res) => {
    try {
        const clientId = req.user.userId || req.user?.id;

        const query = `
            SELECT
            events.id,
            events.title,
            events.start,
            events.end
            FROM events
            JOIN users  ON events.user_id = users.id
            WHERE events.client_id = ? AND datetime(events.end) >= datetime('now')
            ORDER BY events.start ASC
            LIMIT 5
        `;

        const events = db.prepare(query).all(clientId);

        res.status(200).json(events);
    } catch (error) {
        console.log("Error fetching client events:", error)
        res.status(500).json({ error: 'Failed to load upcoming events' });
    }
});

export default router;