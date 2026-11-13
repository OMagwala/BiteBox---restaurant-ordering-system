require("dotenv").config();

const BASE_URL = "http://localhost:5000/api";
const API_URL = `${BASE_URL}/orders/stats`;

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD;

async function login() {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        throw new Error("Missing admin credentials in server/.env");
    }

    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
        }),
    });

    const data = await response.json();

    if (!response.ok || !data.token) {
        throw new Error("Admin login failed.");
    }

    return data.token;
}

async function testDashboardStats() {
    try {
        // 1. Login as admin and retrieve a fresh token.
        const token = await login();

        console.log("Admin login successful.");

        // 2. Retrieve dashboard statistics.
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        console.log("Status:", response.status);
        console.log("Response:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            throw new Error(data.message || "Dashboard stats test failed.");
        }

        console.log("\nDashboard statistics test passed!");

    } catch (error) {
        console.error("Test failed:", error.message);
    }
}

testDashboardStats();