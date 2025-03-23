"use client";
import { useState } from "react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = { text: inputValue, sender: "user" };
    setMessages([...messages, userMessage]);
    setInputValue("");
    setLoading(true);
  
    const requestBody = {
      provider: process.env.NEXT_PUBLIC_PROVIDER || "defaultProvider",
      model: process.env.NEXT_PUBLIC_MODEL || "defaultModel",
      query: inputValue,
      limit: 1,
    };

    try {
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1/chat/search";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        text: data[0]?.text || "No response found",
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessages((prev) => [...prev, { text: "Hmm, something’s not quite right. I can’t reach my brain at the moment. Try again in a bit!", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl h-[80vh] bg-white rounded-lg shadow-lg p-4">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">FinderAI Chat</h2>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto border p-3 rounded bg-gray-50">
        {messages.map((message, index) => (
          <div key={index} className={`p-2 my-1 rounded-lg max-w-xs text-sm ${message.sender === "user" ? "ml-auto bg-blue-500 text-white" : "mr-auto bg-gray-300 text-black"}`}>
            {message.text}
          </div>
        ))}
        {loading && <p className="text-gray-500 text-sm">FinderAI is thinking...</p>}
      </div>

      {/* Input Field */}
      <div className="flex mt-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Ask something..."
          className="flex-1 p-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSendMessage} 
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
