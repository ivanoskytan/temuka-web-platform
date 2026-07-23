import { API_KEY, WEBSOCKET_KEY, getAuthHeaders } from ".";

export interface WSMessagePayload {
    conversation_id: number;
    user_id: number;
    text: string;
}

export interface ChatWebSocket {
    socket: WebSocket;
    sendMessage: (payload : WSMessagePayload) => void;
    close: () => void;
}

export function connectWebSocket(
    conversationID: number,
    userID: number,
    onMessageReceived: (message: any) => void
) {
    const token = localStorage.getItem('token') || '';
    const wsUrl = `${WEBSOCKET_KEY}/api/chat/ws?conversation_id=${conversationID}&user_id=${userID}&token=${encodeURIComponent(token)}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log(`[WS Connected] Conversation: ${conversationID}, User: ${userID}`);
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            onMessageReceived(data);
        } catch (err) {
            console.error(`[WS Error] Failed to parse message: ${event.data}`, err);
        }
    };

    socket.onerror = (error) => {
        console.error(`[WS Error]: `, error);
    };

    socket.onclose = () => {
        console.log('[WS Disconnected]');
    };

    const sendMessage = (payload: WSMessagePayload) => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(payload));
        } else {
            console.warn("[WS Warning] Cannot send message, socket is not open.");
        }
    };

    const close = () => {
        socket.close();
    }

    return { socket, sendMessage, close };
}

export async function createConversation(payload: any) {
    const res = await fetch(`${API_KEY}/api/chat`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function getConversationsByUserID(user_id: number) {
    const res = await fetch(`${API_KEY}/api/chat/all/${user_id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function getConversationDetailByID(id: number) {
    const res = await fetch(`${API_KEY}/api/chat/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return res.json();
}

export async function addMessage(payload: any) {
    const res = await fetch(`${API_KEY}/api/chat/message`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function addParticipant(payload: any) {
    const res = await fetch(`${API_KEY}/api/chat/participant`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
    });
    return res.json();
}

export async function deleteConversation(id: number) {
    const res = await fetch(`${API_KEY}/api/chat/user`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return res.json();
}