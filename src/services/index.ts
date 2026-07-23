export const API_KEY = process.env.REACT_APP_API_SERVICE;
export const WEBSOCKET_KEY = process.env.REACT_APP_WEBSOCKET_SERVICE;

export function getToken() {
    if (typeof window !== 'undefined') {
        return window.localStorage.getItem('token');
    }
}

export function getFileStorage() {
    const fileStorage = API_KEY + "/images/";
    return fileStorage;
}

export function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }
}

