const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect, authorizeAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required.",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long.",
            });
        }

        const normalisedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalisedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalisedEmail,
            password: hashedPassword,
            role: "customer",
        });

        return res.status(201).json({
            message: "Account created successfully.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "An account with this email already exists.",
            });
        }

        console.error("Registration error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while creating your account.",
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        if (typeof email !== "string" || typeof password !== "string"
            || !email.trim() || !password) {
                return res.status(400).json({
                    message: "Email and password are required.",
                });
        }

        const normalisedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalisedEmail,
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error ("JWT_SECRET is not configured");
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role,
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1h",
            }
        );

        return res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Something went wrong while trying to login.",
        });
    }
});

router.get("/me", protect, (req, res) => {
    return res.status(200).json({
        message: "Authentication successful.",
        user: req.user,
    });
});

router.get("/admin-check", protect, authorizeAdmin, (req, res) => {
    return res.status(200).json({
        message: "Welcome to the admin area.",
        user: req.user,
    });
});

module.exports = router;