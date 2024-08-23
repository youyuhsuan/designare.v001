var admin = require("firebase-admin");

var serviceAccount = require("@/src/config/designare-d73bc-firebase-adminsdk-t0zrw-8b4e5b52ea.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Firebase admin initialization error", error);
}

export default admin;
