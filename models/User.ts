import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phoneNumber: {
        type: String
    },
    address: {
        type: String
    },
    memberSince: {
        type: Date,
        default: Date.now
    },
    userType: {
        type: String,
        enum: ["Admin", "User"],
        required: true,
        default: "User"
    }

});

export default mongoose.models.User || mongoose.model("User", UserSchema);