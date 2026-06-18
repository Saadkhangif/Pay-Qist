import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import axios from 'axios';

dotenv.config(); // Load environment variables from .env file

// Initialize Firebase Admin
// Note: You must set the GOOGLE_APPLICATION_CREDENTIALS environment variable
// pointing to your downloaded Firebase Service Account JSON file.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const app = express();
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Parse JSON requests

// ===============================
// 1. AUTHENTICATION ROUTES
// ===============================
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Create the new user in Firebase Auth
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Set custom claims (assign admin role if email matches)
    const targetRole = email.toLowerCase() === 'admin@payqist.com' ? 'ADMIN' : 'CUSTOMER';
    await getAuth().setCustomUserClaims(userRecord.uid, { role: targetRole });

    // 3. Respond with the user profile
    res.json({ user: { id: userRecord.uid, name: userRecord.displayName, email: userRecord.email, role: targetRole } });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Internal server error during signup.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const API_KEY = process.env.FIREBASE_API_KEY;
    if (!API_KEY) throw new Error("FIREBASE_API_KEY is not set in .env");

    // 1. Firebase Admin SDK doesn't natively verify passwords. 
    // We use the Identity Toolkit REST API to log in and get a Firebase ID Token.
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      { email, password, returnSecureToken: true }
    );

    const { idToken, localId } = response.data;

    // 2. Fetch user to retrieve role from custom claims
    const userRecord = await getAuth().getUser(localId);
    const role = userRecord.customClaims?.role || 'customer';

    // 3. Respond with the token and user profile
    res.json({
      token: idToken,
      user: { id: localId, name: userRecord.displayName, email: userRecord.email, role }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid email or password.' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

// ===============================
// 2. PRODUCT ROUTES
// ===============================
app.get('/api/products', async (req, res) => {
  // TODO: Fetch products from MongoDB
  res.json([]);
});

app.post('/api/products', async (req, res) => {
  // TODO: Insert product into MongoDB
  const product = { id: Date.now().toString(), ...req.body };
  res.json(product);
});

app.put('/api/products/:id', async (req, res) => {
  // TODO: Update product in MongoDB
  res.json({ success: true });
});

app.delete('/api/products/:id', async (req, res) => {
  // TODO: Delete product from MongoDB
  res.json({ success: true });
});

// ===============================
// 3. CHECKOUT & ORDERS ROUTES
// ===============================
app.get('/api/orders', async (req, res) => res.json([]));
app.get('/api/payments', async (req, res) => res.json([]));

app.post('/api/checkout', async (req, res) => {
  // TODO: Process cart, insert orders/payments into MongoDB
  const { cart, user, paymentMethod } = req.body;
  res.json({ createdOrders: [], createdPayments: [] });
});

// ===============================
// 4. USER MANAGEMENT ROUTES
// ===============================
app.get('/api/users', async (req, res) => res.json([]));
app.put('/api/users/:id/role', async (req, res) => res.json({ success: true }));

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 8787;

app.listen(PORT, () => {
  console.log(`🚀 Node backend running on http://localhost:${PORT} (Firebase Auth Enabled)`);
});