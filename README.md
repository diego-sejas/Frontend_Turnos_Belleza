# Sistema Belleza - Frontend

Frontend for the Sistema Belleza appointment booking system.

## Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React context providers (Auth)
├── hooks/          # Custom hooks
├── layouts/        # Page layouts (Main, Public)
├── pages/          # Page components
├── services/       # API services
├── theme/          # MUI theme configuration
├── utils/          # Utility functions
├── App.jsx         # Main app with routing
└── main.jsx        # Entry point
```

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
cd Frontend_Belleza
npm install
```

### Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### Development

```bash
npm run dev
```

Frontend starts on http://localhost:5173

Proxies API requests to http://localhost:3000

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:3000/api |

## Features

- **React 18** with Vite
- **React Router 6** for routing
- **MUI (Material UI)** for components
- **Axios** for API calls with interceptors
- **JWT Authentication** with auto-refresh
- **Responsive design** with modern theme
- **Protected routes** with auth context

## Pages

- `/` - Landing page (public)
- `/login` - Login page (public)
- `/register` - Registration (public, placeholder)
- `/dashboard` - Main dashboard (protected)
- `/reservations` - Reservations (protected, placeholder)
- `/clients` - Clients (protected, placeholder)
- `/payments` - Payments (protected, placeholder)
- `/settings` - Settings (protected, placeholder)