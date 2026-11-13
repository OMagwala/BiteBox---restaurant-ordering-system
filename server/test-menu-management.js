
require("dotenv").config();

const BASE_URL = "http://localhost:5000/api";

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD;

const CUSTOMER_EMAIL = process.env.TEST_CUSTOMER_EMAIL;
const CUSTOMER_PASSWORD = process.env.TEST_CUSTOMER_PASSWORD;

async function request(url, method = "GET", body = null, token = null) {
    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
    });

    const data = await response.json();

    return {
        status: response.status,
        data,
    };
}

async function login(email, password) {
    const result = await request(
        `${BASE_URL}/auth/login`,
        "POST",
        { email, password }
    );

    if (result.status !== 200) {
        throw new Error(`Login failed: ${JSON.stringify(result.data)}`);
    }

    return result.data.token;
}

async function runTests() {
    let createdItemId = null;

    try {
        if (!ADMIN_EMAIL || !ADMIN_PASSWORD ||
            !CUSTOMER_EMAIL || !CUSTOMER_PASSWORD) {
            throw new Error("Missing test login credentials in .env");
        }

        console.log("\n--- MENU MANAGEMENT TESTS ---\n");

        // 1. Login
        const adminToken = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
        const customerToken = await login(CUSTOMER_EMAIL, CUSTOMER_PASSWORD);

        console.log("Admin login: SUCCESS");
        console.log("Customer login: SUCCESS");

        // 2. Public GET
        const getResult = await request(`${BASE_URL}/menu`);

        console.log("\nGET menu:", getResult.status);
        console.log("Returns array:", Array.isArray(getResult.data));

        if (getResult.status !== 200 || !Array.isArray(getResult.data)) {
            throw new Error("Public GET test failed.");
        }

        // 3. Unauthorized POST
        const unauthorizedResult = await request(
            `${BASE_URL}/menu`,
            "POST",
            { name: "Test Item" }
        );

        console.log("\nPOST without token:", unauthorizedResult.status);

        if (unauthorizedResult.status !== 401) {
            throw new Error("Unauthorized POST test failed.");
        }

        // 4. Customer POST
        const customerResult = await request(
            `${BASE_URL}/menu`,
            "POST",
            { name: "Test Item" },
            customerToken
        );

        console.log("POST as customer:", customerResult.status);

        if (customerResult.status !== 403) {
            throw new Error("Customer authorization test failed.");
        }

        // 5. Admin POST
        const newItem = {
            name: "Test Chicken Burger",
            description: "Temporary menu management test item",
            price: 65.99,
            category: "Burgers",
            image: "",
            isAvailable: true,
        };

        const createResult = await request(
            `${BASE_URL}/menu`,
            "POST",
            newItem,
            adminToken
        );

        console.log("\nAdmin POST:", createResult.status);

        if (createResult.status !== 201) {
            throw new Error(`Create test failed: ${JSON.stringify(createResult.data)}`);
        }

        createdItemId = createResult.data.menuItem._id;
        console.log("Created item ID:", createdItemId);

        // 6. Admin PUT
        const updatedItem = {
            name: "Updated Test Chicken Burger",
            description: "Updated temporary test item",
            price: 75.99,
            category: "Burgers",
            image: "",
            isAvailable: true,
        };

        const updateResult = await request(
            `${BASE_URL}/menu/${createdItemId}`,
            "PUT",
            updatedItem,
            adminToken
        );

        console.log("\nAdmin PUT:", updateResult.status);

        if (updateResult.status !== 200) {
            throw new Error("Update test failed.");
        }

        // 7. Admin PATCH
        const availabilityResult = await request(
            `${BASE_URL}/menu/${createdItemId}/availability`,
            "PATCH",
            { isAvailable: false },
            adminToken
        );

        console.log("\nAdmin PATCH availability:", availabilityResult.status);

        if (
            availabilityResult.status !== 200 ||
            availabilityResult.data.menuItem.isAvailable !== false
        ) {
            throw new Error("Availability test failed.");
        }

        // 8. Admin DELETE
        const deleteResult = await request(
            `${BASE_URL}/menu/${createdItemId}`,
            "DELETE",
            null,
            adminToken
        );

        console.log("\nAdmin DELETE:", deleteResult.status);

        if (deleteResult.status !== 200) {
            throw new Error("Delete test failed.");
        }

        createdItemId = null;

        console.log("\nALL MENU MANAGEMENT TESTS PASSED!");

    } catch (error) {
        console.error("\nTEST FAILED:", error.message);

    } finally {
        // Clean up if a test fails after creating the item.
        if (createdItemId) {
            try {
                const adminToken = await login(ADMIN_EMAIL, ADMIN_PASSWORD);

                await request(
                    `${BASE_URL}/menu/${createdItemId}`,
                    "DELETE",
                    null,
                    adminToken
                );

                console.log("\nTemporary test item cleaned up.");
            } catch (cleanupError) {
                console.error("Cleanup failed:", cleanupError.message);
                console.error("Check MongoDB for the temporary test item.");
            }
        }
    }
}

runTests();
