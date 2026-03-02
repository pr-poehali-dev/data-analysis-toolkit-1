import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Chat } from "./Sidebar";

interface Message {
  id: string;
  sender: string;
  senderInitial: string;
  text?: string;
  time: string;
  type?: "text" | "voice" | "file" | "geo" | "image" | "system";
  isMe?: boolean;
  isEncrypted?: boolean;
  fileName?: string;
  fileSize?: string;
  duration?: string;
  lat?: number;
  lng?: number;
}

const DEMO_MESSAGES: Record<string, Message[]> = {
  service: [
    { id: "s1", sender: "Night", senderInitial: "N", text: "Добро пожаловать в NIGHTFALL! 🌙", time: "12:00", type: "text", isEncrypted: true },
    { id: "s2", sender: "Night", senderInitial: "N", text: "Ваш аккаунт успешно создан и защищён end-to-end шифрованием.", time: "12:00", type: "text" },
    { id: "s3", sender: "Night", senderInitial: "N", text: "Все ваши сообщения приватны — только вы и получатель могут их читать.", time: "12:01", type: "text" },
  ],
  ai: [
    { id: "a1", sender: "NightAI", senderInitial: "A", text: "Привет! Я NightAI — ваш встроенный ИИ-ассистент. Чем могу помочь?", time: "12:01", type: "text" },
  ],
  "1": [
    { id: "m1", sender: "Алексей", senderInitial: "А", text: "Привет! Как дела?", time: "14:30", type: "text" },
    { id: "m2", sender: "Я", senderInitial: "Я", text: "Отлично, спасибо!", time: "14:31", type: "text", isMe: true },
    { id: "m3", sender: "Алексей", senderInitial: "А", text: "Когда встретимся?", time: "14:32", type: "text" },
  ],
  "2": [
    { id: "m1", sender: "Мария", senderInitial: "М", text: "Завтра в 15:00 подойдёт?", time: "13:10", type: "text" },
    { id: "m2", sender: "Я", senderInitial: "Я", text: "Да, всё хорошо!", time: "13:12", type: "text", isMe: true },
    { id: "m3", sender: "Мария", senderInitial: "М", text: "Увидимся завтра", time: "13:15", type: "text" },
  ],
  "3": [
    { id: "m1", sender: "Антон", senderInitial: "Ан", text: "Дизайн готов!", time: "12:45", type: "text" },
    { id: "m2", sender: "Антон", senderInitial: "Ан", fileName: "design_v2.fig", fileSize: "4.2 MB", time: "12:46", type: "file" },
    { id: "m3", sender: "Мария", senderInitial: "М", text: "Отлично, смотрю!", time: "12:48", type: "text" },
  ],
  "4": [
    { id: "m1", sender: "Денис", senderInitial: "Д", text: "Идём в кино вечером?", time: "11:18", type: "text" },
    { id: "m2", sender: "Я", senderInitial: "Я", text: "Я за!", time: "11:20", type: "text", isMe: true },
  ],
  "5": [
    { id: "m1", sender: "Иван", senderInitial: "Ив", text: "Окей, договорились", time: "Вчера", type: "text" },
  ],
};

interface ChatAreaProps {
  chat: Chat | null;
  currentUser: { name: string };
  onOpenInfo?: () => void;
}

