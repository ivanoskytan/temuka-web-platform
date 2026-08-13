import { API_SERVICE_KEY, getAuthHeaders } from ".";

export async function createPost(payload: any) {
    const res = await fetch(`${API_SERVICE_KEY}/api/post`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function getTimelinePosts(user_id: number) {
    const res = await fetch(`${API_SERVICE_KEY}/api/post/timeline/${user_id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function getUserPosts(user_id: number) {
    const res = await fetch(`${API_SERVICE_KEY}/api/post/user/${user_id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function getSavedPostsByUser(user_id: number) {
    const res = await fetch(`${API_SERVICE_KEY}/api/post/saved/${user_id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function likePost(payload: any, id: number) {
    const res = await fetch(`${API_SERVICE_KEY}/api/post/like/${id}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function unlikePost(payload: any, id: number) {
    const res = await fetch(`${API_SERVICE_KEY}/api/post/unlike/${id}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function savePost(payload: any, id: number) {
    const res = await fetch(`${API_SERVICE_KEY}/api/post/save/${id}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function unsavePost(payload: any, id: number) {
    const res = await fetch(`${API_SERVICE_KEY}/api/post/unsave/${id}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function deletePost(id: number) {
    const res = await fetch(`${API_SERVICE_KEY}/api/post/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function updatePost(id: number, payload: any) {
    const res = await fetch(`${API_SERVICE_KEY}/api/post/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function getPostDetail(id: number) {
    const res = await fetch(`${API_SERVICE_KEY}/api/post/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}