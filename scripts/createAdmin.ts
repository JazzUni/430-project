import dotenv from "dotenv";
import dbConnect from "../lib/dbConnect.ts";
import User from "../models/User.ts";
import argon2 from "argon2";

dotenv.config({ path: ".env.local" });

async function createAdmin() {
    try {
        console.log("ENV:", process.env.MONGODB_URI);
        await dbConnect();

        const exists = await User.findOne({ email: "admin@library.com" });

        if (exists) {
            console.log("Admin account already exists")
            return;
        }

        const hashedPassword = await argon2.hash("admin");

        await User.create({
            firstName: "admin",
            lastName: "",
            email: "admin@library.com",
            password: hashedPassword,
            phoneNumber: "604-555-9999",
            address: "library",
            userType: "Admin",
            memberSince: new Date()
        });

        console.log("Admin account created");
    } catch (error) {
        console.error("Error during admin account creation: ", error);
    }
}

createAdmin();