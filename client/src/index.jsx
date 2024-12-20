import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Navbar from "./Pages/Navbar/index.js";
import AiToolsPage from "./Pages/AiToolsPage.jsx";
import ClassListPage from "./Pages/ClassListPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import MainPage from "./Pages/MainPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/classlist",
        element: <ClassListPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/aitools",
        element: <AiToolsPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
