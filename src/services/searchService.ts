import { INSIGHT_SERVICE_KEY, getAuthHeaders } from ".";

export async function getSuggestions(q?: string, contextId?: string) {
    const queryParams: Record<string, string> = {};
    if (q !== undefined) queryParams.q = q;
    if (contextId !== undefined) queryParams.contextId = contextId;

    const params = new URLSearchParams(queryParams).toString();
    const url = `${INSIGHT_SERVICE_KEY}/api/search/suggestions${params ? `?${params}` : ''}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function recordSearchClick(params: {
    userId: string;
    query: string;
    entityId?: string;
    entityType?: string;
    slug?: string;
}) {
    const queryParams: Record<string, string> = {
        userId: params.userId,
        query: params.query,
    };

    if (params.entityId !== undefined) queryParams.entityId = params.entityId;
    if (params.entityType !== undefined) queryParams.entityType = params.entityType;
    if (params.slug !== undefined) queryParams.slug = params.slug;

    const searchParams = new URLSearchParams(queryParams).toString();

    const res = await fetch(`${INSIGHT_SERVICE_KEY}/api/search/click?${searchParams}`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function getSearchHistory(userId: string, limit: number = 5) {
    const params = new URLSearchParams({
        userId,
        limit: limit.toString(),
    }).toString();

    const res = await fetch(`${INSIGHT_SERVICE_KEY}/api/search/history?${params}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function clearSearchHistory(userId: string) {
    const params = new URLSearchParams({ userId }).toString();

    const res = await fetch(`${INSIGHT_SERVICE_KEY}/api/search/history?${params}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return res.json();
}