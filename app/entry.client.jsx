import { HydratedRouter } from "react-router/dom";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

// Override history API to automatically convert traditional URLs to hash URLs
const originalPushState = window.history.pushState;
const originalReplaceState = window.history.replaceState;

window.history.pushState = function(state, title, url) {
  if (url && typeof url === 'string' && !url.includes('#')) {
    // Convert traditional URL to hash URL
    const hashUrl = url.replace(/^\/japanese-cards\//, '/japanese-cards/#');
    return originalPushState.call(this, state, title, hashUrl);
  }
  return originalPushState.call(this, state, title, url);
};

window.history.replaceState = function(state, title, url) {
  if (url && typeof url === 'string' && !url.includes('#')) {
    // Convert traditional URL to hash URL
    const hashUrl = url.replace(/^\/japanese-cards\//, '/japanese-cards/#');
    return originalReplaceState.call(this, state, title, hashUrl);
  }
  return originalReplaceState.call(this, state, title, url);
};

// Convert initial URL if needed
const convertPathToHash = () => {
  const pathname = window.location.pathname;
  const search = window.location.search;
  
  // Only convert if we're at /japanese-cards/* but not at /#/*
  if (pathname.startsWith('/japanese-cards/') && !window.location.hash) {
    // Extract the path after /japanese-cards/
    const relativePath = pathname.replace(/^\/japanese-cards\/?/, '');
    const hashPath = relativePath ? `/#${relativePath}` : `/#/`;
    const newUrl = `${window.location.protocol}//${window.location.host}/japanese-cards/${hashPath}${search}`;
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
