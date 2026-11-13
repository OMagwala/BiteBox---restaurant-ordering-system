
const API_URL = "http://localhost:5000/api/orders";

async function testOrderTracking() {
    // Replace this with a real menu item ID from your database.
    const menuItemId = "6ac934ba1c3128f5719d0aa0";

    // 1. Create a fresh order.
    const createResponse = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            customerName: "Tracking Test",
            phone: "0821234567",
            deliveryMethod: "collection",
            deliveryAddress: "",
            items: [
                {
                    menuItem: menuItemId,
                    quantity: 1,
                },
            ],
        }),
    });

    const created = await createResponse.json();

    console.log("Create order status:", createResponse.status);
    console.log("Create order response:", JSON.stringify(created, null, 2));

    if (!createResponse.ok) {
        throw new Error(created.message || "Order creation failed.");
    }

    const orderId = created.order._id;
    const trackingToken = created.trackingToken;

    // 2. Try retrieving the order without a token.
    const missingTokenResponse = await fetch(`${API_URL}/${orderId}`);
    console.log(
        "Without token:",
        missingTokenResponse.status,
        await missingTokenResponse.json()
    );

    // 3. Retrieve the order using the correct token.
    const validTokenResponse = await fetch(`${API_URL}/${orderId}`, {
        headers: {
            "X-Order-Token": trackingToken,
        },
    });

    console.log(
        "With valid token:",
        validTokenResponse.status,
        JSON.stringify(await validTokenResponse.json(), null, 2)
    );

    // 4. Try a wrong token.
    const invalidTokenResponse = await fetch(`${API_URL}/${orderId}`, {
        headers: {
            "X-Order-Token": "incorrect-token",
        },
    });

    console.log(
        "With invalid token:",
        invalidTokenResponse.status,
        await invalidTokenResponse.json()
    );
}

testOrderTracking().catch((error) => {
    console.error("Test failed:", error.message);
});
