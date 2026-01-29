"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hello! I am your safety assistant. I can answer questions about the chemicals in your current library. What can I help you with?",
  timestamp: new Date(),
};

// Simulated AI responses based on keywords
function getSimulatedResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Acetone or First Aid related questions
  if (lowerQuery.includes("acetone") || lowerQuery.includes("first aid") || lowerQuery.includes("eye") || lowerQuery.includes("emergency")) {
    return "For **Industrial Grade Acetone**, if it gets in the eyes, rinse cautiously with water for several minutes. Remove contact lenses if present and easy to do. Continue rinsing.\n\nAlways wear **butyl rubber gloves** and **safety glasses with side-shields** when handling.\n\n⚠️ This chemical is highly flammable - keep away from heat, sparks, and open flames.";
  }
  
  // PPE related questions
  if (lowerQuery.includes("ppe") || lowerQuery.includes("protective equipment") || lowerQuery.includes("gloves") || lowerQuery.includes("protection")) {
    return "Across your selected location, the most common **PPE requirements** are:\n\n• 🥽 Safety glasses / goggles\n• 🧤 Nitrile or butyl rubber gloves\n• 😷 Face shields (for corrosive materials)\n• 👔 Protective clothing / lab coats\n\nWould you like me to list specific requirements for a certain area or chemical?";
  }
  
  // Storage related questions
  if (lowerQuery.includes("storage") || lowerQuery.includes("store") || lowerQuery.includes("cabinet") || lowerQuery.includes("flammable")) {
    return "Based on your library, here are the **key storage requirements**:\n\n🔥 **Flammable liquids** (Acetone, IPA, MEK): Store in approved flammable storage cabinets, away from heat sources.\n\n⚗️ **Corrosives** (Sulfuric Acid, NaOH): Store in corrosion-resistant containers, separated from incompatible materials.\n\n🔒 **General**: Keep all containers tightly closed and properly labeled.";
  }
  
  // Hazard related questions
  if (lowerQuery.includes("hazard") || lowerQuery.includes("danger") || lowerQuery.includes("warning") || lowerQuery.includes("risk")) {
    return "Your library contains chemicals with the following **hazard classifications**:\n\n🔥 **Flammable**: Acetone, Isopropyl Alcohol, MEK, Diesel\n⚠️ **Corrosive**: Sulfuric Acid, Sodium Hydroxide, Ammonia\n🫁 **Health Hazard**: Welding Electrodes (respiratory)\n🌍 **Environmental**: Hydraulic Oil, Ammonia\n\nWhich hazard type would you like more details on?";
  }
  
  // Location or inventory questions
  if (lowerQuery.includes("where") || lowerQuery.includes("location") || lowerQuery.includes("find") || lowerQuery.includes("inventory")) {
    return "I can help you locate chemicals! Here's a quick summary:\n\n📍 **North Facility**: Acetone, Sodium Hydroxide, Welding Electrodes, Ammonia\n📍 **Main Campus**: Sulfuric Acid, Hydraulic Oil, Oxygen, Diesel\n📍 **Distribution Center**: Isopropyl Alcohol, MEK\n\nAsk me about a specific chemical to get its exact location path.";
  }
  
  // Specific chemical questions
  if (lowerQuery.includes("sulfuric acid") || lowerQuery.includes("acid")) {
    return "**Sulfuric Acid 98%** is a highly corrosive material.\n\n⚠️ **Signal Word**: DANGER\n\n**Required PPE**:\n• Full face shield\n• Acid-resistant gloves\n• Chemical-resistant apron\n• Rubber boots\n\n**First Aid (Eyes)**: Immediately flush with plenty of water for at least 20 minutes. Seek medical attention immediately.\n\n📍 Location: Main Campus > Chemical Storage > Acid Cabinet";
  }
  
  // Default response for unknown queries
  return "I can help you with questions about:\n\n• 🧪 Specific chemicals and their hazards\n• 🛡️ PPE requirements\n• 🚨 First aid procedures\n• 📦 Storage requirements\n• 📍 Chemical locations\n\nTry asking something like \"What PPE do I need for acetone?\" or \"Where is the sulfuric acid stored?\"";
}

export default function SDSAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI "thinking" delay
    setTimeout(() => {
      const response = getSimulatedResponse(userMessage.content);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format message content with markdown-like styling
  const formatMessage = (content: string) => {
    return content.split("\n").map((line, i) => {
      // Bold text
      const formattedLine = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      return (
        <span key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    }).reduce((acc: React.ReactNode[], curr, i) => {
      if (i === 0) return [curr];
      return [...acc, <br key={`br-${i}`} />, curr];
    }, []);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-40 ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105"
        }`}
        title={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        
        {/* Notification dot when closed */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-40 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">SDS AI Assistant</h3>
              <p className="text-indigo-200 text-xs">Ask me about your chemicals</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    message.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-indigo-600">AI Assistant</span>
                    </div>
                  )}
                  <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    message.role === "user" ? "" : "text-gray-700"
                  }`}>
                    {formatMessage(message.content)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-indigo-600">AI Assistant</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-xs text-gray-500 ml-2">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="px-4 py-2 bg-white border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setInputValue("What PPE do I need?");
                  setTimeout(() => handleSendMessage(), 100);
                }}
                className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors"
              >
                PPE requirements
              </button>
              <button
                onClick={() => {
                  setInputValue("First aid for acetone");
                  setTimeout(() => handleSendMessage(), 100);
                }}
                className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors"
              >
                First aid
              </button>
              <button
                onClick={() => {
                  setInputValue("Storage requirements");
                  setTimeout(() => handleSendMessage(), 100);
                }}
                className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors"
              >
                Storage
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about chemicals, PPE, storage..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={`p-2.5 rounded-full transition-all ${
                  inputValue.trim() && !isTyping
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
