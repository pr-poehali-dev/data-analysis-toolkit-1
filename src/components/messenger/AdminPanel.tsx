import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";

interface AdminPanelProps {
  onClose: () => void;
  onServiceMessage: (text: string) => void;
}

export default function AdminPanel({ onClose, onServiceMessage }: AdminPanelProps) {
  const [techMode, setTechMode] = useState(false);
  const [serviceMsg, setServiceMsg] = useState("");
  const [notification, setNotification] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  const handleSend = (type: "service" | "notification") => {
    const text = type === "service" ? serviceMsg : notification;
    if (!text.trim()) return;
    onServiceMessage(text);
    setSent(type);
    if (type === "service") setServiceMsg("");
    else setNotification("");
    setTimeout(() => setSent(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "hsl(var(--nf-bg-1) / 0.95)" }}>
      <div className="w-full max-w-lg nf-bg-3 rounded-2xl border shadow-2xl" style={{ borderColor: "hsl(var(--border))" }}>
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "hsl(0 72% 55% / 0.15)" }}>
            <Icon name="ShieldAlert" size={20} style={{ color: "hsl(0 72% 55%)" }} />
          </div>
          <div className="flex-1">
            <h2 className="font-bold nf-text-primary">Панель администратора</h2>
            <p className="text-xs nf-text-muted">NIGHTFALL · NightINC</p>
          </div>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 nf-text-muted hover:nf-text-primary rounded-lg" onClick={onClose}>
            <Icon name="X" size={16} />
          </Button>
        </div>

        <div className="p-5 space-y-5">
          {/* Tech works toggle */}
          <div className="nf-bg-2 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                techMode ? "bg-red-500/15" : "nf-bg-4"
              }`}>
                <Icon name={techMode ? "WrenchIcon" : "Zap"} size={18} className={techMode ? "text-red-400" : "nf-text-muted"} />
              </div>
              <div>
                <p className="nf-text-primary font-medium text-sm">Технические работы</p>
                <p className="nf-text-muted text-xs">{techMode ? "Сервис недоступен для пользователей" : "Сервис работает в штатном режиме"}</p>
              </div>
            </div>
            <button
              onClick={() => setTechMode(!techMode)}
              className={`w-12 h-6 rounded-full transition-all relative ${techMode ? "bg-red-500" : "nf-bg-4"}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${techMode ? "left-6" : "left-0.5"}`} />
            </button>
          </div>

          {techMode && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400 animate-fade-in"
              style={{ backgroundColor: "hsl(0 72% 55% / 0.1)", border: "1px solid hsl(0 72% 55% / 0.2)" }}>
              <Icon name="AlertTriangle" size={16} />
              <span>Режим технических работ активен</span>
            </div>
          )}

          {/* Service chat message */}
          <div className="space-y-2">
            <label className="text-xs font-semibold nf-text-secondary uppercase tracking-wide flex items-center gap-2">
              <Icon name="Moon" size={12} className="nf-accent" />
              Сообщение в сервисный чат (Night)
            </label>
            <div className="flex gap-2">
              <Input
                value={serviceMsg}
                onChange={e => setServiceMsg(e.target.value)}
                placeholder="Напишите сообщение от Night..."
                className="nf-bg-2 border-border nf-text-primary h-11"
                onKeyDown={e => e.key === "Enter" && handleSend("service")}
              />
              <Button
                onClick={() => handleSend("service")}
                disabled={!serviceMsg.trim()}
                className="nf-accent-bg hover:opacity-90 text-white h-11 px-4 flex-shrink-0"
              >
                {sent === "service" ? <Icon name="Check" size={16} /> : <Icon name="Send" size={16} />}
              </Button>
            </div>
          </div>

          {/* Push notification */}
          <div className="space-y-2">
            <label className="text-xs font-semibold nf-text-secondary uppercase tracking-wide flex items-center gap-2">
              <Icon name="Bell" size={12} className="nf-accent" />
              Push-уведомление для всех пользователей
            </label>
            <div className="flex gap-2">
              <Input
                value={notification}
                onChange={e => setNotification(e.target.value)}
                placeholder="Текст уведомления..."
                className="nf-bg-2 border-border nf-text-primary h-11"
                onKeyDown={e => e.key === "Enter" && handleSend("notification")}
              />
              <Button
                onClick={() => handleSend("notification")}
                disabled={!notification.trim()}
                className="h-11 px-4 flex-shrink-0 border text-sm font-medium nf-text-primary hover:nf-bg-4"
                variant="outline"
              >
                {sent === "notification" ? <Icon name="Check" size={16} /> : <Icon name="Send" size={16} />}
              </Button>
            </div>
          </div>

          {sent && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm nf-accent animate-fade-in"
              style={{ backgroundColor: "hsl(var(--theme-color) / 0.1)", border: "1px solid hsl(var(--theme-color) / 0.2)" }}>
              <Icon name="CheckCircle" size={16} />
              <span>Успешно отправлено!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
