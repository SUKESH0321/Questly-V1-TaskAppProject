# Questly

A hyperlocal task marketplace application for posting, browsing, and managing local tasks. Built with React, TypeScript, and Vite (frontend) and Express (backend).

---

## Features

- **Full Frontend-Backend Integration** — All pages fetch real data from an Express API server (auth, tasks, messages, notifications, payments) instead of using mock data.
- **Authentication Flow** — Login, registration, role selection (Customer / Tasker / Both), and a multi-step tasker onboarding wizard. Sessions persist via API-backed user IDs stored in localStorage.
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
| Linting         | Oxlint                                                                      |

---

## Project Structure

```
questlyv1/
├── backend/                     # Express API server
│   ├── src/
│   │   ├── index.ts             # Entry point, mounts all routes
│   │   ├── types/index.ts       # Shared TypeScript interfaces
│   │   ├── data/store.ts        # In-memory mock data
│   │   ├── middleware/auth.ts   # Auth middleware (x-user-id header)
│   │   ├── controllers/         # Route handler logic
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
│   │   ├── api.ts               # Axios client configured for backend
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

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/your-username/questlyv1.git
cd questlyv1

# Install frontend dependencies
npm install
```

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install backend dependencies
npm install
```

---

## Running the Project

You need to run both the frontend and the backend simultaneously.

### Start the Backend (API Server)

```bash
cd backend
npm run dev
```

The API server starts at `http://localhost:3001`.

### Start the Frontend (Vite Dev Server)

In a separate terminal:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` and is configured to connect to the backend at `http://localhost:3001`.

> **Note:** The frontend automatically sends the logged-in user's ID as the `x-user-id` header with every API request. No JWT tokens or database are used yet — authentication is handled via simple email/password matching against the in-memory store.

### Other Commands

```bash
# Build frontend for production
npm run build

# Preview the production build
npm run preview

# Lint the codebase
npm run lint
```

---

## API Endpoints

| Method | Endpoint                                  | Description               |
| ------ | ----------------------------------------- | ------------------------- |
| POST   | `/api/auth/register`                      | Register a new user       |
| POST   | `/api/auth/login`                         | Login                     |
| GET    | `/api/auth/me`                            | Get current user          |
| GET    | `/api/tasks`                              | List tasks (with filters) |
| GET    | `/api/tasks/:id`                          | Get task by ID            |
| POST   | `/api/tasks`                              | Create a task             |
| PATCH  | `/api/tasks/:id`                          | Update a task             |
| POST   | `/api/payments/initiate`                  | Initiate payment          |
| POST   | `/api/payments/release/:taskId`           | Release held payment      |
| GET    | `/api/payments/:taskId`                   | Get payment by task ID    |
| GET    | `/api/conversations`                      | List user conversations   |
| GET    | `/api/conversations/:id/messages`         | Get messages              |
| POST   | `/api/conversations/:id/messages`         | Send a message            |
| GET    | `/api/notifications`                      | List notifications        |
| PATCH  | `/api/notifications/:id/read`             | Mark notification as read |
| PATCH  | `/api/notifications/read-all`             | Mark all as read          |
| GET    | `/api/health`                             | Health check              |

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

## Future Enhancements

- JWT-based authentication with token persistence
- Interactive map view using Google Maps or Mapbox
- Image upload for tasks and profile pictures
- Real-time messaging via WebSockets
- Push notifications
- Payment gateway with in-app escrow
- User reviews and ratings for completed tasks
- PostgreSQL or MongoDB database (currently uses in-memory arrays)
- Unit and integration tests (Vitest, Testing Library)

---

## Contributors

- Your Name — [@your-username](https://github.com/your-username)

Contributions are welcome. Please open an issue or submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).