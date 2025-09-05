import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chatStore";

export default function ChatWindow() {
  const { messages, addMessage } = useChatStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    addMessage({ sender: "user", text: input });
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3001/chat", {
        message: input,
        history: messages.map((m) => ({
          role: m.sender,
          content: m.text,
        })),
      });

      addMessage({ sender: "bot", text: res.data.reply });
    } catch (error) {
      addMessage({
        sender: "bot",
        text: "⚠️ Error: Unable to get a response.",
      });
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
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
        {loading && (
          <p className="text-sm text-gray-400 italic">Bot is thinking...</p>
        )}
      </CardContent>

      <div className="flex items-center gap-2 border-t p-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button onClick={sendMessage} disabled={loading}>
          Send
        </Button>
      </div>
    </Card>
  );
}
