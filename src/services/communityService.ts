import { API_SERVICE_KEY, getAuthHeaders } from ".";

export async function createCommunity(payload: any) {
    const res = await fetch(`${API_SERVICE_KEY}/api/community`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function getCommunityDetail(slug: string) {
    const res = await fetch(`${API_SERVICE_KEY}/api/community/${slug}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function getCommunities() {
    const res = await fetch(`${API_SERVICE_KEY}/api/community`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function joinCommunity(payload: any, id: number) {
    const res = await fetch(`${API_SERVICE_KEY}/api/community/join/${id}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function getCommunityPosts(id: number) {
    const res = await fetch(`${API_SERVICE_KEY}/api/community/post/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function getUserJoinedCommunities(payload: any) {
    const res = await fetch(`${API_SERVICE_KEY}/api/community/user`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}