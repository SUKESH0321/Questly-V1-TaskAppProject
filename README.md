# Questly

A hyperlocal task marketplace application for posting, browsing, and managing local tasks. Built with React, TypeScript, and Vite (frontend) and Express + MongoDB (backend).

---

## Features

- **Full Frontend-Backend Integration** — All pages fetch real data from an Express API server (auth, tasks, messages, notifications, payments) instead of using mock data.
- **MongoDB Database** — All data is persisted in MongoDB using Mongoose ODM. Includes automatic seeding of demo data on first run.
- **JWT Authentication** — Secure login and registration with bcrypt password hashing and JSON Web Token (JWT) based sessions. Tokens are stored in localStorage and sent as Bearer tokens.
- **Authentication Flow** — Login, registration, role selection (Customer / Tasker / Both), and a multi-step tasker onboarding wizard.
- **Task Management** — Create tasks via a step-by-step wizard (Details, Photos, Location, Budget, Time, Preview), browse tasks with search and filters, view task details, and track posted tasks.
- **Advanced Filtering** — Search by keyword, filter by category, budget range, distance radius, minimum rating, and sort by date, price, or distance.
- **Messaging** — Chat interface with conversation list, online indicators, and message bubbles. Real conversations and messages loaded from the API.
- **Notifications** — Notification feed with read/unread state, filter by all or unread, and mark-as-read functionality synced with the backend.
- **Escrow Payment Flow** — Initiate and release payments held in escrow, with a visual EscrowBadge showing payment status.
- **Profile Page** — Editable profile, stats dashboard (completed/active tasks), task history filtered by user ID, and settings.
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
│   │   ├── Home.tsx
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
git clone https://github.com/your-username/questlyv1.git
cd questlyv1
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

| Method | Endpoint                                  | Auth Required | Description               |
| ------ | ----------------------------------------- | ------------- | ------------------------- |
| POST   | `/api/auth/register`                      | No            | Register a new user       |
| POST   | `/api/auth/login`                         | No            | Login                     |
| GET    | `/api/auth/me`                            | Yes           | Get current user          |
| GET    | `/api/tasks`                              | No            | List tasks (with filters) |
| GET    | `/api/tasks/:id`                          | No            | Get task by ID            |
| POST   | `/api/tasks`                              | Yes           | Create a task             |
| PATCH  | `/api/tasks/:id`                          | Yes           | Update a task             |
| POST   | `/api/payments/initiate`                  | Yes           | Initiate payment          |
| POST   | `/api/payments/release/:taskId`           | Yes           | Release held payment      |
| GET    | `/api/payments/:taskId`                   | Yes           | Get payment by task ID    |
| GET    | `/api/conversations`                      | Yes           | List user conversations   |
| GET    | `/api/conversations/:id/messages`         | Yes           | Get messages              |
| POST   | `/api/conversations/:id/messages`         | Yes           | Send a message            |
| GET    | `/api/notifications`                      | Yes           | List notifications        |
| PATCH  | `/api/notifications/:id/read`             | Yes           | Mark notification as read |
| PATCH  | `/api/notifications/read-all`             | Yes           | Mark all as read          |
| GET    | `/api/health`                             | No            | Health check              |

> **Auth Required** endpoints expect a `Authorization: Bearer <token>` header. The token is obtained from the login or register response.

---

## Routes

| Route                     | Page                  | Layout      |
| ------------------------- | --------------------- | ----------- |
| `/`                       | Dashboard             | MainLayout  |
| `/tasks`                  | Browse Tasks          | MainLayout  |
| `/tasks/create`           | Create Task           | MainLayout  |
| `/tasks/success`          | Task Posted           | MainLayout  |
| `/tasks/:id`              | Task Details          | MainLayout  |
| `/profile`                | User Profile          | MainLayout  |
| `/messages`               | Messages              | MainLayout  |
| `/notifications`          | Notifications         | MainLayout  |
| `/auth/login`             | Login                 | AuthLayout  |
| `/auth/register`          | Register              | AuthLayout  |
| `/auth/role-selection`    | Choose Role           | AuthLayout  |
| `/auth/onboarding`        | Tasker Onboarding     | AuthLayout  |

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

- Your Name — [@your-username](https://github.com/your-username)

Contributions are welcome. Please open an issue or submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).