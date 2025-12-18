import express from "express";
import "./config.js"

import cors from "cors";
import chatRouter from "./src/routes/chat.js";
import uploadRouter from "./src/routes/uploads.js";
// import dotenv from "dotenv";

// dotenv.config();


const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/chat", chatRouter);
app.use("/api/upload", uploadRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));