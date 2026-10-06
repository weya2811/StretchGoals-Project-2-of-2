const API_URL = '/api/clients';

export async function getClients() {
    const res = await fetch(API_URL, {
        method: "GET",
    })

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
    }

    return data;
}