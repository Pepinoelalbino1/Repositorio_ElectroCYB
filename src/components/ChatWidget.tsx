import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Bot } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: '👋 ¡Hola! Soy el asistente virtual de ElectroCYB. ¿En qué puedo ayudarte hoy?',
    },
  ]);

  const [input, setInput] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    const question = input;
    setInput('');

    try {
      const res = await axios.post(`${API_URL}/api/chat`, {
        message: question,
      });

      const botMessage: ChatMessage = {
        sender: 'bot',
        text: res.data.response || '😅 No entendí eso, ¿puedes repetirlo?',
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: '⚠ No pude conectar con el servidor. Intenta nuevamente.',
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      {/* Floating Button (SIN IMAGEN, SOLO ICONO) */}
      <button
        className="
          fixed bottom-40 right-6 
          bg-purple-600 hover:bg-purple-700 
          text-white rounded-full 
          w-16 h-16 flex items-center justify-center 
          shadow-xl shadow-purple-400/40
          transition-transform hover:scale-110 
          z-[9999]
        "
        onClick={() => setOpen(true)}
      >
        <Bot size={34} />
      </button>

      {/* Chat Panel */}
      {open && (
        <div
          className="
            fixed bottom-40 right-6 
            w-80 bg-white shadow-2xl rounded-2xl 
            flex flex-col border border-gray-200 
            animate-slide-up 
            z-[9999]
          "
        >
          {/* Header con icono */}
          <div className="bg-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Bot className="text-white" size={26} />
              </div>
              <div>
                <h3 className="font-bold text-lg">ElectroCYB Bot</h3>
                <p className="text-xs text-purple-200">Asistente Virtual</p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="hover:bg-purple-700 rounded-full p-1 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 h-80 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    px-3 py-2 rounded-xl max-w-[75%] text-sm shadow-sm 
                    ${
                      m.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border border-gray-200'
                    }
                  `}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 flex items-center bg-white rounded-b-2xl">
            <input
              className="
                flex-1 px-3 py-2 
                border border-gray-300 rounded-lg text-sm 
                focus:outline-none focus:ring-2 focus:ring-purple-500
                shadow-sm
              "
              placeholder="Escribe aquí..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="
                ml-2 bg-purple-600 hover:bg-purple-700 
                text-white px-4 py-2 rounded-lg text-sm shadow-md
              "
              onClick={sendMessage}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
