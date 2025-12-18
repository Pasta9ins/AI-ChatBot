import { v4 as uuid } from "uuid";

const chats = new Map();

export function createChat() {
  const chatId = uuid();
  chats.set(chatId, { messages: [], docText: null, image: null, createdAt: Date.now() });
  return chatId;
}

export function resetChat(chatId) {
  if (!chats.has(chatId)) return null;
  chats.set(chatId, { messages: [], docText: null, image: null, createdAt: Date.now() });
  return chatId;
}

export function getChat(chatId) {
  return chats.get(chatId) || null;
}

export function upsertChat(chatId) {
  if (!chats.has(chatId)) createChat();
  return getChat(chatId);
}

export function addMessage(chatId, role, text) {
  const chat = upsertChat(chatId);
  chat.messages.push({ role, text, ts: Date.now() });
}

export function setDoc(chatId, docText, docName) {
  const chat = upsertChat(chatId);
  chat.docText = { text: docText, name: docName };
}

export function setImage(chatId, buffer, mimeType, fileName) {
  const chat = upsertChat(chatId);
  chat.image = { buffer, mimeType, fileName };
}