import API_URL from "../config/api";

const AUTH_URL = `${API_URL}/auth`;

export async function registerUser(userData) {
    const response = await fetch(`${AUTH_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create account.");
    }

    return data;
}

export async function loginUser(credentials) {
    const response = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed.");
    }

    localStorage.setItem("biteboxToken", data.token);
    localStorage.setItem("biteboxUser", JSON.stringify(data.user));

    window.dispatchEvent(new Event("authChange"));

    return data;
}

export function getStoredToken() {
    return localStorage.getItem("biteboxToken");
}

export function getStoredUser() {
    const user = localStorage.getItem("biteboxUser");

    return user ? JSON.parse(user) : null;
}

export function logoutUser() {
    localStorage.removeItem("biteboxToken");
    localStorage.removeItem("biteboxUser");

    window.dispatchEvent(new Event("authChange"));
}