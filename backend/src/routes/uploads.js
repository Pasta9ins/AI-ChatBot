import { Router } from "express";
import multer from "multer";
import { extractFromBuffer } from "../services/extractText.js";
import { getChat, setDoc, setImage, upsertChat } from "../store/chatStore.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/doc", upload.single("file"), async (req, res) => {
  try {
    const { chatId } = req.body || {};
    if (!chatId) return res.status(400).json({ error: "chatId is required" });
    upsertChat(chatId);

    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const text = await extractFromBuffer(file);
    setDoc(chatId, text, file.originalname);

    const chat = getChat(chatId);
    res.json({ chatId, docText: chat.docText, messages: chat.messages });
  } catch (err) {
    console.error("doc upload error", err);
    res.status(400).json({ error: err.message });
  }
});

router.post("/image", upload.single("file"), (req, res) => {
  try {
    const { chatId } = req.body || {};
    if (!chatId) return res.status(400).json({ error: "chatId is required" });
    upsertChat(chatId);

    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });
    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype)) {
      return res.status(400).json({ error: "Only PNG/JPG allowed" });
    }

    setImage(chatId, file.buffer, file.mimetype, file.originalname);
    const chat = getChat(chatId);
    res.json({ chatId, image: { name: file.originalname, mimeType: file.mimetype }, messages: chat.messages });
  } catch (err) {
    console.error("image upload error", err);
    res.status(400).json({ error: err.message });
  }
});

export default router;