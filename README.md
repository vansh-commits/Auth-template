# 🔐 Auth Template

A full-stack authentication template with Go backend (Fiber) and Next.js 15 frontend (NextAuth v5).

## ✨ Features

- **Google OAuth Integration** - Seamless sign-in with Google
- **JWT Authentication** - Secure session management with refresh tokens
- **User Management** - CRUD operations and user directory
- **CORS Protection** - Environment-aware configuration
- **PostgreSQL Database** - Robust data persistence with GORM

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
go mod download
# Set up .env with DATABASE_URL, JWT_SECRET, INTERNAL_SYNC_TOKEN
go run main.go
```

### Frontend Setup
```bash
cd frontend
npm install
# Set up .env.local with Google OAuth credentials
npm run dev
```

## 🏗️ Architecture

- **Backend**: Go + Fiber + PostgreSQL + GORM
- **Frontend**: Next.js 15 + NextAuth v5 + TypeScript + Tailwind CSS
- **Authentication**: JWT + HTTP-only cookies + Google OAuth

## 📡 API Endpoints

- `POST /auth/internal/sso-sync` - SSO synchronization
- `GET /users/bulk` - Get all users (authenticated)
- `GET /users/:id` - Get specific user (authenticated)

## 🔐 Security Features

- JWT validation and revocation
- Environment-specific CORS
- Secure headers

## 📝 Environment Variables

### Backend
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=your-secret
INTERNAL_SYNC_TOKEN=your-token
ENV=development
```

### Frontend
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
NEXTAUTH_SECRET=your-secret
API_BASE=http://localhost:8080
```

## 🚀 Deployment

- Set `ENV=production`
- Configure `FRONTEND_PROD_URL`
- Environment-specific database configs

---

**Built with Go, Fiber, Next.js, and NextAuth**
