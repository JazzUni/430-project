import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    password: {
        type: String,
        required: function () {
            return this.userType === "Admin";
        }
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true
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
        required: true
    }

});

export default mongoose.models.User || mongoose.model("User", UserSchema);