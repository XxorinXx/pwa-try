import { useState } from "react";

type StatusType = "idle" | "loading" | "success" | "error";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function App() {
  const [status, setStatus] = useState<StatusType>("idle");
  const [message, setMessage] = useState<string>("");
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  const handleEnableNotifications = async () => {
    console.log("VAPID PUBLIC KEY:", VAPID_PUBLIC_KEY);
    setStatus("loading");
    setMessage("");

    try {
      if (typeof window === "undefined") {
        throw new Error("Window is not available.");
      }

      if (!("Notification" in window)) {
        throw new Error("Notifications are not supported in this browser.");
      }

      if (!("serviceWorker" in navigator)) {
        throw new Error("Service workers are not supported in this browser.");
      }

      if (Notification.permission === "denied") {
        throw new Error("Notifications are blocked. Enable them in browser settings.");
      }

      // 1. Ask for permission if needed
      let permission = Notification.permission as NotificationPermission;
      if (permission === "default") {
        permission = await Notification.requestPermission();
      }

      if (permission !== "granted") {
        throw new Error("Notification permission was not granted.");
      }

      // 2. Wait for the PWA service worker to be ready
      const registration = await navigator.serviceWorker.ready;

      // 3. Check if already subscribed
      const existing = await registration.pushManager.getSubscription();
      if (existing) {
        setSubscription(existing);
        setStatus("success");
        setMessage("Already subscribed to push notifications.");
        console.log("Existing subscription:", JSON.stringify(existing.toJSON(), null, 2));
        return;
      }

      if (!VAPID_PUBLIC_KEY) {
        console.warn("VITE_VAPID_PUBLIC_KEY is empty. Add it to your .env file for real push.");
      }

      const subscribeOptions: PushSubscriptionOptionsInit = {
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY
          ? (urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as unknown as BufferSource)
          : undefined,
      };

      // 4. Create a new subscription
      const newSubscription = await registration.pushManager.subscribe(subscribeOptions);

      setSubscription(newSubscription);
      setStatus("success");
      setMessage("Successfully subscribed to push notifications.");

      console.log("New subscription:", JSON.stringify(newSubscription.toJSON(), null, 2));
    } catch (err: unknown) {
      console.error(err);
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to enable notifications.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#020617",
        color: "#e5e7eb",
      }}
    >
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>My Vite + React PWA</h1>

      <p style={{ marginBottom: "1rem", color: "#9ca3af" }}>Basic PWA setup. Next step: Web Push notifications.</p>

      <p style={{ marginBottom: "1.5rem", fontSize: "0.9rem", color: "#64748b" }}>
        Install this app from your browser menu (&quot;Install app&quot; / &quot;Add to Home screen&quot;), then try
        enabling notifications.
      </p>

      <button
        onClick={handleEnableNotifications}
        disabled={status === "loading"}
        style={{
          alignSelf: "flex-start",
          padding: "0.6rem 1.1rem",
          borderRadius: "999px",
          border: "none",
          cursor: status === "loading" ? "default" : "pointer",
          fontSize: "0.95rem",
          fontWeight: 500,
          background: status === "success" ? "#16a34a" : status === "error" ? "#dc2626" : "#2563eb",
          color: "#f9fafb",
          opacity: status === "loading" ? 0.8 : 1,
          transition: "transform 0.1s ease, opacity 0.1s ease",
        }}
      >
        {status === "loading" ? "Enabling…" : "Enable notifications"}
      </button>

      {message && (
        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "0.9rem",
            color: status === "error" ? "#fecaca" : status === "success" ? "#bbf7d0" : "#e5e7eb",
          }}
        >
          {message}
        </p>
      )}

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          borderRadius: "0.75rem",
          background: "#020617",
          border: "1px solid #1f2937",
          fontSize: "0.8rem",
          color: "#9ca3af",
          maxWidth: "100%",
          overflowX: "auto",
        }}
      >
        <div style={{ marginBottom: "0.3rem", fontWeight: 500 }}>Notification permission:</div>
        <div style={{ marginBottom: "0.75rem" }}>{Notification.permission}</div>

        <div style={{ marginBottom: "0.3rem", fontWeight: 500 }}>Push subscription (preview):</div>
        {subscription ? (
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {JSON.stringify(subscription.toJSON(), null, 2)}
          </pre>
        ) : (
          <span>No subscription yet.</span>
        )}
      </div>
    </div>
  );
}

export default App;
