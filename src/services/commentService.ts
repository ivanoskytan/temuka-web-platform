import { API_SERVICE_KEY, getAuthHeaders } from ".";

export async function addComment(payload: any) {
    const res = await fetch(`${API_SERVICE_KEY}/api/comment/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function showCommentsByPost(payload: any) {
    const res = await fetch(`${API_SERVICE_KEY}/api/comment/show`, {
        method: 'GET',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function showReplies(payload: any) {
    const res = await fetch(`${API_SERVICE_KEY}/api/comment/replies`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function getUserComments(user_id: number) {
    const res = await fetch(`${API_SERVICE_KEY}/api/comment/user/${user_id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}