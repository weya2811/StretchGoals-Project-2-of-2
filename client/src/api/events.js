const API = "/api/events";

function authHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export async function getEvents() {
    const res = await fetch(API, { headers: authHeaders() });
    return res.json();
}

export async function createEvent(event) {
    const res = await fetch(API, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(event),
    });
    return res.json();
}

export async function updateEvent(id, event) {
    const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(event),
    });
    return res.json();
}

export async function deleteEvent(id) {
    const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return res.json();
}