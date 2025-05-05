const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
admin.initializeApp();

// Configure your SMTP transporter (e.g. Gmail OAuth2 or Mailtrap)
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 587,
  auth: {
    user: functions.config().smtp.user,
    pass: functions.config().smtp.pass,
  },
});

// Firestore collection: 'passwordOtps' (doc ID = user email)
const db = admin.firestore();

exports.sendOtp = functions.https.onRequest(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send("Missing email");

  // 1) Generate 6‑digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // 2) Store in Firestore with 10‑minute expiry
  await db.collection("passwordOtps").doc(email).set({
    code,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // 3) Send OTP email
  const mailOptions = {
    from: "noreply@yourapp.com",
    to: email,
    subject: "Your password reset code",
    text: `Your OTP code is: ${code}`,
  };
  await transporter.sendMail(mailOptions);

  return res.send("OTP sent");
});

exports.verifyOtp = functions.https.onRequest(async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).send("Missing params");

  const snap = await db.collection("passwordOtps").doc(email).get();
  if (!snap.exists) return res.status(400).send("No OTP found");

  const data = snap.data();
  const age = Date.now() - data.createdAt.toMillis();
  if (age > 10 * 60 * 1000) { // 10 min
    return res.status(400).send("OTP expired");
  }
  if (data.code !== code) return res.status(400).send("Invalid OTP");

  // Valid → delete OTP to prevent reuse
  await db.collection("passwordOtps").doc(email).delete();
  return res.send("Verified");
});
