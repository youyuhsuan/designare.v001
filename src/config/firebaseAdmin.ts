var admin = require("firebase-admin");

var serviceAccount = require(".designare-d73bc-firebase-adminsdk-t0zrw-8b4e5b52ea.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
