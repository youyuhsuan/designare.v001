var admin = require("firebase-admin");

var serviceAccount = require("./designare-d73bc-firebase-adminsdk-t0zrw-8b4e5b52ea.json");

try {
  // admin.initializeApp({
  //   credential: admin.credential.cert({
  //     type: process.env.FIREBASE_TYPE,
  //     projectId: process.env.FIREBASE_PROJECT_ID,
  //     private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  //     private_key: process.env.FIREBASE_PRIVATE_KEY,
  //     client_email: process.env.FIREBASE_CLIENT_EMAIL,
  //     client_id: process.env.FIREBASE_CLIENT_ID,
  //     auth_uri: process.env.FIREBASE_AUTH_URI,
  //     token_uri: process.env.FIREBASE_TOKEN_URI,
  //     auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  //     client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  //     universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
  //   }),
  // });
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error("Firebase admin initialization error", error);
}

export default admin;
