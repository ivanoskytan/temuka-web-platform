import { API_KEY, getAuthHeaders } from ".";

export async function uploadFile(payload: any) {
    const res = await fetch(`${API_KEY}/api/file`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}