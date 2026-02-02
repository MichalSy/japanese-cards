import { HydratedRouter } from "react-router/dom";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

// Restore URL from sessionStorage if coming from 404.html redirect
const redirect = sessionStorage.getItem('redirect');
if (redirect) {
  const fullPath = `/japanese-cards${redirect}`;
  window.history.replaceState(null, '', fullPath);
  sessionStorage.removeItem('redirect');
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
