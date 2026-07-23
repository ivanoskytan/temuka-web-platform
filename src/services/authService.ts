import { API_KEY } from ".";

export async function loginUser(payload: any) {
    return fetch(`${API_KEY}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then((res) => res.json());
}

export async function registerUser(payload: any) {
    return fetch(`${API_KEY}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then((res) => res.json());
}

export async function resetPassword(payload: any, id: number) {
    return fetch(`${API_KEY}/api/auth/resetPassword/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then((res) => res.json());
}