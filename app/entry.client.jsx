import { RouterProvider, createHashRouter } from "react-router/dom";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import routes from "./routes";

// Create hash-based router for GitHub Pages
// URLs will look like: /japanese-cards/#/content/hiragana/a
const router = createHashRouter(routes, {
  basename: "/japanese-cards/",
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
});
