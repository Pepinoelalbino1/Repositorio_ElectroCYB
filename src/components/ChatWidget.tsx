import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

// ------------------ Interfaces ------------------

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ParsedProduct {
  id?: number;
  name: string;
  price?: string;
  description?: string;
}

interface ParsedProductBlock {
  intro: string;
  products: ParsedProduct[];
  outro?: string;
}

// Información de producto traída del backend
interface ProductoDetalleApi {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  imagen: string;
  precio: string;
  stock: number;
}

// 🔧 URL base del backend (puedes configurar VITE_BACKEND_URL en .env)
const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

// Sugerencias rápidas
const quickSuggestions = [
  '¿Qué métodos de pago aceptan?',
  '¿Cuáles son los métodos de entrega?',
  'Recomiéndame una lámpara LED para sala',
  '¿Tienen garantía los productos?',
];

// 🔍 Detecta y parsea productos del mensaje de texto
const parseProductsFromMessage = (content: string): ParsedProductBlock | null => {
  const lines = content.split('\n');

  const productLineIndexes: number[] = [];
  lines.forEach((line, idx) => {
    if (line.trim().startsWith('•')) {
      productLineIndexes.push(idx);
    }
  });

  if (productLineIndexes.length === 0) {
    return null;
  }

  const firstIdx = productLineIndexes[0];
  const lastIdx = productLineIndexes[productLineIndexes.length - 1];

  const introLines = lines.slice(0, firstIdx).join('\n').trim();
  const outroLines = lines.slice(lastIdx + 1).join('\n').trim();

  const products: ParsedProduct[] = productLineIndexes.map((idx) => {
    let line = lines[idx].trim().replace(/^•\s*/, '');

    // Detectar patrón [id] al inicio, ej: "[1] Lámpara LED..."
    let id: number | undefined;
    const idMatch = line.match(/^\[(\d+)\]\s*(.*)$/);
    if (idMatch) {
      id = Number(idMatch[1]);
      line = idMatch[2]; // resto de la línea sin [id]
    }

    // Esperamos algo como: "Nombre — S/ 35.00 — Descripción..."
    const parts = line.split('—').map((p) => p.trim());

    const name = parts[0] || '';
    let price: string | undefined;
    let description: string | undefined;

    if (parts.length >= 2) {
      // Heurística: si contiene "S/" o "USD" lo tratamos como precio
      if (parts[1].toLowerCase().includes('s/')) {
        price = parts[1];
        if (parts.length >= 3) {
          description = parts.slice(2).join(' — ');
        }
      } else {
        // Si no tiene moneda, lo tomamos como descripción
        description = parts.slice(1).join(' — ');
      }
    }

    return { id, name, price, description };
  });

  return {
    intro: introLines,
    products,
    outro: outroLines || undefined,
  };
};

