# Vorn Resume Builder 🚀

An AI-powered application designed to help professionals easily build, enhance, and export ATS-friendly resumes. Built with a modern React frontend and a secure Express backend, Vorn utilizes leading LLM capabilities (Groq & OpenAI) to generate compelling summaries, rewrite bullet points seamlessly, and perform live ATS match-analysis.

## ✨ Features

- **AI Content Generation**: From an empty form to a complete layout, Vorn can draft comprehensive professional resumes by specifying job titles, levels, and core skills.
- **Smart Bullet Enhancement**: Highlight any experience bullet point and let the AI instantly rewrite it into a highly-impactful, metric-driven statement.
- **ATS Analysis**: Provide a job description, and the AI will analyze your current resume to suggest critical missing keywords.
- **Instant PDF Export**: Generates pixel-perfect A4-size PDF exports entirely on the client side using native rendering without watermarks.
- **Bring Your Own Key (BYOK)**: Securely plug in your own Groq or OpenAI API keys in the settings menu, empowering you to control your model usage.
- **Multiple Professional Templates**: Swap between Modern, Classic, Minimal, and Creative layouts instantly. 

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Lucide Icons
- **Backend**: Node.js, Express, TypeScript, Helmet, Cors
- **AI Integration**: Groq SDK, OpenAI SDK

## 💻 Local Development

Vorn operates as a full-stack monorepo featuring a `client` and a `server`. You will need to run both concurrently for the full experience.

### 1. Backend Setup (`/server`)

Requires Node.js v18+.

```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory and add your API keys:

```ini
PORT=3001
GROQ_API_KEY=your_groq_api_key_here
```

Start the backend development server:

```bash
npm run dev
```

### 2. Frontend Setup (`/client`)

Open a new terminal window:

```bash
cd client
npm install
```

Start the frontend Vite development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`. 

## ☁️ Deployment

We recommend deploying the two parts of this application separately to specialized cloud providers:

1. **Deploy the Server to Render / Railway**:
   - Set the root directory to `server`
   - Build command: `npm install && npm run build`
   - Start command: `npm run start`
   - Don't forget to configure your production `.env` variables via their dashboard.

2. **Deploy the Client to Vercel**:
   - Connect Vercel to your repository.
   - Set the root directory to `client`.
   - Add a custom environment variable `VITE_API_URL` matching the live URL of the deployed server from step 1 (e.g., `https://my-vorn-backend.onrender.com`).
   - Vercel automatically detects Vite and builds your app.

## 📄 License

This project is open-source and free for all to experiment with.
