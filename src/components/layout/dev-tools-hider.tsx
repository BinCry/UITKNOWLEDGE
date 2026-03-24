"use client";

import { useEffect } from "react";

const hideDevToolsButton = () => {
  const portal = document.querySelector("nextjs-portal");
  const shadowRoot = portal?.shadowRoot;

  if (!shadowRoot) return;

  const button = shadowRoot.querySelector<HTMLButtonElement>(
    'button[aria-label*="Next.js Dev Tools"], button[aria-label*="Next.js Developer Tools"]',
  );

  if (button) {
    button.style.display = "none";
  }
};

export function DevToolsHider() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    hideDevToolsButton();

    const intervalId = window.setInterval(hideDevToolsButton, 500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return null;
}
