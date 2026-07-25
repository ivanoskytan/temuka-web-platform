import { API_KEY, getAuthHeaders } from ".";

export async function getUniversityDetail(slug: string) {
    const res = await fetch(`${API_KEY}/api/university/${slug}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function getUniversities() {
    const res = await fetch(`${API_KEY}/api/university`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function addReview(payload: any) {
    const res = await fetch(`${API_KEY}/api/university/review`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function getUniversityReviews(university_id: any) {
    const res = await fetch(`${API_KEY}/api/university/review/${university_id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}