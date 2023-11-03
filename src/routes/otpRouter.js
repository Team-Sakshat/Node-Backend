import express from 'express';
import twilio from 'twilio';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique OTP keys
import dotenv from 'dotenv';
const router = express.Router();
dotenv.config();

// Your Twilio API credentials
const accountSid = process.env.Account_SID;
const authToken = process.env.authTOKEN;
const twilioPhoneNumber = process.env.twilioPnumber;

const client = new twilio(accountSid, authToken);

// Route to verify OTP
router.post('/verifyotp', (req, res) => {
  const { phoneNumber, enteredOTP } = req.body;

  // Retrieve the stored OTP data
  const otpData = otpStore[phoneNumber];

  if (!otpData) {
    return res.status(400).json({ message: 'OTP not found' });
  }

  // Check if the OTP has expired
  if (Date.now() > otpData.expiresAt) {
    return res.status(400).json({ message: 'OTP has expired' });
  }

  if (enteredOTP === otpData.otp) {
    // OTP is correct; you can authenticate the user
    // Clear the stored OTP to prevent multiple use
    delete otpStore[phoneNumber];
    res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    res.status(401).json({ message: 'Invalid OTP' });
  }
});

export default router;

