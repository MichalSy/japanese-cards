import { HydratedRouter } from "react-router/dom";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

// GitHub Pages SPA fix: Restore the original URL
if (sessionStorage.redirect) {
  const redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  window.history.replaceState(null, null, redirect);
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
