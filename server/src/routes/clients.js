import express from 'express';
import db from '../db/connection.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const stat = await db.prepare(
            "SELECT id, first_name, surname FROM users WHERE role = 'client' ORDER BY first_name ASC"
        );

        const rows = stat.all()

        res.status(200).json(rows);
    } catch (error) {
        console.log("Failed to fetch clients:", error)
        res.status(500).json({ message: 'Server error fetching clients' });
    }
})

export default router;