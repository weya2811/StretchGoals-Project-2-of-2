import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(json());

app.get("/api/health", (req, res) => {
  res.send({status: "ok"});
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});