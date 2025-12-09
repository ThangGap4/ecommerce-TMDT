import api from "./api";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  user_id?: string;
}

export interface ChatResponse {
  message: string;
}

export const ChatService = {
  /**
   * Send chat messages and get AI response
   */
  sendMessage: async (messages: ChatMessage[], userId?: string): Promise<string> => {
    const response = await api.post<ChatResponse>("/chat", {
      messages,
      user_id: userId,
    });
    return response.data.message;
  },
};

export default ChatService;
