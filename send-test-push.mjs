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
    "https://fcm.googleapis.com/fcm/send/ebjpFNN59lE:APA91bEb2n9CEDhUz65sH4TT-KRxTGMGINCr-pbzGE5cYA5TH0kiexyrJ1XfqEuQgNDWmWlnv0Yitf2VH4rS_4xOh78OCCASM9GkiOe2bP-pmPb7DkzmLo5SHgElxPRu1weNqpV4nLvB",
  expirationTime: null,
  keys: {
    p256dh: "BAXvBRRe48YBtJKyQpndn3TDjFgffjwpvp6aLpwZRavf3ofX3AbFvAh__L0qM-mtaPyYylBrPjpnlGEA7I0GpdA",
    auth: "04f4Y_hxRzhaDOKGjWJtQQ",
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
