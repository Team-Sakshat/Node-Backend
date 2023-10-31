import jwt from 'jsonwebtoken';
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../model/user.js';


const router = express.Router();

function generateToken(user) {
  const payload = { userId: user._id, aadhar: user.AadharNumber };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
}

router.post('/login', async (req, res) => {
  const { AadharNumber, password } = req.body;
  try {
    const UserID = await User.findOne({ AadharNumber });
    if (!UserID) {
      return res.status(401).json({ message: 'User not found' });
    }

    console.log(password);
    console.log(UserID.password);
    const passwordMatch = await bcrypt.compare(password, UserID.password);

    if (!passwordMatch) {
      const err = new Error('Password does not match');
      err.status = 401;
      throw err;
    };

    const token = generateToken(UserID);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
