import { Router } from "express";
import {
  createChat,
  getChat,
  resetChat,
  addMessage,
} from "../store/chatStore.js";
import { generateReply } from "../services/gemini.js";

const router = Router();

// Start a new chat
router.post("/start", (_req, res) => {
  const chatId = createChat();
  res.json({ chatId, messages: [], docText: null, image: null });
});

// Reset an existing chat (or return error if not found)
router.post("/reset", (req, res) => {
  const { chatId } = req.body || {};
  if (!chatId || !getChat(chatId)) return res.status(400).json({ error: "Invalid chatId" });
  resetChat(chatId);
  res.json({ chatId, messages: [], docText: null, image: null });
});

// Send a message
router.post("/message", async (req, res) => {
  try {
    const { chatId, text } = req.body || {};
    if (!chatId || !text) return res.status(400).json({ error: "chatId and text are required" });

    const chat = getChat(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    addMessage(chatId, "user", text);

    const reply = await generateReply({ chat: getChat(chatId) });
    addMessage(chatId, "bot", reply);

    const updated = getChat(chatId);
    res.json({ chatId, messages: updated.messages, docText: updated.docText, image: !!updated.image });
  } catch (err) {
    console.error("message error", err);
    res.status(500).json({ error: "Failed to get reply", details: err.message });
  }
});

export default router;