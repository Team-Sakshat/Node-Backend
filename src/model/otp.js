import mongoose from "mongoose";
import mailSender from "../routes/registerRouter";

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

// async function sendVerification(email,otp){
//     try {
//         const mailsend=await mailSender(AadharNumber,"Verification Email From UIDAI",sendotp(otp))
//     } catch (error) {
//         console.log("error occured in sending mail",error);
//         throw error;
//     }
// }

async function sendVerification(phoneNumber, otp) {
    try {
        const mailsend = await mailSender(AadharNumber, "Verification Email From UIDAI", sendotp(otp));
    } catch (error) {
        console.log("error occurred in sending mail", error);
        throw error;
    }
}

otpSchema.pre("save",async function(next){
    if(this.isNew){
        await sendVerification(this.AadharNumber,this.otp);
    }
    next();
})

module.exports=mongoose.model("OTP",otpSchema);