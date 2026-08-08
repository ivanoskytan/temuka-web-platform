import { API_SERVICE_KEY, getAuthHeaders } from ".";

export async function createMajor(payload: any) {
    const res = await fetch(`${API_SERVICE_KEY}/api/major`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function getMajorDetail(id: string) {
    const res = await fetch(`${API_SERVICE_KEY}/api/major/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function getMajorList() {
    const res = await fetch(`${API_SERVICE_KEY}/api/major`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function addMajorReview(payload: any) {
    const res = await fetch(`${API_SERVICE_KEY}/api/major/review`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function getMajorsByUniversity(universityId: number) {
    const res = await fetch(`${API_SERVICE_KEY}/api/major/university/${universityId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}