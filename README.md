### AI Chatbot (Gemini)

Hey! This is a small AI chatbot project I built to play with **Google Gemini** and keep things as simple as possible.  
It’s a minimal web app with:

- **Backend**: Node.js + Express  
- **Frontend**: React + Vite + Tailwind CSS  
- **AI**: Google Gemini

The bot can:

- Chat with plain text  
- Answer questions about uploaded **PDF/TXT** files  
- Answer questions about uploaded **PNG/JPG** images  
- Keep basic chat context **in memory only** (no auth, no database)

---

### 1. Installation

From the project root, install dependencies for both backend and frontend.

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install---

### 2. Setting the Gemini API Key

The backend expects your Gemini key in an environment variable called `GEMINI_API_KEY`.

1. In `backend/`, create a `.env` file:

GEMINI_API_KEY=your_gemini_api_key_here
PORT=30002. Make sure `.env` is **not committed** (it should be listed in `.gitignore`).  
3. For deployment on Vercel (backend project), set `GEMINI_API_KEY` in:  
   **Project → Settings → Environment Variables**.

---

### 3. Running Backend + Frontend (Local)

#### Backend (Node + Express)

cd backend
npm run dev

1. In `frontend/`, create a `.env` file:

VITE_API_BASE_URL=http://localhost:30002. Start the dev server:

cd frontend
npm run dev

---

### 4. How to Use the App

1. **Open the web app**  
   - Go to the frontend URL (local `http://localhost:5173` or your Vercel frontend URL).

2. **Start a chat**  
   - A new chat is started automatically when the page loads.  
   - Try something like: `Hi chat, what can you do?` and hit **Send**.

3. **Upload a document (PDF/TXT)**  
   - Click the **Doc** button.  
   - Select a `.pdf` or `.txt` file.  
   - Then ask things like:
     - `Summarize the document.`
     - `What was the third point mentioned?`

4. **Upload an image (PNG/JPG)**  
   - Click the **Image** button.  
   - Select a `.png` or `.jpg` file.  
   - A small preview will appear in the side panel.  
   - Now you can ask:
     - `What's in the image?`
     - `Is the person smiling?`

5. **Use context across messages**  
   - You can refer back to what you uploaded:
     - `What did I upload earlier?`
     - `Explain the key topics from the document in simple terms.`

6. **Reset with New Chat**  
   - Click **New Chat**.  
   - This wipes:
     - Chat history  
     - Uploaded document text  
     - Uploaded image  
   - After that, asking `What did I upload earlier?` will behave like a completely fresh session.

---


## 🙌 Made with ❤️ by **Anirudha Chaudhary**
