import express from 'express';
import bcrypt from 'bcrypt';
import User from '../model/user.js';

const router = express.Router();

// function isAdmin(req, res, next) {
//   if (req.user && req.user.role === 'admin') {
//     next();
//   } else {
//     res.status(403).json({ error: 'Permission denied' });
//   }
// }


router.post('/register',async (req, res) => {
  try {
    const { AadharNumber, email, password, role, phoneNumber } = req.body;

    // Validate the input data (add more validation as needed)
    if (!AadharNumber || !email || !password || !role || !phoneNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the user already exists (e.g., based on email or AadharNumber)
    const existingUser = await User.findOne({ $or: [{ email }, { AadharNumber }] });
    if (existingUser) {
      return res.status(409).json({ error: 'User with the same email or AadharNumber already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = new User({ AadharNumber, email, password: hashedPassword, role, phoneNumber });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;
