import API_URL from "../config/api";

const ORDERS_URL = `${API_URL}/orders`;

export async function getDashboardStats() {
    const token = localStorage.getItem("biteboxToken");

    const response = await fetch(`${ORDERS_URL}/stats`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to retrieve dashboard statistics.");
    }

    return data.stats;
}