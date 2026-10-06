import { Router } from "express";
import db from "../db/connection.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

// GET /api/events — list events for the logged-in user
router.get("/", requireAuth, (req, res) => {
    const events = db.prepare(
        "SELECT * FROM events WHERE user_id = ? ORDER BY start"
    ).all(req.user.userId);

    // Convert to FullCalendar shape
    const formatted = events.map((e) => ({
        id: String(e.id),
        title: e.title,
        start: e.start,
        end: e.end,
        backgroundColor: e.background_color,
        borderColor: e.border_color,
        extendedProps: { clientId: e.client_id || "" },
    }));

    res.json(formatted);
});

// POST /api/events — create a new event
router.post("/", requireAuth, (req, res) => {
    const { title, start, end, backgroundColor, borderColor, extendedProps } = req.body;

    if (!title || !start) {
        return res.status(400).json({ error: "Title and start are required" });
    }

    const result = db.prepare(`
        INSERT INTO events (title, start, end, background_color, border_color, client_id, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        title,
        start,
        end || start,
        backgroundColor || null,
        borderColor || null,
        extendedProps?.clientId || null,
        req.user.userId
    );

    res.status(201).json({ id: String(result.lastInsertRowid) });
});

// PUT /api/events/:id — update (for drag/resize/client change)
router.put("/:id", requireAuth, (req, res) => {
    const existing = db.prepare(
        "SELECT * FROM events WHERE id = ? AND user_id = ?"
    ).get(req.params.id, req.user.userId);

    if (!existing) return res.status(404).json({ error: "Event not found" });

    const { title, start, end, backgroundColor, borderColor, extendedProps } = req.body;

    db.prepare(`
        UPDATE events
        SET title = ?, start = ?, end = ?, background_color = ?, border_color = ?, client_id = ?
        WHERE id = ?
    `).run(
        title ?? existing.title,
        start ?? existing.start,
        end ?? existing.end,
        backgroundColor ?? existing.background_color,
        borderColor ?? existing.border_color,
        extendedProps?.clientId ?? existing.client_id,
        req.params.id
    );

    res.json({ success: true });
});

// DELETE /api/events/:id
router.delete("/:id", requireAuth, (req, res) => {
    const existing = db.prepare(
        "SELECT id FROM events WHERE id = ? AND user_id = ?"
    ).get(req.params.id, req.user.userId);

    if (!existing) return res.status(404).json({ error: "Event not found" });

    db.prepare("DELETE FROM events WHERE id = ?").run(req.params.id);
    res.json({ success: true });
});

export default router;