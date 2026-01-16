import webPush from "web-push";

// 1. Put your own VAPID keys here (from `web-push generate-vapid-keys`)
const vapidKeys = {
  publicKey: "BKKPMtP7HMU6gI6KixwirwUPogo_IJS_AlVR81FQyZPs74fj9PoVjprTsuZgrzDi0yfHnf6P8abEi8s_AXgM4W0",
  privateKey: "ZqclePc8OqVS4ODjJ1AIxfZw-hpOsJV7TrmnazlN_j4",
};

// 2. Tell web-push who you are (any email you control)
webPush.setVapidDetails("mailto:you@example.com", vapidKeys.publicKey, vapidKeys.privateKey);

// 3. Paste your subscription JSON from the app (exactly as logged)
const subscription = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/f3OvE7lWHO0:APA91bGXGMglnopVzEG4lVXyqEEoicS53ALf9b7r1QYoEyoUjm5hemNCWFYUq0NU0sZMiiZQ-97mE8-VuTyh7ZRkVY4Z6sXFgmBvx95rH78wFvuRBaeE6kw-V83pPWHv1wk9unZv-s5l",
  expirationTime: null,
  keys: {
    p256dh: "BJLgJJK1TavZoVGEYSrnfM0xoTg1TYjzq8TtKYQi2l5Lw3yCs5s-0wU-BtoGW4AM-mP5tykQZxo6PRUCfnr5Rls",
    auth: "-rBwoqwy6BAYGi3oIPqJdg",
  },
};

// 4. Payload for the notification
const payload = JSON.stringify({
  title: "Hello from web-push 👋",
  body: "If you see this, your PWA push setup works.",
  url: "/", // optional: where to open when clicking
});

async function main() {
  try {
    const res = await webPush.sendNotification(subscription, payload);
    console.log("Push sent! Status:", res.statusCode);
    console.log(res.body || "");
  } catch (err) {
    console.error("Error sending push:", err);
  }
}

main();
