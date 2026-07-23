import { API_KEY, getAuthHeaders } from ".";

export async function getUserDetail(id: number) {
    const res = await fetch(`${API_KEY}/api/user/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function searchUsers(name: string) {
    const params = new URLSearchParams({ name }).toString();
    const res = await fetch(`${API_KEY}/api/user/search?${params}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function followUser(payload: any) {
    const res = await fetch(`${API_KEY}/api/user/follow`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function updateUser(id: number, payload: any) {
    const res = await fetch(`${API_KEY}/api/user/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function getFollowers(payload: any) {
    const res = await fetch(`${API_KEY}/api/user/followers`, {
        method: 'GET',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}