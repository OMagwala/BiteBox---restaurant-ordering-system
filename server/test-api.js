

const BASE_URL = "http://localhost:5000/api";

async function testAdminOrderUpdate() {
    try {
        // 1. Log in as admin
        console.log("\n1. Logging in as admin...");

        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "ADMIN_EMAIL",
                password: "ADMIN_PASSWORD",
            }),
        });

        const loginData = await loginResponse.json();

        console.log("Login status:", loginResponse.status);

        if (!loginResponse.ok || !loginData.token) {
            console.log("Login failed:", loginData);
            return;
        }

        const token = loginData.token;
        console.log("Admin login successful.");

        // 2. Retrieve orders
        console.log("\n2. Retrieving orders...");

        const ordersResponse = await fetch(`${BASE_URL}/orders`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const ordersData = await ordersResponse.json();

        console.log("Orders status:", ordersResponse.status);

        if (!ordersResponse.ok) {
            console.log("Could not retrieve orders:", ordersData);
            return;
        }

        // Support either an array or an object containing an orders array
        const orders = Array.isArray(ordersData)
            ? ordersData
            : ordersData.orders;

        if (!Array.isArray(orders) || orders.length === 0) {
            console.log("No orders found, or the response format differs.");
            console.log("Response keys:", Object.keys(ordersData));
            return;
        }

        const order = orders[0];

        console.log("Selected order ID:", order._id);
        console.log("Current status:", order.status);

        // 3. Change the order status to confirmed
        console.log("\n3. Updating order status to confirmed...");

        const updateResponse = await fetch(
            `${BASE_URL}/orders/${order._id}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: "confirmed" }),
            }
        );

        const updateData = await updateResponse.json();

        console.log("Update status:", updateResponse.status);
        console.log("Response:", JSON.stringify(updateData, null, 2));

        if (updateResponse.ok) {
            console.log("\nPASS: Admin successfully updated the order.");
        } else {
            console.log("\nCHECK: The order update did not succeed.");
        }
    } catch (error) {
        console.error("Test failed:", error.message);
        console.error("Check that the backend server is running.");
    }
}

testAdminOrderUpdate();
