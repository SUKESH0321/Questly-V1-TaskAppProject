# Questly

A hyperlocal task marketplace application for posting, browsing, and managing local tasks. Built with React, TypeScript, and Vite (frontend) and Express + MongoDB (backend).

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![Zustand](https://img.shields.io/badge/Zustand-5-EC6E24?style=flat-square)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white&style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white&style=flat-square)

---

## Overview

Questly connects people who need help with everyday tasks to nearby taskers in their local area. Users can post and browse tasks across categories like cleaning, plumbing, furniture assembly, delivery, and tutoring, then communicate, negotiate, and pay securely through the built-in escrow flow.

- **Customers** can post tasks, review applicants, and release escrow payments.
- **Taskers** can browse open tasks, apply, message customers, and get paid.
- **Everyone** gets a shared dashboard, notifications, and a full messaging experience.

---

## Features

- **Full Frontend-Backend Integration** — All pages fetch real data from an Express API server (auth, tasks, messages, notifications, payments) instead of using mock data.
- **MongoDB Database** — All data is persisted in MongoDB using Mongoose ODM. Includes automatic seeding of demo data on first run.
- **JWT Authentication** — Secure login and registration with bcrypt password hashing and JSON Web Token (JWT) based sessions. Tokens are stored in localStorage and sent as Bearer tokens.
- **Authentication Flow** — Login, registration, role selection (Customer / Tasker / Both), and a multi-step tasker onboarding wizard.
- **Task Management** — Create tasks via a step-by-step wizard (Details, Photos, Location, Budget, Time, Preview), browse tasks with search and filters, and view task details. Completed tasks are hidden from the public task list so only their poster (and the assigned worker) can see them on the profile.
- **Advanced Filtering** — Search by keyword, filter by category, budget range, distance radius, minimum rating, and sort by date, price, or distance.
- **Messaging** — Chat interface with conversation list, online indicators, and message bubbles. Real conversations and messages loaded from the API.
- **Notifications** — Notification feed with read/unread state, filter by all or unread, and mark-as-read functionality synced with the backend.
- **Escrow Payment Flow** — Initiate and release payments held in escrow, with a visual EscrowBadge showing payment status.
- **Profile Page** — Editable profile, stats dashboard (completed/active tasks), and task history. "My Posted Tasks" and "Tasks I'm Working On" show active tasks only, while dedicated **"Completed Tasks I Posted"** (poster only) and **"Tasks I Finished"** (worker only) sections list all completed tasks.
- **Loading States** — Skeleton loaders and loading indicators on all pages while data is being fetched from the API.
- **Error Handling** — Graceful fallback states when the backend is unreachable or data is not found.
- **Responsive Design** — Desktop sidebar layout with mobile bottom navigation and a floating action button.
- **Light and Dark Mode** — Full theme support via CSS custom properties.

---

## Tech Stack

| Category        | Technology                                                                 |
| --------------- | -------------------------------------------------------------------------- |
| Framework (FE)  | React 19                                                                    |
| Language        | TypeScript 6                                                                |
| Build Tool      | Vite 8                                                                      |
| Styling         | Tailwind CSS 3, tailwind-merge, clsx                                        |
| State Management| Zustand 5                                                                   |
| Routing         | React Router DOM v7                                                         |
| Forms           | React Hook Form, Zod                                                        |
| UI Components   | Radix UI (Avatar, Dialog, Dropdown Menu, Label, Slot)                       |
| Icons           | Lucide React                                                                |
| Animations      | Framer Motion                                                               |
| Charts          | Recharts                                                                    |
| HTTP Client     | Axios                                                                       |
| Backend Runtime | Node.js                                                                     |
| Backend Framework | Express 4                                                                 |
| Database        | MongoDB with Mongoose ODM                                                   |
| Authentication  | JWT (jsonwebtoken) + bcryptjs password hashing                              |
| Linting         | Oxlint                                                                      |

---

## Project Structure

```
questlyv1/
├── backend/                     # Express API server
│   ├── src/
│   │   ├── index.ts             # Entry point, connects to MongoDB, seeds data, mounts routes
│   │   ├── config/
│   │   │   ├── db.ts            # MongoDB connection using Mongoose
│   │   │   └── seed.ts          # Seeds demo data (users, tasks, conversations, messages, notifications)
│   │   ├── models/              # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Task.ts
│   │   │   ├── Payment.ts
│   │   │   ├── Conversation.ts
│   │   │   ├── Message.ts
│   │   │   └── Notification.ts
│   │   ├── middleware/
│   │   │   └── auth.ts          # JWT Bearer token verification middleware
│   │   ├── controllers/         # Route handler logic (all use MongoDB)
│   │   │   ├── auth.ts
│   │   │   ├── tasks.ts
│   │   │   ├── payments.ts
│   │   │   ├── messages.ts
│   │   │   └── notifications.ts
│   │   └── routes/              # Express route definitions
│   │       ├── auth.ts
│   │       ├── tasks.ts
│   │       ├── payments.ts
│   │       ├── messages.ts
│   │       └── notifications.ts
│   ├── .env                     # Environment variables (MONGODB_URI, JWT_SECRET, PORT)
│   ├── package.json
│   └── tsconfig.json
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── shared/
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── EscrowBadge.tsx
│   │   │   └── TaskCard.tsx
│   │   ├── payments/
│   │   │   ├── PaymentModal.tsx
│   │   │   └── ReleasePaymentButton.tsx
│   │   └── ui/
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       └── label.tsx
│   ├── layouts/
│   │   ├── AuthLayout.tsx
│   │   └── MainLayout.tsx
│   ├── lib/
│   │   ├── api.ts               # Axios client configured for backend (sends JWT Bearer token)
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Home.tsx                 # Dashboard
│   │   ├── NotFound.tsx             # 404 page
│   │   ├── RouteError.tsx           # Router error boundary
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── RoleSelection.tsx
│   │   │   └── TaskerOnboarding.tsx
│   │   ├── tasks/
│   │   │   ├── BrowseTasks.tsx
│   │   │   ├── CreateTask.tsx
│   │   │   ├── Success.tsx
│   │   │   └── TaskDetails.tsx
│   │   ├── profile/
│   │   │   └── ProfilePage.tsx
│   │   ├── messages/
│   │   │   └── MessagesPage.tsx
│   │   └── notifications/
│   │       └── NotificationsPage.tsx
│   ├── routes/
│   │   └── index.tsx
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── paymentStore.ts
│   │   └── taskStore.ts
│   ├── types/
│   │   └── payment.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── package.json
└── README.md
```

---

## Installation and Setup

### Prerequisites

- Node.js (v18 or later)
- npm
- MongoDB (v6 or later) — running locally on port 27017

### 1. Clone the Repository

```bash
git clone https://github.com/SUKESH0321/Questly-V1-TaskAppProject.git
cd Questly-V1-TaskAppProject
```

### 2. Frontend Setup

```bash
# Install frontend dependencies
npm install
```

### 3. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install backend dependencies
npm install
```

### 4. Configure Environment Variables

The backend uses a `.env` file for configuration. A default one is already created:

```env
MONGODB_URI=mongodb://localhost:27017/questly
JWT_SECRET=questly-jwt-secret-change-in-production
PORT=3001
```

Make sure MongoDB is running on your machine before starting the backend.

---

## Running the Project

You need to run both the frontend and the backend simultaneously.

### Start the Backend (API Server)

```bash
cd backend
npm run dev
```

The API server starts at `http://localhost:3001`. On first run, it will:
1. Connect to MongoDB
2. Seed the database with demo data (users, tasks, conversations, messages, notifications)
3. Start listening for API requests

### Start the Frontend (Vite Dev Server)

In a separate terminal:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` and is configured to connect to the backend at `http://localhost:3001`.

> **Note:** The frontend automatically sends the JWT token (stored in localStorage as `questly_token`) as a Bearer token with every authenticated API request.

### Demo Accounts

After seeding, you can log in with any of these accounts:

| Name            | Email                  | Password      | Role     |
| --------------- | ---------------------- | ------------- | -------- |
| Sukesh          | sukesh@example.com     | password123   | Customer |
| Sarah Jenkins   | sarah@example.com      | password123   | Tasker   |
| Michael Chen    | michael@example.com    | password123   | Tasker   |

### Other Commands

```bash
# Build frontend for production
npm run build

# Preview the production build
npm run preview

# Lint the codebase
npm run lint

# Build backend for production
cd backend && npm run build

# Start backend in production mode
cd backend && npm start
```

---

## API Endpoints

| Method | Endpoint                                  | Auth Required | Description                |
| ------ | ----------------------------------------- | ------------- | -------------------------- |
| POST   | `/api/auth/register`                      | No            | Register a new user        |
| POST   | `/api/auth/login`                         | No            | Login                      |
| GET    | `/api/auth/me`                            | Yes           | Get current user           |
| PATCH  | `/api/auth/me`                            | Yes           | Update current user        |
| GET    | `/api/tasks`                              | No            | List tasks (with filters); excludes completed tasks |
| GET    | `/api/tasks/posted`                       | Yes           | Current user's posted tasks (incl. completed)       |
| GET    | `/api/tasks/worked`                       | Yes           | Current user's worked tasks (incl. completed)       |
| GET    | `/api/tasks/:id`                          | No            | Get task by ID             |
| POST   | `/api/tasks`                              | Yes           | Create a task              |
| PATCH  | `/api/tasks/:id`                          | Yes           | Update a task              |
| POST   | `/api/tasks/:id/assign`                   | Yes           | Assign a worker to a task  |
| POST   | `/api/payments/initiate`                  | Yes           | Initiate payment           |
| POST   | `/api/payments/release/:taskId`           | Yes           | Release held payment       |
| GET    | `/api/payments/mine`                      | Yes           | Get current user's payments|
| GET    | `/api/payments/:taskId`                   | Yes           | Get payment by task ID     |
| GET    | `/api/conversations`                      | Yes           | List user conversations    |
| POST   | `/api/conversations`                      | Yes           | Create a conversation      |
| GET    | `/api/conversations/:id`                  | Yes           | Get conversation by ID     |
| GET    | `/api/conversations/:id/messages`         | Yes           | Get messages               |
| POST   | `/api/conversations/:id/messages`         | Yes           | Send a message             |
| GET    | `/api/notifications`                      | Yes           | List notifications         |
| PATCH  | `/api/notifications/:id/read`             | Yes           | Mark notification as read  |
| PATCH  | `/api/notifications/read-all`             | Yes           | Mark all as read           |
| GET    | `/api/health`                             | No            | Health check               |

> **Auth Required** endpoints expect a `Authorization: Bearer <token>` header. The token is obtained from the login or register response.

---

## Routes

| Route                | Page                  | Layout      |
| -------------------- | --------------------- | ----------- |
| `/`                  | Login                 | AuthLayout  |
| `/login`             | Login                 | AuthLayout  |
| `/register`          | Register              | AuthLayout  |
| `/role-selection`    | Choose Role           | AuthLayout  |
| `/onboarding`        | Tasker Onboarding     | AuthLayout  |
| `/home`              | Dashboard (Home)      | MainLayout  |
| `/tasks`             | Browse Tasks          | MainLayout  |
| `/tasks/create`      | Create Task           | MainLayout  |
| `/tasks/success`     | Task Posted           | MainLayout  |
| `/tasks/:id`         | Task Details          | MainLayout  |
| `/profile`           | User Profile          | MainLayout  |
| `/messages`          | Messages              | MainLayout  |
| `/notifications`     | Notifications         | MainLayout  |
| `*`                  | Not Found (404)       | —           |

> Routes under `MainLayout` are wrapped in a `ProtectedRoute` that redirects unauthenticated users to `/login`. The tasker onboarding wizard requires a `tasker` role to complete.

---

## What Changed (In-Memory → MongoDB Migration)

The original backend used an in-memory data store (`backend/src/data/store.ts`) with hardcoded arrays. This has been fully replaced with MongoDB:

| Before                          | After                                    |
| ------------------------------- | ---------------------------------------- |
| In-memory arrays in store.ts    | Mongoose models with MongoDB persistence |
| Plaintext password comparison   | bcrypt password hashing                  |
| `x-user-id` header auth         | JWT Bearer token authentication          |
| Data resets on server restart   | Data persists in MongoDB                 |
| Manual data setup               | Automatic seeding on first run           |

---

## Future Enhancements

- Interactive map view using Google Maps or Mapbox
- Image upload for tasks and profile pictures
- Real-time messaging via WebSockets
- Push notifications
- Payment gateway with in-app escrow
- User reviews and ratings for completed tasks
- Unit and integration tests (Vitest, Testing Library)

---

## Contributors

- Sukesh — [@SUKESH0321](https://github.com/SUKESH0321)

Contributions are welcome. Please open an issue or submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).