var admin = require("firebase-admin");

var serviceAccount = require("./designare-d73bc-firebase-adminsdk-t0zrw-8b4e5b52ea.json");

try {
  // admin.initializeApp({
  //   credential: admin.credential.cert({
  //     projectId: process.env.FIREBASE_PROJECT_ID,
  //     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  //     privateKey: process.env.FIREBASE_PRIVATE_KEY,
  //   }),
  // });
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error("Firebase admin initialization error", error);
}

export default admin;
