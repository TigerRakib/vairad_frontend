# VaiRadiology Frontend - Development Instructions

This is a Next.js 14 frontend application for task management and image annotation.

## Project Overview
- **Language**: TypeScript
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Client**: Axios

## Setup & Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Steps to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file:
   ```bash
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Key Features

### Pages
- `/` - Home page
- `/login` - User login
- `/signup` - User registration
- `/tasks` - Task management with Kanban board
- `/annotate` - Image annotation tool

### Components Structure
- `components/` - Reusable React components
- `app/` - Next.js pages and layouts
- `store/` - Zustand state stores
- `services/` - API service layer
- `types/` - TypeScript type definitions
- `utils/` - Helper functions

## Backend Requirements

This frontend requires a Django backend running at `http://127.0.0.1:8000/api`

API endpoints needed:
- Authentication: `/auth/signup/`, `/auth/login/`, `/auth/logout/`, `/auth/user/`
- Tasks: `/tasks/`, `/tasks/{id}/`
- Annotations: `/annotation-images/`, `/polygon-annotations/`

## Development Guidelines

1. **TypeScript**: All files should be in TypeScript
2. **Components**: Keep components small and reusable
3. **State**: Use Zustand stores for global state
4. **API**: Use apiService for all backend calls
5. **Styling**: Use Tailwind CSS classes
6. **Types**: Define types in `/types/index.ts`

## Troubleshooting

If API calls fail, verify:
1. Backend is running on http://127.0.0.1:8000
2. `.env.local` has correct API URL
3. Backend CORS is properly configured

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
