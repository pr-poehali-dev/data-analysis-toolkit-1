import { useState } from "react";
import Sidebar, { Chat } from "./Sidebar";
import ChatArea from "./ChatArea";
import SettingsPage from "./SettingsPage";
import AdminPanel from "./AdminPanel";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface MessengerLayoutProps {
  user: { name: string; username: string; email: string };
  onLogout: () => void;
}

const DEMO_CHATS: Chat[] = [
  { id: "service", name: "Night", type: "service", lastMessage: "Добро пожаловать в NIGHTFALL!", lastTime: "12:00", verified: true },
  { id: "ai", name: "NightAI", type: "ai", lastMessage: "Чем могу помочь?", lastTime: "12:01", online: true },
  { id: "1", name: "Алексей Смирнов", type: "dm", lastMessage: "Привет! Как дела?", lastTime: "14:32", unread: 2, online: true },
  { id: "2", name: "Мария Козлова", type: "dm", lastMessage: "Увидимся завтра", lastTime: "13:15", online: false },
  { id: "3", name: "Команда разработки", type: "group", lastMessage: "Антон: Дизайн готов!", lastTime: "12:48", unread: 5 },
  { id: "4", name: "Друзья", type: "group", lastMessage: "Денис: Идём в кино?", lastTime: "11:20", unread: 0 },
  { id: "5", name: "Иван Петров", type: "dm", lastMessage: "Окей, договорились", lastTime: "Вчера", online: false },
];

const IS_ADMIN = true;

export default function MessengerLayout({ user, onLogout }: MessengerLayoutProps) {
  const [activeChat, setActiveChat] = useState<string | null>("service");
  const [showSettings, setShowSettings] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("blue");
  const [mode, setMode] = useState<"dark" | "light" | "system">("dark");
  const [chats, setChats] = useState<Chat[]>(DEMO_CHATS);

  const currentChat = chats.find(c => c.id === activeChat) || null;

  const handleThemeChange = (t: string) => {
    setTheme(t);
    const el = document.documentElement;
    el.classList.remove("theme-blue", "theme-red", "theme-orange", "theme-green");
    el.classList.add(`theme-${t}`);
  };

  const handleModeChange = (m: "dark" | "light" | "system") => {
    setMode(m);
    const el = document.documentElement;
    el.classList.remove("light-mode", "dark");
    if (m === "light") el.classList.add("light-mode");
    else if (m === "dark") el.classList.add("dark");
  };

  const handleServiceMessage = (text: string) => {
    setChats(prev => prev.map(c =>
      c.id === "service" ? { ...c, lastMessage: text, lastTime: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }) } : c
    ));
    if (activeChat !== "service") setActiveChat("service");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "hsl(var(--nf-bg-1))" }}>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center h-12 px-3 border-b flex-shrink-0"
        style={{ borderColor: "hsl(var(--border))", backgroundColor: "hsl(var(--nf-bg-2))" }}>
        <Button variant="ghost" size="sm" className="w-9 h-9 p-0 nf-text-muted hover:nf-text-primary rounded-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Icon name={sidebarOpen ? "X" : "Menu"} size={18} />
        </Button>
        <div className="flex-1 flex items-center justify-center gap-2">
          <div className="w-5 h-5 nf-accent-bg rounded-md flex items-center justify-center">
            <Icon name="Moon" size={11} className="text-white" />
          </div>
          <span className="font-bold nf-text-primary text-sm tracking-wide">NIGHTFALL</span>
        </div>
        <Button variant="ghost" size="sm" className="w-9 h-9 p-0 nf-text-muted hover:nf-text-primary rounded-lg"
          onClick={() => setShowSettings(true)}>
          <Icon name="Settings" size={16} />
        </Button>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? "flex" : "hidden"} lg:flex
          w-full lg:w-72 xl:w-80
          flex-col flex-shrink-0
          absolute lg:relative inset-0 z-40 lg:z-auto
          h-full
        `}>
          <Sidebar
            chats={chats}
            activeChat={activeChat}
            onChatSelect={(id) => { setActiveChat(id); setSidebarOpen(false); }}
            currentUser={user}
            onOpenSettings={() => setShowSettings(true)}
            onOpenAdmin={IS_ADMIN ? () => setShowAdmin(true) : undefined}
          />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="lg:hidden absolute inset-0 z-30 bg-black/50" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatArea
            chat={currentChat}
            currentUser={user}
          />
        </div>
      </div>

      {/* Settings overlay */}
      {showSettings && (
        <SettingsPage
          user={user}
          onClose={() => setShowSettings(false)}
          onThemeChange={handleThemeChange}
          onModeChange={handleModeChange}
          currentTheme={theme}
          currentMode={mode}
        />
      )}

      {/* Admin panel */}
      {showAdmin && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          onServiceMessage={handleServiceMessage}
        />
      )}
    </div>
  );
}
