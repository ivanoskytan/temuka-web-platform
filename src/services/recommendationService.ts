import { INSIGHT_SERVICE_KEY, getAuthHeaders } from ".";

export async function getUniversityRecommendations(contextId?: string, limit: number = 5) {
    const queryParams: Record<string, string> = {
        limit: limit.toString(),
    };
    if (contextId !== undefined) queryParams.contextId = contextId;

    const params = new URLSearchParams(queryParams).toString();
    const url = `${INSIGHT_SERVICE_KEY}/api/recommendations/universities?${params}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function getMajorRecommendations(contextId?: string, limit: number = 5) {
    const queryParams: Record<string, string> = {
        limit: limit.toString(),
    };
    if (contextId !== undefined) queryParams.contextId = contextId;

    const params = new URLSearchParams(queryParams).toString();
    const url = `${INSIGHT_SERVICE_KEY}/api/recommendations/majors?${params}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function getPostRecommendations(contextId?: string, limit: number = 5) {
    const queryParams: Record<string, string> = {
        limit: limit.toString(),
    };
    if (contextId !== undefined) queryParams.contextId = contextId;

    const params = new URLSearchParams(queryParams).toString();
    const url = `${INSIGHT_SERVICE_KEY}/api/recommendations/posts?${params}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}