import express from 'express';
import bcrypt from 'bcrypt';
import twilio from 'twilio';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique OTP keys
import User from '../model/user.js';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();
const accountSid = process.env.Account_SID;
const authToken = process.env.authTOKEN;
const twilioPhoneNumber = process.env.twilioPnumber;
const client = new twilio(accountSid, authToken);
import OTPModel from "../model/otp.js"

router.post('/register',async (req, res) => {
  try {
    const { AadharNumber, email, password, phoneNumber, userImage } = req.body;

    // Validate the input data (add more validation as needed)
    if (!AadharNumber || !email || !password || !phoneNumber || !userImage) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the user already exists (e.g., based on email or AadharNumber)
    const existingUser = await User.findOne({ $or: [{ email }, { AadharNumber }] });
    if (existingUser) {
      return res.status(409).json({ error: 'User with the same email or AadharNumber already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = new User({ AadharNumber, email, password: hashedPassword, phoneNumber , userImage});
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
      console.error('User registration error:', error);
    };

    const otpStore = {};
    const { AadharNumber } = req.body;
    const User_ID = await User.findOne({ AadharNumber });
    console.log(User_ID);

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
const PhoneNumber = User_ID.phoneNumber;
// Send OTP via Twilio
function sendOTP(phoneNumber, otp) {
  const toPhoneNumber = `+${PhoneNumber}`;
  client.messages
    .create({
      body: `Your OTP is: ${otp}`,
      from: twilioPhoneNumber,
      to: toPhoneNumber,
    })
    .then((message) => console.log(message.sid))
    .catch((error) => console.error(error));
}

// Format the phone number with the country code
const phoneNumber = `+91${PhoneNumber}`; // Assuming the country code is 91 for India

const otp = generateOTP();

sendOTP(phoneNumber, otp);


// Create an instance of the OTPModel
const otpData = new OTPModel({
  AadharNumber: User_ID.AadharNumber,
  OTP: otp, // Example OTP value
  expiresAt: new Date(), // Example expiration date
});

// Save the instance to the database
otpData.save()
  .then((savedData) => {
    console.log('OTP data saved:', savedData);
  })
  .catch((error) => {
    console.error('Error saving OTP data:', error);
  });


// res.status(200).json({ message: 'OTP sent successfully' });

  
// Define the user identifier and expiration time
// Replace with the user's identifier
 // Set expiration time (5 minutes from now)

// Create and save the OTP document
// const otpDocument = new OTPModel({
//   AadharNumber,
//   otp
// });

// otpDocument.save((err) => {
//   if (err) {
//     console.error('Error saving OTP:', err);
//   } else {
//     console.log('OTP saved successfully.');
//     // Send the OTP to the user (e.g., via SMS, email, or another method)
//   }
// });

});
export default router;