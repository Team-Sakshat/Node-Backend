import express from 'express';
import dotenv from 'dotenv';
import otpData from '../model/otp.js'; // Make sure to import your Mongoose model for OTP
import mongoose from 'mongoose';

dotenv.config();

const router = express.Router();

// Route to verify OTP
router.post('/verifyotp', async (req, res) => {
  const { AadharNumber } = req.body;
  const { enteredOTP } = req.body;

  try {
    // Retrieve the stored OTP data using Mongoose
    const otp_Data = await otpData.findOne({ AadharNumber });
    console.log(otp_Data);

    if (!otp_Data) {
      return res.status(400).json({ message: 'OTP not found' });
    }

    // Check if the OTP has expired
    if (Date.now() > otp_Data.expiresAt) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (enteredOTP === otp_Data.OTP) {
      // If the OTP is verified, you should delete the OTP record from the database
      await otp_Data.deleteOne({ AadharNumber });
      res.status(200).json({ message: 'Your OTP verified successfully' });
    } else {
      res.status(401).json({ message: 'OTP verified successfully' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
