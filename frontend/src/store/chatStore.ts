import { create } from "zustand";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

interface ChatState {
  messages: Message[];
  userName: string;
  addMessage: (message: Omit<Message, "id">) => void;
  setUserName: (name: string) => void;
  clearChat: () => void;
}

const WelcomeMessage: Message = {
  id: "welcome",
  sender: "bot",
  text: "👋 Hi there! How can I help you today?",
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [WelcomeMessage],
  userName: "",
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
        },
      ],
    })),
  setUserName: (name) => set({ userName: name }),
  clearChat: () =>
    set({
      messages: [WelcomeMessage],
      userName: "",
    }),
}));
