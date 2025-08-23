# People Directory - Frontend

A modern, dark-themed people directory application built with Next.js, featuring Google authentication and a monospace design aesthetic.

## Features

- 🎨 Modern black and white monospace dark theme
- 🔐 Google OAuth authentication
- 👥 User directory with profile cards
- 📱 Responsive design
- 🚀 Fast navigation with Next.js App Router

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the frontend directory:
```env
BACKEND_URL=http://localhost:8080
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

3. Configure Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

4. Start the development server:
```bash
npm run dev
```

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components
- `app/api/` - API routes for backend communication
- `app/dashboard/` - Protected dashboard page
- `app/users/[id]/` - Individual user profile pages

## Backend Integration

The frontend communicates with a Go backend server running on port 8080. Make sure the backend is running and accessible at the URL specified in `BACKEND_URL`.

## Authentication Flow

1. Users visit the landing page
2. Click "Sign in with Google" to authenticate
3. After successful authentication, redirected to dashboard
4. Dashboard displays all users as cards
5. Clicking a user card navigates to individual profile page

## Styling

The application uses Tailwind CSS with a custom monospace font stack and dark theme colors. All components follow the black and white aesthetic with gray accents.
