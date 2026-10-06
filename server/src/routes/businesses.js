import { Router } from "express";
import db from "../db/connection.js";
import requireAuth from "../middleware/requireAuth.js";
import requireRole from "../middleware/requireRole.js";

const router = Router();

// GET /api/businesses — all businesses, with whether the logged-in user is a client of each
router.get("/", requireAuth, (req, res) => {
    try {
        const rows = db.prepare(`
            SELECT b.id, b.name,
                   u.first_name AS owner_first_name,
                   u.surname AS owner_surname,
                   EXISTS (
                       SELECT 1 FROM business_clients bc
                       WHERE bc.business_id = b.id AND bc.user_id = ?
                   ) AS joined
            FROM businesses b
            JOIN users u ON u.id = b.owner_id
            ORDER BY b.name
        `).all(req.user.userId);

        res.json(rows.map((row) => ({ ...row, joined: Boolean(row.joined) })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error has occurred." });
    }
});

// GET /api/businesses/me/clients — the logged-in business owner's client list
router.get("/me/clients", requireAuth, requireRole("business_owner"), (req, res) => {
    try {
        const business = db
            .prepare("SELECT id FROM businesses WHERE owner_id = ?")
            .get(req.user.userId);

        if (!business) {
            return res.status(404).json({ error: "Business not found" });
        }

        const clients = db.prepare(`
            SELECT u.id, u.first_name, u.surname, u.email, bc.created_at AS joined_at
            FROM business_clients bc
            JOIN users u ON u.id = bc.user_id
            WHERE bc.business_id = ?
            ORDER BY bc.created_at DESC
        `).all(business.id);

        res.json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error has occurred." });
    }
});

// POST /api/businesses/:id/join — a student selects a business and becomes its client
router.post("/:id/join", requireAuth, requireRole("student"), (req, res) => {
    try {
        const business = db
            .prepare("SELECT id FROM businesses WHERE id = ?")
            .get(req.params.id);

        if (!business) {
            return res.status(404).json({ error: "Business not found" });
        }

        // Joining twice is harmless; the UNIQUE constraint ignores the repeat
        db.prepare(
            "INSERT OR IGNORE INTO business_clients (business_id, user_id) VALUES (?, ?)"
        ).run(business.id, req.user.userId);

        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error has occurred." });
    }
});

// DELETE /api/businesses/:id/join — a student stops being a client of a business
router.delete("/:id/join", requireAuth, requireRole("student"), (req, res) => {
    try {
        db.prepare(
            "DELETE FROM business_clients WHERE business_id = ? AND user_id = ?"
        ).run(req.params.id, req.user.userId);

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error has occurred." });
    }
});

export default router;
