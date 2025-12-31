import { ChatMessage } from '../types';

const API_URL = '/api/chat';

export const sendMessageToGemini = async (
    message: string,
    history: ChatMessage[]
): Promise<string> => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                // Optional: send history if backend supports it
                session_id: "demo-session"
            })
        });

        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }

        const data = await response.json();
        return data.reply || "Error: No response from agent.";

    } catch (error: any) {
        console.error("Error connecting to AI Backend:", error);
        return "Error de conexión con el Agente AI (Backend no disponible).";
    }
};

export const clearChatHistory = async (sessionId: string = "default-session"): Promise<boolean> => {
    try {
        const response = await fetch(`/api/chat/${sessionId}`, {
            method: 'DELETE',
        });
        return response.ok;
    } catch (error) {
        console.error("Error clearing history:", error);
        return false;
    }
};
