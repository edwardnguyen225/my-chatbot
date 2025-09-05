import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chatStore";

export default function ChatWindow() {
  const { messages, userName, addMessage, setUserName } = useChatStore();
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    addMessage({ sender: "user", text: input });
    setInput("");

    setTimeout(() => {
      const botResponse = getBotResponse(input);
      addMessage({ sender: "bot", text: botResponse });
    }, 800);
  };

  // Example bot reply (with context awareness)
  const getBotResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();

    if (message.includes("my name is")) {
      const name = userMessage.split("my name is")[1].trim();
      setUserName(name);
      return `Nice to meet you, ${name}! I'll remember your name.`;
    }

    if (message.includes("hello") || message.includes("hi")) {
      if (userName) {
        return `Hello ${userName}! How can I help you?`;
      }
      return "Hello! How can I help you?";
    }

    return "Thanks for your message! I'm a simple chatbot learning to respond.";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col rounded-2xl shadow-lg">
      <CardContent className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-xl max-w-[75%] ${
              msg.sender === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-gray-800 mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </CardContent>

      <div className="flex items-center gap-2 border-t p-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </Card>
  );
}
