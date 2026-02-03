import { HydratedRouter } from "react-router/dom";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

// GitHub Pages SPA: 404.html serves index.html for all unknown routes
// React Router then handles the routing based on the URL

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
