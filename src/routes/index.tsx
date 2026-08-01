import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import RoleSelection from "@/pages/auth/RoleSelection";
import TaskerOnboarding from "@/pages/auth/TaskerOnboarding";

import CreateTask from "@/pages/tasks/CreateTask";
import TaskSuccess from "@/pages/tasks/Success";
import BrowseTasks from "@/pages/tasks/BrowseTasks";
import TaskDetails from "@/pages/tasks/TaskDetails";
import Home from "@/pages/Home";
import ProfilePage from "@/pages/profile/ProfilePage";
import MessagesPage from "@/pages/messages/MessagesPage";
import NotificationsPage from "@/pages/notifications/NotificationsPage";
import NotFound from "@/pages/NotFound";
import RouteError from "@/pages/RouteError";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "role-selection", element: <RoleSelection /> },
      { path: "onboarding", element: <TaskerOnboarding /> },
    ],
  },
  {
    element: <MainLayout />,
    errorElement: <RouteError />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/tasks", element: <BrowseTasks /> },
      { path: "/tasks/create", element: <CreateTask /> },
      { path: "/tasks/success", element: <TaskSuccess /> },
      { path: "/tasks/:id", element: <TaskDetails /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/messages", element: <MessagesPage /> },
      { path: "/notifications", element: <NotificationsPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);