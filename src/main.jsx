import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "../app/root.jsx";

// GitHub Pages SPA: Vanilla React + React Router
// No React Router Framework Mode
// Pure client-side with BrowserRouter

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/japanese-cards/">
      <App />
    </BrowserRouter>
  </StrictMode>
);
