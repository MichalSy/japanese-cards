import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { route, index } from "@react-router/dev/routes";
import MainMenu from "./pages/MainMenu.jsx";
import ContentTypeView from "./pages/ContentTypeView.jsx";
import GameModeSelector from "./pages/GameModeSelector.jsx";
import GameScreen from "./pages/GameScreen.jsx";
import App from "./root.jsx";

// GitHub Pages SPA: Pure Client-Side with Static Routes
// No SSR, no lazy route discovery, no __manifest HTTP fetch
// Routes hardcoded here, not loaded from manifest
// GitHub Pages 404.html serves index.html for all routes

const routes = [
  {
    id: "root",
    element: <App />,
    children: [
      { index: true, element: <MainMenu /> },
      { path: "content/:contentType", element: <ContentTypeView /> },
      { path: "content/:contentType/:groupId", element: <GameModeSelector /> },
      { path: "game/:contentType/:groupId/:modeId", element: <GameScreen /> },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: "/japanese-cards/",
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
