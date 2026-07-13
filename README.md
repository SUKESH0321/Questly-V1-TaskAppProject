# Questly

A hyperlocal task marketplace frontend application for posting, browsing, and managing local tasks. Built with React, TypeScript, and Vite.

---

## Features

- **Authentication Flow** — Login, registration, role selection (Customer / Tasker / Both), and a multi-step tasker onboarding wizard.
- **Task Management** — Create tasks via a step-by-step wizard (Details, Photos, Location, Budget, Time, Preview), browse tasks with search and filters, view task details, and track posted tasks.
- **Advanced Filtering** — Search by keyword, filter by category, budget range, distance radius, minimum rating, and sort by date, price, or distance.
- **Messaging UI** — Chat interface with conversation list, online indicators, and message bubbles.
- **Notifications** — Notification feed with read/unread state, filter by all or unread, and mark-as-read functionality.
- **Profile Page** — Editable profile, stats dashboard (completed/active tasks), task history, and settings.
- **Responsive Design** — Desktop sidebar layout with mobile bottom navigation and a floating action button.
- **Light and Dark Mode** — Full theme support via CSS custom properties.

---

## Tech Stack

| Category        | Technology                                                                 |
| --------------- | -------------------------------------------------------------------------- |
| Framework       | React 19                                                                    |
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
| Linting         | Oxlint                                                                      |

---

## Project Structure

```
questlyv1/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── shared/
│   │   │   ├── CategoryCard.tsx
│   │   │   └── TaskCard.tsx
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
│   │   └── taskStore.ts
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

### Steps

```bash
# Clone the repository
git clone https://github.com/your-username/questlyv1.git
cd questlyv1

# Install dependencies
npm install
```

---

## Running the Project

```bash
# Start the development server (with Hot Module Replacement)
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview

# Lint the codebase
npm run lint
```

The development server runs at `http://localhost:5173` by default.

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

- Backend integration with a real API (Node.js, Express, or Firebase)
- JWT-based authentication with token persistence
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