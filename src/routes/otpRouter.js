import express from 'express';
import twilio from 'twilio';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique OTP keys
import dotenv from 'dotenv';
import otpData from '../model/otp.js';
const router = express.Router();

dotenv.config();

// Route to verify OTP
router.post('/verifyotp', (req, res) => {
const { enteredOTP } = req.body;

  // Retrieve the stored OTP data
  const otp_Data = otpData[AadharNumber];

  if (!otp_Data) {
    return res.status(400).json({ message: 'OTP not found' });
  }

  // Check if the OTP has expired
  if (Date.now() > otp_Data.expiresAt) {
    return res.status(400).json({ message: 'OTP has expired' });
  }

  if (enteredOTP === otp_Data.otp) {
    delete otpData[phoneNumber];
    res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    res.status(401).json({ message: 'Invalid OTP' });
  }
});

export default router;


