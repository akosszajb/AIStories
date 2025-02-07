import React from "react";
import ReactDOM from "react-dom/client";
import "./globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Navbar from "./Components/Common/Navbar/index.js";
import AiToolsPage from "./Components/Pages/AIToolsPage/AiToolsPage.jsx";
import GameCharacterCreatorPage from "./Components/Pages/GameCharacterCreatorPage.jsx";
import LoginPage from "./Components/Pages/LoginPage.jsx";
import MainPage from "./Components/Pages/MainPage/MainPage.jsx";
import RegisterPage from "./Components/Pages/RegisterPage.jsx";
import PlotGeneratorPage from "./Components/Pages/PlotGeneratorPage/PlotGeneratorPage.jsx";
import PlotSettingsPage from "./Components/Pages/PlotSettingsPage/PlotSettingsPage.jsx";
import UserProfilePage from "./Components/Pages/UserProfilePage/UserProfile.jsx";
import PlotCharacterPage from "./Components/Pages/PlotCharacterPage/PlotCharacterPage.jsx";

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
        path: "/gamecharactercreator",
        element: <GameCharacterCreatorPage />,
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
        path: "/plotgeneratorpage",
        element: <PlotGeneratorPage />,
      },
      { path: "/plotsettingspage", element: <PlotSettingsPage /> },
      { path: "/userprofile", element: <UserProfilePage /> },
      { path: "/plotcharacterpage", element: <PlotCharacterPage /> },
    ],
  },
]);
