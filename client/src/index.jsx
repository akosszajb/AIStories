import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Navbar from "./Pages/Navbar/index.js";
import AiToolsPage from "./Pages/AiToolsPage.jsx";
import CharacterCreatorPage from "./Pages/CharacterCreatorPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import MainPage from "./Pages/MainPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";
import StoryGeneratorPage from "./Pages/StoryGeneratorPage.jsx";

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
        path: "/charactercreator",
        element: <CharacterCreatorPage />,
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
      {
        path: "/storygeneratorpage",
        element: <StoryGeneratorPage />,
      },
    ],
  },
]);
