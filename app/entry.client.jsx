import { HydratedRouter } from "react-router/dom";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

// GitHub Pages SPA with Hash-based routing
// Note: Remix HydratedRouter uses history mode from context
// For GitHub Pages, routes will use hash (#/content/hiragana)

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
