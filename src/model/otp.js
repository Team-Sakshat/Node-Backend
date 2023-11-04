import mongoose from "mongoose";

const otpSchema=new mongoose.Schema({
    AadharNumber:{
        type:String,
        required:true,
        unique:true
    },
    OTP:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:60*5
    }
});

const otpData = mongoose.model('OTP', otpSchema);

export default otpData;