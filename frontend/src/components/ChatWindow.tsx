import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chatStore";

export default function ChatWindow() {
  const { messages, addMessage } = useChatStore();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL = import.meta.env.CHAT_API_BASE_URL || 'http://localhost:3001';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    addMessage({ sender: "user", text: input });
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/chat`, {
        message: input,
        history: messages.map((m) => ({
          role: m.sender,
          content: m.text,
        })),
      });

      addMessage({ sender: "assistant", text: res.data.reply });
    } catch (error: unknown) {
      let errorMessage = "⚠️ Oops! Something went wrong. Please try again.";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 429) {
          errorMessage = "⚠️ Too many requests. Please wait a moment and try again.";
        } else if (axiosError.response?.status === 401) {
          errorMessage = "⚠️ Authentication error. Please check your API key.";
        }
      } else if (!navigator.onLine) {
        errorMessage = "⚠️ No internet connection. Please check your network.";
      }
      
      addMessage({
        sender: "assistant",
        text: errorMessage,
      });
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
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
        {isTyping && (
          <div className="bg-gray-200 text-gray-500 p-3 rounded-xl max-w-[75%] mr-auto">
            <div className="flex items-center space-x-2">
              <span className="text-sm">Bot is typing</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="flex items-center gap-2 border-t p-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button onClick={sendMessage} disabled={isTyping}>
          Send
        </Button>
      </div>
    </Card>
  );
}
