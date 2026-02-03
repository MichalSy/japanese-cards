import { HydratedRouter } from "react-router/dom";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

// GitHub Pages SPA with Client-Side Routing
// - Browser requests /japanese-cards/content/hiragana
// - GitHub Pages finds no file → serves 404.html (which is index.html)
// - React loads and hydrates with pathname
// - React Router strips basename and routes to /content/hiragana
// - Correct component renders
// No hash conversion or history API interception needed!

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
