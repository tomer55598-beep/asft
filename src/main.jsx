import React from "react";
import { createRoot } from "react-dom/client";
import "./storage.js";
import "./index.css";
import DayBoard from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DayBoard />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // The app still works without the service worker.
    });
  });
}
