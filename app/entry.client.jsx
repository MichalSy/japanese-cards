import { HydratedRouter } from "react-router/dom";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

// Convert traditional URLs to hash-based routing for GitHub Pages compatibility
const convertPathToHash = () => {
  const pathname = window.location.pathname;
  const search = window.location.search;
  
  // Only convert if we're at /japanese-cards/* but not at /#/*
  if (pathname.startsWith('/japanese-cards/') && !window.location.hash) {
    // Extract the path after /japanese-cards/
    const relativePath = pathname.replace(/^\/japanese-cards\/?/, '') || '/';
    const newUrl = `${window.location.protocol}//${window.location.host}/japanese-cards/#${relativePath}${search}`;
    window.history.replaceState(null, '', newUrl);
  }
};

// Convert before React hydrates
convertPathToHash();

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
