import express, { json } from "express";
import cors from "cors";
import { config } from "./config/env.js";

import authRoutes from "./routes/auth.js";
import requireAuth from "./middleware/requireAuth.js";
import requireRole from "./middleware/requireRole.js";
import eventRoutes from "./routes/events.js";
import clientRoutes from "./routes/clients.js"

const app = express();
const port = config.port;

app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({status: "ok"});
});

app.use('/api/auth', authRoutes);
app.use("/api/events", eventRoutes);
app.use('/api/clients', clientRoutes);

// testing routes
app.get('/api/test/protected', requireAuth, (req, res) => {
  res.json({ message: "Authentication works", user: req.user });
});

app.get('/api/test/owner', requireAuth, requireRole("business_owner"), (req, res) => {
  res.json({ message: "Welcome owner", user: req.user });
});

// Catch all 404 errors
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});