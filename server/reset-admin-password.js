
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function resetAdminPassword() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        const admin = await User.findOne({ role: "admin" });

        if (!admin) {
            console.log("No admin account found.");
            return;
        }

        console.log("Admin account found:", admin.email);

        rl.question("Enter a new password for this admin: ", async (password) => {
            try {
                if (password.length < 8) {
                    console.log("Password must be at least 8 characters.");
                    return;
                }

                const hashedPassword = await bcrypt.hash(password, 12);

                admin.password = hashedPassword;
                await admin.save();

                console.log("Admin password reset successfully.");
            } catch (error) {
                console.error("Password reset failed:", error.message);
            } finally {
                rl.close();
                await mongoose.disconnect();
            }
        });
    } catch (error) {
        console.error("Connection or reset failed:", error.message);
        rl.close();
        await mongoose.disconnect().catch(() => {});
    }
}

resetAdminPassword();
