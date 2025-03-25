"use client";
import { useState, useEffect, useRef } from "react";

interface Message {
  text: string;
  sender: "user" | "bot";
  metadata?: string[];
  showMetadata?: boolean; // Controls when metadata is displayed
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [typingDots, setTypingDots] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling

  // Welcome messages (random display)
  const welcomeMessages = [
    "👋 Hi there! I'm FinderAI. How can I help you today?",
    "🤖 Hey! Ready to explore AI-powered answers?",
    "🚀 Hello! Ask me anything and let's get started!",
    "✨ Hi! FinderAI here. What can I do for you today?",
    "💡 Welcome! How can I assist you?"
  ];

  // Function to auto-scroll to the latest message
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100); // Small delay for smooth transition
  };

  // Function to simulate typing effect
  const typeMessage = (text: string, metadata: string[] = [], showTyping = true) => {
    let index = 0;
    
    if (showTyping) setLoading(true);
    setMessages((prev) => [...prev, { text: "", sender: "bot", metadata, showMetadata: false }]);
    
    const interval = setInterval(() => {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = {
          ...lastMessage,
          text: text.substring(0, index + 1),
        };
        return updatedMessages;
      });

      index++;
      scrollToBottom(); // Auto-scroll while typing

      if (index === text.length) {
        clearInterval(interval);
        if (showTyping) setLoading(false);
        
        // Delay showing metadata after text is fully typed
        setTimeout(() => {
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = { 
              ...lastMessage, 
              showMetadata: true 
            };
            return updatedMessages;
          });

          scrollToBottom(); // **Auto-scroll again AFTER metadata is displayed**
        }, 500);
      }
    }, 50);
  };

  // Show random welcome message on load
  useEffect(() => {
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    typeMessage(randomMessage, [], false);
  }, []);

  // Typing animation for "FinderAI is typing..."
  useEffect(() => {
    if (loading) {
      let dotCount = 0;
      const interval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        setTypingDots(".".repeat(dotCount));
        scrollToBottom(); // Auto-scroll during typing
      }, 500);
      return () => clearInterval(interval);
    } else {
      setTypingDots("");
    }
  }, [loading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = { text: inputValue, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);
    scrollToBottom();

    const requestBody = {
      sender: 'USER',
      botId: 'bot1', //TODO; change to actual botId
      userId: 'user1', //TODO: change to userId
      message: inputValue,
      limit: process.env.FINDERAI_CHAT_RESPONSE_LIMIT,
    };

    try {
      const url = process.env.FINDERAI_CHAT_API_URL || "http://localhost:8081/api/v1/chat";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      const botResponse = data.message || "No response found";

      // Extract metadata matches but exclude the first one (already displayed as message)
      const metadataMatches = data.metadata?.matches?.map((match: any) => match.text) || [];
      const metadataTexts = metadataMatches.length > 1 ? metadataMatches.slice(1) : [];

      setTimeout(() => {
        typeMessage(botResponse, metadataTexts, true);
      }, 500);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTimeout(() => {
        typeMessage("Hmm, something’s not quite right. I can’t reach my brain at the moment. Try again in a bit!", [], true);
      }, 500);
    }
  };

  // Handle text input and allow multi-line with Shift+Enter
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl h-[80vh] bg-white rounded-lg shadow-lg p-4">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">FinderAI Chat</h2>
      
      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto border p-3 rounded bg-gray-50">
        {messages.map((message, index) => (
          <div key={index} className={`p-2 my-1 rounded-lg max-w-xs text-sm ${message.sender === "user" ? "ml-auto bg-blue-500 text-white" : "mr-auto bg-gray-300 text-black"}`}>
            <p>{message.text}</p>

            {/* Render metadata texts as a list AFTER text has fully displayed */}
            {message.sender === "bot" && message.showMetadata && message.metadata && message.metadata.length > 0 && (
              <ul className="mt-2 pl-3 text-xs text-gray-700 list-disc">
                {message.metadata.map((metaText, i) => <li key={i}>{metaText}</li>)}
              </ul>
            )}
          </div>
        ))}

        {/* Typing Indicator (Shown only for backend responses, not welcome message) */}
        {loading && <p className="text-gray-500 text-sm">FinderAI is typing{typingDots}</p>}
      </div>

      {/* Multi-line Input Field */}
      <div className="flex mt-3">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Ask something... (Shift + Enter for new line)"
          className="flex-1 p-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={2} // Allows initial small input
        />
        <button 
          onClick={handleSendMessage} 
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
