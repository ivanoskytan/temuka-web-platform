import { API_SERVICE_KEY, getAuthHeaders } from ".";

export async function getModeratorsByCommunity(community_id: number) {
    const res = await fetch(`${API_SERVICE_KEY}/api/moderator/list/${community_id}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    return res.json();
}

export async function inviteRequest(payload: any) {
    const res = await fetch(`${API_SERVICE_KEY}/api/moderator/invite`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}
