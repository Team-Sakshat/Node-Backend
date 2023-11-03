import mongoose from "mongoose";

const otpSchema=new mongoose.Schema({
    AadharNumber:{
        type:String,
        trim:true,
        required:true,
    },
    otp:{
        type:String,
        required:true,
        trim:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:60*5
    }
});

const otpData = mongoose.model('otpData', otpSchema);

export default otpData;