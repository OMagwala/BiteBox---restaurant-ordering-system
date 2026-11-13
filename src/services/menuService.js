import API_URL from "../config/api";

const MENU_URL = `${API_URL}/menu`;

async function menuRequest(endpoint = "", method = "GET", body = null) {
    const token = localStorage.getItem("biteboxToken");

    const response = await fetch(`${MENU_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...(body && { body: JSON.stringify(body) }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Menu request failed.");
    }

    return data;
}

export async function getMenuItems() {
    return menuRequest();
}

export async function createMenuItem(menuItem) {
    return menuRequest("", "POST", menuItem);
}

export async function updateMenuItem(id, menuItem) {
    return menuRequest(`/${id}`, "PUT", menuItem);
}

export async function updateMenuItemAvailability(id, isAvailable) {
    return menuRequest(`/${id}/availability`, "PATCH", { isAvailable });
}

export async function deleteMenuItem(id) {
    return menuRequest(`/${id}`, "DELETE");
}