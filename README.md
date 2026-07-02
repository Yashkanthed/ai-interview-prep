# AI Interview Prep — Full-Stack MERN Application

A complete AI-powered mock interview platform. Users select a role, experience level, and topic; the AI generates tailored questions; and after each answer the AI returns a score (1–10), strengths, weaknesses, and improvement suggestions. Progress is tracked on a personal dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, Axios, Chart.js |
| Backend | Node.js, Express 4, MongoDB, Mongoose |
| Auth | JWT (access + refresh tokens), bcrypt, httpOnly cookies |
| Email | Nodemailer (SMTP — Gmail / Mailtrap) |
| AI | OpenAI API (gpt-4o-mini default; swap model in `.env`) |
| Validation | Joi (backend), custom validators (frontend) |

---

## Project Structure

```
/
├── frontend/
│   └── src/
│       ├── api/           # Axios client + per-feature API functions
│       ├── components/
│       │   ├── auth/      # LoginForm, RegisterForm, ForgotPassword, ResetPassword
│       │   ├── common/    # Navbar, Button, Input, Select, Loader, Card, ErrorBoundary
│       │   ├── dashboard/ # StatsCard, ProgressChart, SessionHistoryTable, AdminUserTable
│       │   ├── feedback/  # FeedbackCard, FeedbackSummary, ScoreBadge
│       │   └── interview/ # InterviewSetupForm, InterviewSession, QuestionCard, Timer, AnswerInput
│       ├── context/       # AuthContext, InterviewContext
│       ├── hooks/         # useAuth, useInterview, useTimer
│       ├── pages/         # One file per route
│       ├── routes/        # AppRoutes, ProtectedRoute, AdminRoute
│       ├── styles/        # index.css (CSS variables, full theme)
│       └── utils/         # constants, validators, formatters
│
└── backend/
    ├── config/            # db.js (Mongoose connection)
    ├── controllers/       # authController, userController, interviewController, feedbackController, adminController
    ├── middleware/        # authenticate, authorize, validate, errorHandler, rateLimiter
    ├── models/            # User, InterviewSession, Question, Answer, Feedback
    ├── routes/            # authRoutes, userRoutes, interviewRoutes, feedbackRoutes, adminRoutes
    ├── services/          # jwtService, emailService, aiService
    └── utils/             # asyncHandler, schemas (Joi), seedAdmin
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- SMTP credentials (Gmail app password or Mailtrap)
- OpenAI API key

### 1. Clone & install

```bash
# Backend
cd backend
cp .env.example .env      # fill in your values
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

### 2. Configure `.env` (backend)

```
MONGO_URI=mongodb://localhost:27017/ai_interview_prep
JWT_ACCESS_SECRET=<random 64-char hex>
JWT_REFRESH_SECRET=<random 64-char hex>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=<gmail-app-password>
EMAIL_FROM="AI Interview Prep <you@gmail.com>"
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
```

> **Gmail app password**: Google Account → Security → 2-Step Verification → App passwords.

### 3. Seed admin user (optional)

```bash
cd backend
npm run seed:admin
# Creates admin@aiinterview.dev / Admin@1234
```

### 4. Run

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Open **http://localhost:5173**

---

## API Reference

### Auth  `/api/auth`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Register new user (sends verification email) |
| POST | `/login` | Login, returns access token + refresh cookie |
| POST | `/refresh` | Rotate refresh token, return new access token |
| POST | `/logout` | Revoke refresh token |
| POST | `/forgot-password` | Send reset email via Nodemailer |
| POST | `/reset-password/:token` | Set new password |
| GET  | `/verify-email/:token` | Verify email address |

### Users  `/api/users`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/me` | ✅ | Get own profile |
| PUT | `/me` | ✅ | Update name / experience level |

### Interviews  `/api/interviews`
| Method | Path | Auth | AI | Description |
|--------|------|------|----|-------------|
| POST | `/sessions` | ✅ | | Create session |
| GET | `/sessions` | ✅ | | List own sessions |
| GET | `/sessions/:id` | ✅ | | Session + questions + answers + feedback |
| POST | `/sessions/:id/questions` | ✅ | ⚡ | Generate AI questions |
| POST | `/sessions/:id/questions/:qid/answer` | ✅ | ⚡ | Submit answer → AI feedback |
| PUT | `/sessions/:id/complete` | ✅ | | Mark session complete |

### Feedback  `/api/feedback`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/dashboard` | ✅ | Completed sessions + overall average |
| GET | `/:answerId` | ✅ | Feedback for a single answer |

### Admin  `/api/admin`  *(role: admin only)*
| Method | Path | Description |
|--------|------|-------------|
| GET | `/users` | All users |
| GET | `/users/:id` | Single user |
| PUT | `/users/:id/role` | Promote / demote user |
| DELETE | `/users/:id` | Delete user |
| GET | `/sessions` | All sessions across all users |

---

## Experience Levels

| Value | Label |
|-------|-------|
| `fresher` | Fresher (0 years) |
| `0-1` | 0–1 Year |
| `1-3` | 1–3 Years |
| `3-5` | 3–5 Years |
| `5-8` | 5–8 Years |
| `8+` | 8+ Years (Senior / Lead) |

Questions and feedback rubric are automatically calibrated to the selected level.

---

## Security Notes

- Access tokens live in **memory / localStorage** (15 min TTL)
- Refresh tokens are **httpOnly cookies** + stored server-side for revocation
- Passwords hashed with **bcrypt (12 rounds)**
- AI endpoints are **rate-limited** (10 req / 10 min per user)
- Auth endpoints are **rate-limited** (20 req / 15 min per IP)
- Passwords reset tokens expire in **15 minutes**
- Password change invalidates **all refresh tokens**

---

## Switching to Anthropic Claude

In `backend/services/aiService.js`, the `openai` SDK is initialized with your `OPENAI_API_KEY`. To use Claude instead:

1. `npm install @anthropic-ai/sdk`
2. Replace the OpenAI calls in `aiService.js` with the Anthropic SDK
3. Set `AI_MODEL=claude-3-haiku-20240307` (or similar) in `.env`

The prompts are already model-agnostic JSON-response prompts that work with any capable LLM.
