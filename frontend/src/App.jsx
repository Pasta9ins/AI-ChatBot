import React, { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function App() {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [docName, setDocName] = useState("");
  const [imageInfo, setImageInfo] = useState(null); // { name, mimeType }
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  // Start a chat on first load
  useEffect(() => {
    startChat();
  }, []);

  async function startChat() {
    try {
      setStarting(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/api/chat/start`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to start chat");
      const data = await res.json();
      setChatId(data.chatId);
      setMessages(data.messages || []);
      setDocName("");
      setImageInfo(null);
      setImagePreviewUrl(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to start chat");
    } finally {
      setStarting(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || !chatId) return;
    setLoadingSend(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, text: input }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }
      setMessages(data.messages || []);
      setInput("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error sending message");
    } finally {
      setLoadingSend(false);
    }
  }

  async function handleNewChat() {
    if (!chatId) return startChat();
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset chat");
      }
      setMessages(data.messages || []);
      setDocName("");
      setImageInfo(null);
      setImagePreviewUrl(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error resetting chat");
    }
  }

  async function handleDocUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !chatId) return;
    setLoadingDoc(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("chatId", chatId);
      formData.append("file", file);

      const res = await fetch(`${API_BASE_URL}/api/upload/doc`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload document");
      }
      setDocName(data.docText?.name || file.name);
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error uploading document");
    } finally {
      setLoadingDoc(false);
      e.target.value = "";
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !chatId) return;
    setLoadingImage(true);
    setError("");

    // local preview
    const url = URL.createObjectURL(file);
    setImagePreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });

    try {
      const formData = new FormData();
      formData.append("chatId", chatId);
      formData.append("file", file);

      const res = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }
      setImageInfo(data.image || { name: file.name, mimeType: file.type });
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error uploading image");
      // if server failed, remove preview
      setImagePreviewUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return null;
      });
      setImageInfo(null);
    } finally {
      setLoadingImage(false);
      e.target.value = "";
    }
  }

  const isBusy = starting || loadingSend || loadingDoc || loadingImage;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Your Prep Chatbot
            </h1>
            <p className="text-xs text-slate-400">
              Text, documents (PDF/TXT), and images (PNG/JPG).
            </p>
          </div>
          <button
            onClick={handleNewChat}
            disabled={!chatId || isBusy}
            className="inline-flex items-center gap-1 rounded-full border border-slate-600 px-3 py-1 text-xs font-medium text-slate-100 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            New Chat
          </button>
        </header>

        {/* Status bar (doc + image) */}
        <div className="px-4 py-2 border-b border-slate-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Doc:</span>
              {docName ? (
                <span className="text-emerald-300 truncate max-w-[200px]">
                  {docName}
                </span>
              ) : (
                <span className="text-slate-500">Not selected</span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Image:</span>
              {imageInfo ? (
                <span className="text-sky-300 truncate max-w-[200px]">
                  {imageInfo.name}
                </span>
              ) : (
                <span className="text-slate-500">Not selected</span>
              )}
            </div>
          </div>
          {isBusy && (
            <span className="text-[11px] text-slate-400">
              {starting
                ? "Starting chat..."
                : loadingSend
                ? "Sending..."
                : loadingDoc
                ? "Uploading document..."
                : "Uploading image..."}
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 mt-2 rounded-lg bg-red-950/60 border border-red-700 px-3 py-2 text-xs text-red-100">
            {error}
          </div>
        )}

        {/* Chat + side panel */}
        <div className="flex flex-1 overflow-hidden px-4 pb-3 pt-2 gap-4">
          {/* Messages */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {messages.length === 0 && !starting && (
                <div className="text-xs text-slate-500 mt-2">
                  Start by sending a message or uploading a document/image.
                </div>
              )}
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-emerald-600 text-emerald-50"
                      : "mr-auto bg-slate-800 border border-slate-700"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wide opacity-70 mb-0.5">
                    {m.role === "user" ? "You" : "Bot"}
                  </div>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Side panel: image preview */}
          <div className="w-40 flex flex-col border-l border-slate-800 pl-3">
            <div className="text-[11px] text-slate-400 mb-2">
              Image preview
            </div>
            <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950/50 flex items-center justify-center overflow-hidden">
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Uploaded preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-[11px] text-slate-600 px-2 text-center">
                  Upload a PNG/JPG to see a preview here.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Input + upload bar */}
        <div className="border-t border-slate-800 px-4 py-3">
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 w-full"
          >
            {/* Upload buttons */}
            <div className="flex items-center gap-2">
              {/* Doc upload */}
              <label className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-100 cursor-pointer hover:bg-slate-800">
                <span className="text-slate-300">Doc</span>
                <input
                  type="file"
                  accept=".pdf,.txt,application/pdf,text/plain"
                  className="hidden"
                  onChange={handleDocUpload}
                  disabled={!chatId || loadingDoc || loadingImage || loadingSend}
                />
              </label>

              {/* Image upload */}
              <label className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-100 cursor-pointer hover:bg-slate-800">
                <span className="text-slate-300">Image</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={!chatId || loadingDoc || loadingImage || loadingSend}
                />
              </label>
            </div>

            {/* Text input */}
            <input
              type="text"
              className="flex-1 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder={
                starting
                  ? "Starting chat..."
                  : "Ask a question or refer to uploaded files..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!chatId || starting || loadingSend}
            />

            {/* Send */}
            <button
              type="submit"
              disabled={
                !chatId ||
                starting ||
                loadingSend ||
                !input.trim()
                
              }
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingSend ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;