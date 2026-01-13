const admin = require("firebase-admin");

// Download a service account key from Firebase Console:
// Project settings → Service accounts → "Generate new private key"
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
});

async function run() {
  const uid = process.argv[2];
  if (!uid) throw new Error("Usage: node setOwner.js <UID>");
  const user = await admin.auth().getUser(uid);
  const claims = user.customClaims || {};
  claims.owner = true;
  await admin.auth().setCustomUserClaims(uid, claims);
  console.log("Owner claim set for", uid);
}
run().catch(e=>{ console.error(e); process.exit(1); });

