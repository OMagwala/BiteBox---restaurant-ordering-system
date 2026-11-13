import API_URL from "../config/api";

const ORDERS_URL = `${API_URL}/orders`;

export async function createOrder(orderData) {

    const token = localStorage.getItem("biteboxToken");

    const response = await fetch(ORDERS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && {Authorization: `Bearer ${token}`}),
        },
        body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create order.");
    }

    return data;
}

export async function getOrderById(orderId, trackingToken) {
    const response = await fetch(`${ORDERS_URL}/${orderId}`, {
        headers: {
            "X-Order-Token": trackingToken,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to retrieve order.");
    }

    return data.order;
}

export async function getAllOrders() {
    const token = localStorage.getItem("biteboxToken");

    const response = await fetch(`${ORDERS_URL}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to retrieve orders.");
    }

    return data.orders;
}

export async function updateOrderStatus(orderId, status) {
    const token = localStorage.getItem("biteboxToken");

    const response = await fetch(`${ORDERS_URL}/${orderId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update order status.");
    }

    return data.order;
}

export async function getMyOrders() {
    const token = localStorage.getItem("biteboxToken");

    if (!token) {
        throw new Error("Please log in to view your orders.");
    }

    const response = await fetch(`${ORDERS_URL}/my-orders`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to retrieve your orders.");
    }

    return data.orders;
}