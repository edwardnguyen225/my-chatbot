import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  userName: string;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setUserName: (name: string) => void;
  clearChat: () => void;
}

const WelcomeMessage: Message = {
  id: "welcome",
  sender: "assistant",
  text: "👋 Hi there! How can I help you today?",
  timestamp: new Date(),
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [WelcomeMessage],
      userName: "",
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: crypto.randomUUID(),
              timestamp: new Date(),
            },
          ],
        })),
      setUserName: (name) => set({ userName: name }),
      clearChat: () =>
        set({
          messages: [WelcomeMessage],
          userName: "",
        }),
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({ 
        messages: state.messages, 
        userName: state.userName 
      }),
    }
  )
);
