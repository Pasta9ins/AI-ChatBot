import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY is required");

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });



export async function generateReply({ chat }) {
  const parts = [];

  // System-style instruction so the bot always explains its capabilities
  parts.push({
    text:
      "You are a helpful study assistant for a web chatbot. " +
      "You can: (1) chat normally, (2) summarize and answer questions about an uploaded PDF/TXT document, " +
      "and (3) describe and answer questions about an uploaded PNG/JPG image. " +
      "Whenever the user asks what you can do (for example: 'hi chat what can you do?'), " +
      "explicitly mention that you can help summarize their documents, explain key points, and help them study using both documents and images."
  });

  // Existing conversation context
  if (chat.messages.length) {
    const historyText = chat.messages
      .map(m => `${m.role === "user" ? "User" : "Bot"}: ${m.text}`)
      .join("\n");
    parts.push({ text: `Conversation so far:\n${historyText}` });
  }

  if (chat.docText?.text) {
    parts.push({ text: `Document content:\n${chat.docText.text.slice(0, 8000)}` });
  }

  if (chat.image?.buffer && chat.image?.mimeType) {
    parts.push({
      inlineData: {
        data: chat.image.buffer.toString("base64"),
        mimeType: chat.image.mimeType,
      },
    });
  }

  const lastUser = [...chat.messages].reverse().find(m => m.role === "user");
  if (lastUser) {
    parts.push({ text: `Latest user message: ${lastUser.text}` });
  } else {
    parts.push({ text: "User: (no message provided)" });
  }

  const result = await model.generateContent({ contents: [{ role: "user", parts }] });
  return result.response.text();
}