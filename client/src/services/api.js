const API_URL = "http://localhost:5000/api";

export async function loginUser(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    return data;
}

export async function registerUser(userData) {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMsg = data.errors && data.errors.length > 0
            ? data.errors.map(e => e.msg).join(", ")
            : (data.message || "Registration failed");

        throw new Error(errorMsg);
    }

    return data;
}

export async function getUsers(token) {
    const response = await fetch(`${API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
    }

    return data;
}

export async function getMessages(userId, token) {
    const response = await fetch(`${API_URL}/messages/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch messages");
    }

    return data;
}

export async function sendMessage(receiver, content, token) {
    const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ receiver, content })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
    }

    return data;
}

export async function getAdminData(token) {
    const response = await fetch(`${API_URL}/users/admin`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch admin data");
    }

    return data;
}