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
  console.log("addhar->",AadharNumber,"password->",password);
  try {
    const UserID = await User.findOne({ AadharNumber });
    console.log("login user id->",UserID);
    if (!UserID) {
      return res.status(401).json({ message: 'Login Successfully not' });
    }

    console.log("password->",password);
    console.log("userhased password=>",UserID.password);
    const passwordMatch = await bcrypt.compare(password, UserID.password);
    console.log("password match->",passwordMatch);
    if (!passwordMatch) {
      const err = new Error('Enter the correct password');
      err.status = 401;
      throw err;
    };

    const token = generateToken(UserID);
    console.log("token->",token);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;