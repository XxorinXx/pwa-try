import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 👇 This virtual import is provided by vite-plugin-pwa
import { registerSW } from "virtual:pwa-register";

registerSW({
  onNeedRefresh() {
    // later we can show a toast: "New version available"
    console.log("New content available, refresh to update.");
  },
  onOfflineReady() {
    console.log("App ready to work offline.");
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