// 🧩 Card individual de producto (pide la imagen al backend si tiene id)
const ProductCard: React.FC<{
  product: ParsedProduct;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}> = ({ product, setInput }) => {
  const [detalle, setDetalle] = useState<ProductoDetalleApi | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDetalle = async () => {
      if (!product.id) return;
      setIsLoading(true);
      try {
        // axiosInstance suele tener baseURL = "http://localhost:8080/api"
        // Esto llama a GET http://localhost:8080/api/productos/{id}
        const res = await axiosInstance.get<ProductoDetalleApi>(
          `/productos/${product.id}`
        );
        setDetalle(res.data);
      } catch (error) {
        console.error('Error cargando detalle de producto', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetalle();
  }, [product.id]);

  const displayName = detalle?.nombre ?? product.name;
  const displayPrice = detalle?.precio ? `S/ ${detalle.precio}` : product.price;
  const displayDescription = detalle?.descripcion ?? product.description;

  // Construimos la URL completa de la imagen
  const rawImagePath = detalle?.imagen;
  const imageUrl =
    rawImagePath && rawImagePath.length > 0
      ? rawImagePath.startsWith('http')
        ? rawImagePath
        : `${BACKEND_BASE_URL}${rawImagePath}`
      : undefined;

  return (
    <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 flex gap-2">
      {/* Imagen */}
      {imageUrl ? (
        <div className="flex-shrink-0">
          <img
            src={imageUrl}
            alt={displayName}
            className="h-16 w-16 rounded-lg object-cover border border-gray-200"
          />
        </div>
      ) : (
        <div className="flex-shrink-0 h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
          {isLoading ? 'Cargando...' : 'Sin imagen'}
        </div>
      )}

      {/* Info */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-semibold text-sm text-gray-900 truncate">
            {displayName}
          </h4>
          {displayPrice && (
            <span className="text-xs font-semibold text-blue-600 whitespace-nowrap">
              {displayPrice}
            </span>
          )}
        </div>

        {displayDescription && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {displayDescription}
          </p>
        )}

        <div className="mt-1 flex flex-wrap gap-2">
          {/* Preguntar por el producto */}
          <button
            type="button"
            onClick={() =>
              setInput((prev) =>
                prev && !prev.endsWith(' ')
                  ? `${prev} ${displayName}`
                  : displayName
              )
            }
            className="text-[11px] text-blue-600 hover:underline"
          >
            Preguntar por este producto
          </button>

          {/* Ver producto (si tenemos id) */}
          {product.id && (
            <Link
              to={`/catalogo/${product.id}`}
              className="text-[11px] text-emerald-600 hover:underline font-medium"
            >
              Ver producto
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

// 🧠 ChatWidget con voz
const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy el asistente de ElectroCYB. ¿En qué puedo ayudarte? 😊',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Voz
  const [isListening, setIsListening] = useState(false);
  const [readAloud, setReadAloud] = useState(false);

  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>(''); // acumulamos el texto final
  const hasSentVoiceRef = useRef<boolean>(false); // evita múltiples envíos
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  // Autoscroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending]);

  // -------- Text-to-Speech (leer respuestas) --------
  const speak = useCallback(
    (text: string) => {
      if (!readAloud) return;
      if (typeof window === 'undefined') return;
      if (!('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'es-PE'; // español Perú
      window.speechSynthesis.speak(utter);
    },
    [readAloud]
  );

  // -------- Enviar mensaje al backend (evitando duplicar burbuja user) --------
  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    // 1) Construimos el historial que enviaremos (sin duplicar última burbuja de usuario)
    const last = messages[messages.length - 1];
    let historyMessages: ChatMessage[] = messages;

    if (!last || last.role !== 'user' || last.content !== trimmed) {
      historyMessages = [...messages, { role: 'user', content: trimmed }];
      setMessages(historyMessages);
    }

    setInput('');
    setIsSending(true);

    try {
      const historyPayload = historyMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await axiosInstance.post('/chatbot', {
        message: trimmed,
        history: historyPayload,
      });

      const reply: string =
        res?.data?.reply ?? 'Lo siento, hubo un problema al responder.';

      setMessages((prev): ChatMessage[] => {
        const updated: ChatMessage[] = [
          ...prev,
          { role: 'assistant', content: reply },
        ];
        speak(reply);
        return updated;
      });
    } catch (error) {
      console.error('Error en chatbot:', error);
      const fallback =
        'Ups, tuve un problema al responder en este momento. Inténtalo de nuevo en unos segundos 🙏';

      setMessages((prev): ChatMessage[] => {
        const updated: ChatMessage[] = [
          ...prev,
          { role: 'assistant', content: fallback },
        ];
        speak(fallback);
        return updated;
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text: string) => {
    sendMessage(text);
  };

  const isSendDisabled = isSending || input.trim().length === 0;

  // --------- SpeechRecognition (voz → texto, AUTO-ENVÍO al terminar) ---------
  const initRecognition = (): any => {
    if (typeof window === 'undefined') return null;

    const AnyWindow = window as any;
    const SpeechRecognitionCtor =
      AnyWindow.SpeechRecognition || AnyWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      alert('Tu navegador no soporta reconocimiento de voz (Web Speech API).');
      return null;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'es-PE';
    recognition.interimResults = true;
    recognition.continuous = false;

    return recognition;
  };

  const handleToggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = initRecognition();
    if (!recognition) return;

    // reiniciamos acumuladores de esta sesión de voz
    recognitionRef.current = recognition;
    finalTranscriptRef.current = '';
    hasSentVoiceRef.current = false;
    setIsListening(true);

    recognition.onresult = (event: any) => {
      let finalText = '';
      let interim = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) {
          finalText += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      finalTranscriptRef.current = finalText.trim();
      const combined = (finalText + ' ' + interim).trim();
      setInput(combined);
    };

    recognition.onerror = (e: any) => {
      console.error('SpeechRecognition error', e);
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;

      // AUTO-ENVÍO solo una vez
      if (hasSentVoiceRef.current) return;

      const textToSend =
        finalTranscriptRef.current.trim() || input.trim();

      if (textToSend) {
        hasSentVoiceRef.current = true;
        sendMessage(textToSend);
      }
    };

    recognition.start();
  };

  // -------- Render de burbuja del asistente --------
  const renderAssistantBubble = (content: string) => {
    const parsed = parseProductsFromMessage(content);

    if (!parsed || parsed.products.length === 0) {
      // Mensaje normal
      return (
        <div className="px-3 py-2 rounded-2xl max-w-[80%] whitespace-pre-wrap bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm">
          {content}
        </div>
      );
    }

    return (
      <div className="px-3 py-2 rounded-2xl max-w-[100%] bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm space-y-3">
        {parsed.intro && (
          <p className="text-sm whitespace-pre-wrap">{parsed.intro}</p>
        )}

        {/* Grid de cards de productos */}
        <div className="grid grid-cols-1 gap-2">
          {parsed.products.map((p, i) => (
            <ProductCard key={i} product={p} setInput={setInput} />
          ))}
        </div>

        {parsed.outro && (
          <p className="text-xs text-gray-500 whitespace-pre-wrap">
            {parsed.outro}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Botón flotante (ahora abajo a la IZQUIERDA, para no tapar otros botones) */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-40 group"
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
      >
        <div className="flex items-center gap-3">
          {/* Etiqueta solo en desktop */}
          <div className="hidden md:flex items-center bg-white/90 backdrop-blur px-3 py-2 rounded-full text-xs text-slate-700 border border-slate-200 shadow-md group-hover:bg-white">
            ¿Necesitas ayuda?
          </div>

          {/* Burbuja principal del bot */}
          <div className="relative h-12 w-12 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-xl border border-white group-hover:scale-105 transition-transform">
            <MessageCircle className="h-6 w-6 text-white" />
            {/* indicador online */}
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
        </div>
      </button>

      {/* Ventana de chat */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 md:bottom-24 md:left-8 z-40 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">
                {/* Icono del bot */}
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Asistente ElectroCYB</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                  En línea
                </p>
              </div>
            </div>

            {/* Controles de voz en el header */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setReadAloud((prev) => !prev)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20"
                title={
                  readAloud
                    ? 'Desactivar lectura en voz alta'
                    : 'Leer respuestas en voz alta'
                }
              >
                {readAloud ? (
                  <Volume2 className="h-4 w-4 text-white" />
                ) : (
                  <VolumeX className="h-4 w-4 text-white" />
                )}
              </button>

              <button
                onClick={toggleOpen}
                className="text-blue-100 hover:text-white"
                aria-label="Cerrar chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 flex flex-col bg-gray-50">
            <div className="flex-1 p-3 space-y-2 max-h-80 overflow-y-auto text-sm">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {m.role === 'user' ? (
                    <div className="px-3 py-2 rounded-2xl max-w-[80%] whitespace-pre-wrap bg-blue-600 text-white rounded-br-sm shadow-sm">
                      {m.content}
                    </div>
                  ) : (
                    renderAssistantBubble(m.content)
                  )}
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-2xl bg-white text-gray-500 border border-gray-200 text-xs flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
                    </span>
                    Escribiendo...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Sugerencias rápidas */}
            <div className="px-3 pb-1 flex flex-wrap gap-2 text-[11px] border-t border-gray-100 bg-gray-50">
              {quickSuggestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSuggestionClick(q)}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition text-gray-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-2 bg-white">
            <div className="flex items-end gap-2">
              {/* Botón micrófono */}
              <button
                type="button"
                onClick={handleToggleListening}
                className={`p-2 rounded-xl border ${
                  isListening
                    ? 'border-red-400 bg-red-50 text-red-600'
                    : 'border-gray-300 bg-gray-100 text-gray-700'
                }`}
                aria-label="Activar dictado por voz"
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-24"
                placeholder={
                  isListening
                    ? 'Escuchando... al terminar se enviará tu mensaje'
                    : 'Escribe o usa el micrófono (Enter para enviar, Shift+Enter para salto de línea)'
                }
              />
              <button
                onClick={handleSend}
                disabled={isSendDisabled}
                className={`p-2 rounded-xl flex items-center justify-center ${
                  isSendDisabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                aria-label="Enviar mensaje"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;