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

// Store OTPs in an object with phone numbers as keys and OTP details as values
const otpStore = {};

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via Twilio
function sendOTP(phoneNumber, otp) {
  const toPhoneNumber = `+${phoneNumber}`;
  client.messages
    .create({
      body: `Your OTP is: ${otp}`,
      from: twilioPhoneNumber,
      to: toPhoneNumber,
    })
    .then((message) => console.log(message.sid))
    .catch((error) => console.error(error));
}

// Route to send OTP
router.post('/sendotp', (req, res) => {
  const { PhoneNumber } = req.body;

  if (!PhoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  // Format the phone number with the country code
  const phoneNumber = `+91${PhoneNumber}`; // Assuming the country code is 91 for India

  const otp = generateOTP();

  // Store the OTP along with an expiration timestamp (e.g., 5 minutes)
  const otpData = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes in milliseconds
  };
  otpStore[phoneNumber] = otpData;

  sendOTP(phoneNumber, otp);

  res.status(200).json({ message: 'OTP sent successfully' });
});

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

