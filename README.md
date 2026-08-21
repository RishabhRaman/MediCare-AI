# MediCare AI

MediCare AI is a full-stack health information platform that helps patients understand medical reports, explore symptoms, track health trends, and turn information into practical next steps.

The application is designed as an educational health companion. It does not replace a licensed healthcare professional, provide a medical diagnosis, or prescribe treatment.

## Features

- Plain-language medical report analysis for PDFs, images, and pasted text
- OCR-assisted extraction using Tesseract.js
- AI-assisted report summaries and health conversations
- Symptom search and triage guidance with red-flag prompts
- Health metric and biometric trend tracking
- Personalized recommendations and follow-up tasks
- Patient portal with authentication and demo access
- Google OAuth support when configured
- Light and dark themes
- Responsive React interface with accessible controls
- Protected API routes, rate limiting, security headers, and centralized error handling

## Technology

### Client

- React 18
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React

### Server

- Node.js
- Express
- MongoDB with Mongoose
- JWT and cookie-based authentication
- Multer for uploads
- Tesseract.js and PDF parsing
- Optional OpenAI, Gemini, or Anthropic integrations

## Project Structure

```text
client/       React and Vite frontend
server/       Express API, authentication, AI, OCR, and MongoDB models
server/uploads/ Runtime report uploads
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB connection string
- An optional AI provider API key for provider-backed AI responses

## Installation

Install all workspace dependencies from the repository root:

```bash
npm run install:all
```

Create a server environment file at `server/.env`:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/medicare_ai
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d

# Optional AI configuration
AI_PROVIDER=auto
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=

# Optional Google OAuth configuration
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

Never commit `server/.env` or real API keys. The repository ignores environment files by default.

## Development

Start the backend and frontend together from the repository root:

```bash
npm run dev
```

The services are available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API health check: http://localhost:5000/api/health

The root development command waits for the backend health check before starting Vite.

You can also start each service separately:

```bash
npm run server
npm run client
```

## Available Scripts

### Root scripts

```bash
npm run dev          # Start server and client together
npm run server       # Start the server in development mode
npm run client       # Start the Vite client
npm run build        # Create a production client build
npm run seed         # Seed server data
npm run install:all  # Install root, server, and client dependencies
```

### Server scripts

```bash
npm run dev --prefix server
npm start --prefix server
npm run seed --prefix server
```

### Client scripts

```bash
npm run dev --prefix client
npm run build --prefix client
npm run preview --prefix client
```

## API Areas

The backend exposes these route groups under `/api`:

- `/auth` - registration, login, password reset, demo access, and OAuth
- `/users` - authenticated patient profile operations
- `/reports` - report upload, OCR, analysis, and report history
- `/search` - symptom search and search history
- `/recommendations` - patient recommendations and tasks
- `/metrics` - health metrics and trend data
- `/ai` - AI assistant chat

## AI Providers

The AI service can use configured provider keys when available. Set `AI_PROVIDER` to select a provider or leave it as `auto` to use the service's automatic selection behavior.

Supported configuration variables:

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `ANTHROPIC_API_KEY`
- `AI_PROVIDER`

Without an external provider key, the application can use its clinical rule-engine fallback where supported.

## Production Notes

Before deploying:

- Set `NODE_ENV=production`.
- Use a strong, unique `JWT_SECRET`.
- Configure a production MongoDB instance.
- Set `CLIENT_URL` to the deployed frontend origin.
- Configure secure OAuth callback URLs if Google sign-in is enabled.
- Review upload storage, rate limits, CORS, cookies, and logging for your hosting environment.
- Do not expose API keys or `.env` files in source control.

Build the client with:

```bash
npm run build
```

## Medical Disclaimer

MediCare AI provides general educational and informational support only. It is not a substitute for professional medical advice, diagnosis, or treatment. Do not use the application for emergencies. If you believe you may be experiencing a medical emergency, contact local emergency services immediately.

## License

No license has been specified for this project yet.
