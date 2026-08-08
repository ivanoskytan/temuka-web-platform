export const API_SERVICE_KEY = process.env.REACT_APP_API_SERVICE;
export const WEBSOCKET_SERVICE_KEY = process.env.REACT_APP_WEBSOCKET_SERVICE;
export const INSIGHT_SERVICE_KEY = process.env.REACT_APP_INSIGHT_SERVICE;

export function getToken() {
    if (typeof window !== 'undefined') {
        return window.localStorage.getItem('token');
    }
}

export function getFileStorage() {
    const fileStorage = API_SERVICE_KEY + "/images/";
    return fileStorage;
}

export function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }
}

