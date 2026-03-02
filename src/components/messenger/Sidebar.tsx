import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

export interface Chat {
  id: string;
  name: string;
  type: "dm" | "group" | "service" | "ai";
  avatar?: string;
  lastMessage?: string;
  lastTime?: string;
  unread?: number;
  online?: boolean;
  verified?: boolean;
}

interface SidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onChatSelect: (id: string) => void;
  currentUser: { name: string; username: string };
  onOpenSettings: () => void;
  onOpenAdmin?: () => void;
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

export default function Sidebar({ chats = DEMO_CHATS, activeChat, onChatSelect, currentUser, onOpenSettings, onOpenAdmin }: SidebarProps) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "dm" | "group">("all");

  const filtered = chats.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "all" || (tab === "dm" && (c.type === "dm" || c.type === "service" || c.type === "ai")) || (tab === "group" && c.type === "group");
    return matchSearch && matchTab;
  });

  const getAvatar = (chat: Chat) => {
    if (chat.type === "service") return (
      <div className="w-10 h-10 rounded-full nf-accent-bg flex items-center justify-center flex-shrink-0 relative">
        <Icon name="Moon" size={18} className="text-white" />
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2" style={{ borderColor: "hsl(var(--nf-bg-3))" }} />
      </div>
    );
    if (chat.type === "ai") return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative"
        style={{ background: "linear-gradient(135deg, hsl(var(--theme-color)), hsl(220 85% 75%))" }}>
        <Icon name="Sparkles" size={18} className="text-white" />
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2" style={{ borderColor: "hsl(var(--nf-bg-3))" }} />
      </div>
    );
    if (chat.type === "group") return (
      <div className="w-10 h-10 rounded-full nf-bg-4 flex items-center justify-center flex-shrink-0 relative">
        <Icon name="Users" size={18} className="nf-text-muted" />
      </div>
    );
    return (
      <div className="w-10 h-10 rounded-full nf-bg-4 flex items-center justify-center flex-shrink-0 relative">
        <span className="nf-text-primary font-semibold text-sm">{chat.name[0]}</span>
        {chat.online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2" style={{ borderColor: "hsl(var(--nf-bg-3))" }} />
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: "hsl(var(--nf-bg-2))" }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 nf-accent-bg rounded-md flex items-center justify-center">
              <Icon name="Moon" size={12} className="text-white" />
            </div>
            <span className="font-bold nf-text-primary text-sm tracking-wide">NIGHTFALL</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 nf-text-muted hover:nf-text-primary hover:nf-bg-4 rounded-lg"
            onClick={() => {}}
          >
            <Icon name="PenSquare" size={16} />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 nf-text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="w-full h-8 rounded-lg pl-8 pr-3 text-sm nf-bg-3 nf-text-primary placeholder:nf-text-muted border-0 outline-none"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          {(["all", "dm", "group"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1 rounded-lg text-xs font-medium transition-all ${
                tab === t ? "nf-accent-bg text-white" : "nf-text-muted hover:nf-text-secondary"
              }`}
            >
              {t === "all" ? "Все" : t === "dm" ? "Личные" : "Группы"}
            </button>
          ))}
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto py-2">
        {filtered.map(chat => (
          <button
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 mx-1 rounded-xl transition-all text-left ${
              activeChat === chat.id
                ? "nf-accent-bg/10 nf-accent-border border"
                : "hover:nf-bg-3"
            }`}
            style={activeChat === chat.id ? { borderColor: "hsl(var(--theme-color) / 0.3)" } : {}}
          >
            {getAvatar(chat)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  <span className={`text-sm font-medium truncate ${activeChat === chat.id ? "nf-accent" : "nf-text-primary"}`}>
                    {chat.name}
                  </span>
                  {chat.verified && <Icon name="BadgeCheck" size={13} className="nf-accent flex-shrink-0" />}
                  {chat.type === "ai" && <Icon name="Sparkles" size={12} className="nf-accent flex-shrink-0" />}
                </div>
                {chat.lastTime && <span className="text-xs nf-text-muted flex-shrink-0">{chat.lastTime}</span>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs nf-text-muted truncate">{chat.lastMessage}</span>
                {chat.unread ? (
                  <span className="nf-accent-bg text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium flex-shrink-0 ml-1">
                    {chat.unread > 9 ? "9+" : chat.unread}
                  </span>
                ) : null}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* User area */}
      <div className="p-3 border-t flex items-center gap-2.5" style={{ borderColor: "hsl(var(--border))", backgroundColor: "hsl(var(--nf-bg-1))" }}>
        <div className="w-9 h-9 rounded-full nf-accent-bg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-semibold">{currentUser.name[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium nf-text-primary truncate">{currentUser.name}</div>
          <div className="text-xs nf-text-muted truncate">@{currentUser.username}</div>
        </div>
        <div className="flex gap-1">
          {onOpenAdmin && (
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 nf-text-muted hover:nf-text-primary rounded-lg" onClick={onOpenAdmin}>
              <Icon name="ShieldAlert" size={15} />
            </Button>
          )}
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 nf-text-muted hover:nf-text-primary rounded-lg" onClick={onOpenSettings}>
            <Icon name="Settings" size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}
