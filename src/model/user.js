import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    AadharNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        phoneNumber: true
    },
    userImage: {
        type: String,
        required: true,
        unique: true
    }
});

const user = mongoose.model('user', userSchema);

export default user;