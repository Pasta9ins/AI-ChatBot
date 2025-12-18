## AI Chatbot (Gemini)

Hey everyone! I'm excited to present AI-ChatBot a minimal web-based chatbot built with **Node.js + Express** (backend) and **React + Vite + Tailwind CSS** (frontend), using **Google Gemini** for:

- Text conversation
- PDF/TXT document Q&A
- PNG/JPG image Q&A
- Simple in-memory chat context (no auth, no database)

---

### 1. Installation

Clone the repo and install dependencies for both backend and frontend.

# From project root
cd backend
npm install

cd ../frontend
npm install---

### 2. Setting the Gemini API Key

The backend reads your Gemini key from `GEMINI_API_KEY`.

1. In `backend/`, create a `.env` file:

GEMINI_API_KEY=your_gemini_api_key_here
PORT=30002. **Do not commit `.env`**. It should be in `.gitignore`.  
3. On Vercel (for backend deployment), add `GEMINI_API_KEY` in Project → Settings → Environment Variables.

---

### 3. Running Backend + Frontend (Local)

#### Backend (Node + Express)

cd backend
npm run dev
# Backend will run on http://localhost:3000#### Frontend (React + Vite)

1. In `frontend/`, create `.env`:

VITE_API_BASE_URL=http://localhost:30002. Run the dev server:

cd frontend
npm run dev
# Open the URL shown by Vite (e.g. http://localhost:5173)The frontend will call the backend using `VITE_API_BASE_URL`.

---

### 4. Example Usage (How to Use the App)

1. **Open the web app**  
   - Go to the frontend URL (local `http://localhost:5173` or your Vercel frontend URL).

2. **Start a chat**  
   - The app automatically starts a new chat on load.
   - Type something like: `Hi chat, what can you do?` and click **Send**.

3. **Upload a document (PDF/TXT)**  
   - Click the **Doc** button.
   - Choose a `.pdf` or `.txt` file.
   - After upload, ask:  
     - `Summarize the document.`  
     - `What was the third point mentioned?`

4. **Upload an image (PNG/JPG)**  
   - Click the **Image** button.
   - Choose a `.png` or `.jpg` file.
   - You’ll see a small preview in the side panel.
   - Ask:  
     - `What's in the image?`  
     - `Is the person smiling?`

5. **Use context across messages**  
   - Ask follow-up questions referencing what you uploaded, e.g.:  
     - `What did I upload earlier?`  
     - `Explain the key topics from the document in simple terms.`

6. **Reset with New Chat**  
   - Click **New Chat**.
   - This clears:
     - Message history
     - Uploaded document text
     - Uploaded image
   - Now asking `What did I upload earlier?` will behave like a fresh session.
## 🙌 Made with ❤️ by **Anirudha Chaudhary**