export default function ChatArea({ chat, currentUser, onOpenInfo }: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const chatMessages = chat ? [...(DEMO_MESSAGES[chat.id] || []), ...messages] : [];

  const sendMessage = () => {
    if (!input.trim() || !chat) return;
    const msg: Message = {
      id: Date.now().toString(),
      sender: currentUser.name,
      senderInitial: currentUser.name[0],
      text: input,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      type: "text",
      isMe: true,
      isEncrypted: true,
    };
    setMessages(prev => [...prev, msg]);
    const userInput = input;
    setInput("");

    if (chat.type === "ai") {
      setAiLoading(true);
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "NightAI",
          senderInitial: "A",
          text: `Понял вас! Вы написали: "${userInput}". В реальном приложении здесь будет ответ от DeepSeek AI через API.`,
          time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
          type: "text",
          isEncrypted: true,
        };
        setMessages(prev => [...prev, aiMsg]);
        setAiLoading(false);
      }, 1200);
    }
  };

  const sendGeo = () => {
    if (!chat) return;
    const msg: Message = {
      id: Date.now().toString(),
      sender: currentUser.name,
      senderInitial: currentUser.name[0],
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      type: "geo",
      isMe: true,
      lat: 55.751244,
      lng: 37.618423,
    };
    setMessages(prev => [...prev, msg]);
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center nf-bg-3 flex-col gap-4">
        <div className="w-20 h-20 nf-bg-2 rounded-2xl flex items-center justify-center">
          <Icon name="MessageCircle" size={36} className="nf-text-muted" />
        </div>
        <div className="text-center">
          <p className="nf-text-primary font-semibold text-lg mb-1">Выберите чат</p>
          <p className="nf-text-muted text-sm">Все сообщения защищены E2E-шифрованием</p>
        </div>
        <div className="e2e-badge rounded-xl px-4 py-2 flex items-center gap-2 mt-2">
          <Icon name="Lock" size={14} className="nf-accent" />
          <span className="text-xs nf-text-secondary">NIGHTFALL · End-to-End Encrypted</span>
        </div>
      </div>
    );
  }

  const getChatIcon = () => {
    if (chat.type === "service") return <Icon name="Moon" size={18} className="text-white" />;
    if (chat.type === "ai") return <Icon name="Sparkles" size={18} className="text-white" />;
    if (chat.type === "group") return <Icon name="Users" size={18} className="nf-text-muted" />;
    return <span className="font-semibold text-sm nf-text-primary">{chat.name[0]}</span>;
  };

  return (
    <div className="flex-1 flex flex-col nf-bg-3 h-full">
      {/* Header */}
      <div className="h-14 border-b flex items-center px-4 gap-3 flex-shrink-0"
        style={{ borderColor: "hsl(var(--border))", backgroundColor: "hsl(var(--nf-bg-3))" }}>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
          chat.type === "service" || chat.type === "ai" ? "nf-accent-bg" : "nf-bg-4"
        }`}
          style={chat.type === "ai" ? { background: "linear-gradient(135deg, hsl(var(--theme-color)), hsl(220 85% 75%))" } : {}}>
          {getChatIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold nf-text-primary text-sm">{chat.name}</span>
            {chat.verified && <Icon name="BadgeCheck" size={14} className="nf-accent" />}
            {chat.type === "ai" && <span className="text-xs nf-accent font-medium">AI</span>}
          </div>
          <span className="text-xs nf-text-muted">
            {chat.type === "group" ? "Группа" : chat.type === "service" ? "Сервисный канал" : chat.type === "ai" ? "ИИ-ассистент" : chat.online ? "Онлайн" : "Не в сети"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {chat.type !== "service" && (
            <>
              <Button variant="ghost" size="sm" className="w-9 h-9 p-0 nf-text-muted hover:nf-text-primary rounded-lg">
                <Icon name="Phone" size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="w-9 h-9 p-0 nf-text-muted hover:nf-text-primary rounded-lg">
                <Icon name="Video" size={16} />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" className="w-9 h-9 p-0 nf-text-muted hover:nf-text-primary rounded-lg">
            <Icon name="Search" size={16} />
          </Button>
          {onOpenInfo && (
            <Button variant="ghost" size="sm" className="w-9 h-9 p-0 nf-text-muted hover:nf-text-primary rounded-lg" onClick={onOpenInfo}>
              <Icon name="Info" size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {/* E2E notice */}
        <div className="flex justify-center mb-4">
          <div className="e2e-badge rounded-full px-4 py-1.5 flex items-center gap-1.5">
            <Icon name="Lock" size={11} className="nf-accent" />
            <span className="text-xs nf-text-muted">Сообщения защищены end-to-end шифрованием</span>
          </div>
        </div>

        {chatMessages.map((msg, i) => {
          const prevMsg = chatMessages[i - 1];
          const showSender = !prevMsg || prevMsg.sender !== msg.sender;

          if (msg.isMe) {
            return (
              <div key={msg.id} className={`flex justify-end ${showSender ? "mt-3" : "mt-0.5"}`}>
                <div className="max-w-[70%]">
                  {msg.type === "file" ? (
                    <div className="nf-accent-bg rounded-2xl rounded-tr-sm px-4 py-3 flex items-center gap-3">
                      <Icon name="File" size={20} className="text-white/80" />
                      <div>
                        <div className="text-white text-sm font-medium">{msg.fileName}</div>
                        <div className="text-white/70 text-xs">{msg.fileSize}</div>
                      </div>
                      <Icon name="Download" size={16} className="text-white/70 ml-2" />
                    </div>
                  ) : msg.type === "geo" ? (
                    <div className="rounded-2xl rounded-tr-sm overflow-hidden nf-bg-2 border" style={{ borderColor: "hsl(var(--border))" }}>
                      <div className="nf-bg-4 h-24 flex items-center justify-center">
                        <Icon name="MapPin" size={24} className="nf-accent" />
                      </div>
                      <div className="px-3 py-2">
                        <span className="text-xs nf-text-muted">Геолокация отправлена</span>
                      </div>
                    </div>
                  ) : msg.type === "voice" ? (
                    <div className="nf-accent-bg rounded-2xl rounded-tr-sm px-4 py-3 flex items-center gap-3 min-w-[160px]">
                      <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Icon name="Play" size={14} className="text-white" />
                      </button>
                      <div className="flex-1 h-1 bg-white/30 rounded-full">
                        <div className="w-1/3 h-full bg-white rounded-full" />
                      </div>
                      <span className="text-white/80 text-xs">{msg.duration || "0:12"}</span>
                    </div>
                  ) : (
                    <div className="nf-accent-bg rounded-2xl rounded-tr-sm px-4 py-2.5">
                      <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-1 mt-1 pr-1">
                    <span className="text-xs nf-text-muted">{msg.time}</span>
                    {msg.isEncrypted && <Icon name="Lock" size={10} className="nf-text-muted" />}
                    <Icon name="CheckCheck" size={12} className="nf-accent" />
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex gap-3 ${showSender ? "mt-3" : "mt-0.5"}`}>
              {showSender ? (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  msg.sender === "NightAI" ? "" : "nf-bg-4"
                }`}
                  style={msg.sender === "NightAI" ? { background: "linear-gradient(135deg, hsl(var(--theme-color)), hsl(220 85% 75%))" } : {}}>
                  {msg.sender === "Night" || msg.sender === "NightAI"
                    ? <Icon name={msg.sender === "NightAI" ? "Sparkles" : "Moon"} size={14} className="text-white" />
                    : <span className="text-xs nf-text-primary font-medium">{msg.senderInitial}</span>}
                </div>
              ) : <div className="w-8 flex-shrink-0" />}

              <div className="max-w-[70%]">
                {showSender && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold nf-text-primary">{msg.sender}</span>
                    <span className="text-xs nf-text-muted">{msg.time}</span>
                    {msg.isEncrypted && <Icon name="Lock" size={10} className="nf-text-muted" />}
                  </div>
                )}
                {msg.type === "file" ? (
                  <div className="nf-bg-2 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-3 border" style={{ borderColor: "hsl(var(--border))" }}>
                    <Icon name="File" size={20} className="nf-accent" />
                    <div>
                      <div className="nf-text-primary text-sm font-medium">{msg.fileName}</div>
                      <div className="nf-text-muted text-xs">{msg.fileSize}</div>
                    </div>
                    <Icon name="Download" size={16} className="nf-text-muted ml-2" />
                  </div>
                ) : msg.type === "voice" ? (
                  <div className="nf-bg-2 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-3 min-w-[160px] border" style={{ borderColor: "hsl(var(--border))" }}>
                    <button className="w-8 h-8 rounded-full nf-accent-bg flex items-center justify-center">
                      <Icon name="Play" size={14} className="text-white" />
                    </button>
                    <div className="flex-1 h-1 nf-bg-4 rounded-full">
                      <div className="w-0 h-full nf-accent-bg rounded-full" />
                    </div>
                    <span className="nf-text-muted text-xs">{msg.duration || "0:12"}</span>
                  </div>
                ) : (
                  <div className="nf-bg-2 rounded-2xl rounded-tl-sm px-4 py-2.5 border" style={{ borderColor: "hsl(var(--border))" }}>
                    <p className="nf-text-primary text-sm leading-relaxed">{msg.text}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {aiLoading && (
          <div className="flex gap-3 mt-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, hsl(var(--theme-color)), hsl(220 85% 75%))" }}>
              <Icon name="Sparkles" size={14} className="text-white" />
            </div>
            <div className="nf-bg-2 rounded-2xl rounded-tl-sm px-4 py-3 border" style={{ borderColor: "hsl(var(--border))" }}>
              <div className="flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 rounded-full nf-accent-bg animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full nf-accent-bg animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full nf-accent-bg animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      {chat.type !== "service" && (
        <div className="p-3 border-t flex-shrink-0" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="flex items-end gap-2 nf-bg-2 rounded-2xl px-3 py-2 border" style={{ borderColor: "hsl(var(--border))" }}>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 nf-text-muted hover:nf-text-primary rounded-lg flex-shrink-0 mb-0.5">
              <Icon name="Plus" size={18} />
            </Button>

            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder={chat.type === "ai" ? "Спросите NightAI..." : "Напишите сообщение..."}
              className="flex-1 bg-transparent outline-none nf-text-primary placeholder:nf-text-muted text-sm py-1 resize-none"
            />

            <div className="flex items-center gap-1 flex-shrink-0 mb-0.5">
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 nf-text-muted hover:nf-text-primary rounded-lg" title="Прикрепить файл">
                <Icon name="Paperclip" size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 nf-text-muted hover:nf-text-primary rounded-lg" title="Фото">
                <Icon name="Image" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`w-8 h-8 p-0 rounded-lg ${isRecording ? "text-red-500" : "nf-text-muted hover:nf-text-primary"}`}
                title="Голосовое сообщение"
                onClick={() => setIsRecording(!isRecording)}
              >
                <Icon name={isRecording ? "StopCircle" : "Mic"} size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 nf-text-muted hover:nf-text-primary rounded-lg" title="Геолокация" onClick={sendGeo}>
                <Icon name="MapPin" size={16} />
              </Button>

              {input.trim() ? (
                <Button size="sm" className="w-8 h-8 p-0 nf-accent-bg hover:opacity-90 rounded-lg ml-1" onClick={sendMessage}>
                  <Icon name="Send" size={15} className="text-white" />
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
