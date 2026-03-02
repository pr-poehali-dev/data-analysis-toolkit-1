import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";

interface SettingsPageProps {
  user: { name: string; username: string; email: string };
  onClose: () => void;
  onThemeChange: (theme: string) => void;
  onModeChange: (mode: "dark" | "light" | "system") => void;
  currentTheme: string;
  currentMode: "dark" | "light" | "system";
}

const SECTIONS = [
  { id: "account", label: "Аккаунт", icon: "User" },
  { id: "appearance", label: "Оформление", icon: "Palette" },
  { id: "notifications", label: "Уведомления", icon: "Bell" },
  { id: "security", label: "Безопасность", icon: "Shield" },
  { id: "about", label: "О приложении", icon: "Info" },
] as const;

const THEMES = [
  { id: "blue", label: "Синий", color: "hsl(220 85% 60%)" },
  { id: "red", label: "Красный", color: "hsl(0 72% 55%)" },
  { id: "orange", label: "Оранжевый", color: "hsl(25 90% 55%)" },
  { id: "green", label: "Зелёный", color: "hsl(142 70% 45%)" },
];

const MODES = [
  { id: "dark", label: "Тёмная", icon: "Moon" },
  { id: "system", label: "Как в системе", icon: "Monitor" },
  { id: "light", label: "Светлая", icon: "Sun" },
] as const;

export default function SettingsPage({ user, onClose, onThemeChange, onModeChange, currentTheme, currentMode }: SettingsPageProps) {
  const [section, setSection] = useState<typeof SECTIONS[number]["id"]>("account");
  const [name, setName] = useState(user.name.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user.name.split(" ")[1] || "");
  const [username, setUsername] = useState(user.username);
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [searchByUsername, setSearchByUsername] = useState(true);
  const [unknownMessages, setUnknownMessages] = useState(true);
  const [notifAll, setNotifAll] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex" style={{ backgroundColor: "hsl(var(--nf-bg-1))" }}>
      {/* Sidebar */}
      <div className="w-56 border-r flex flex-col" style={{ borderColor: "hsl(var(--border))", backgroundColor: "hsl(var(--nf-bg-2))" }}>
        <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: "hsl(var(--border))" }}>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 nf-text-muted hover:nf-text-primary rounded-lg" onClick={onClose}>
            <Icon name="ArrowLeft" size={16} />
          </Button>
          <span className="font-semibold nf-text-primary text-sm">Настройки</span>
        </div>
        <nav className="p-2 flex-1">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left mb-0.5 ${
                section === s.id ? "nf-accent-bg/10 nf-accent font-medium" : "nf-text-secondary hover:nf-bg-4"
              }`}
            >
              <Icon name={s.icon} size={16} />
              {s.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-lg">
          {section === "account" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold nf-text-primary mb-6">Аккаунт</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-8 p-4 nf-bg-3 rounded-2xl border" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="relative cursor-pointer group">
                  <div className="w-16 h-16 nf-accent-bg rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{user.name[0]}</span>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="Camera" size={18} className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="nf-text-primary font-semibold">{user.name}</p>
                  <p className="nf-text-muted text-sm">@{user.username}</p>
                  <button className="text-xs nf-accent mt-1 hover:underline">Изменить фото</button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold nf-text-secondary uppercase tracking-wide block mb-1.5">Имя</label>
                    <Input value={name} onChange={e => setName(e.target.value)}
                      className="nf-bg-3 border-border nf-text-primary h-11" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold nf-text-secondary uppercase tracking-wide block mb-1.5">Фамилия</label>
                    <Input value={lastName} onChange={e => setLastName(e.target.value)}
                      className="nf-bg-3 border-border nf-text-primary h-11" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold nf-text-secondary uppercase tracking-wide block mb-1.5">Юзернейм</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 nf-text-muted">@</span>
                    <Input value={username} onChange={e => setUsername(e.target.value)}
                      className="nf-bg-3 border-border nf-text-primary h-11 pl-7" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold nf-text-secondary uppercase tracking-wide block mb-1.5">Email</label>
                  <Input value={user.email} disabled className="nf-bg-3 border-border nf-text-muted h-11 cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-xs font-semibold nf-text-secondary uppercase tracking-wide block mb-1.5">Новый пароль</label>
                  <Input type="password" placeholder="••••••••" className="nf-bg-3 border-border nf-text-primary h-11" />
                </div>

                <Button onClick={handleSave} className="nf-accent-bg hover:opacity-90 text-white font-semibold h-11">
                  {saved ? (
                    <><Icon name="Check" size={16} className="mr-2" />Сохранено</>
                  ) : "Сохранить изменения"}
                </Button>
              </div>
            </div>
          )}

          {section === "appearance" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold nf-text-primary mb-6">Оформление</h2>

              <div className="mb-8">
                <h3 className="text-sm font-semibold nf-text-secondary uppercase tracking-wide mb-4">Цветовая тема</h3>
                <div className="grid grid-cols-2 gap-3">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => onThemeChange(t.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        currentTheme === t.id ? "border-2" : "border nf-bg-3 hover:nf-bg-4"
                      }`}
                      style={currentTheme === t.id ? { borderColor: t.color, backgroundColor: `${t.color}15` } : { borderColor: "hsl(var(--border))" }}
                    >
                      <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                      <span className="nf-text-primary font-medium text-sm">{t.label}</span>
                      {currentTheme === t.id && <Icon name="Check" size={16} className="ml-auto" style={{ color: t.color }} />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold nf-text-secondary uppercase tracking-wide mb-4">Режим отображения</h3>
                <div className="grid grid-cols-3 gap-3">
                  {MODES.map(m => (
                    <button
                      key={m.id}
                      onClick={() => onModeChange(m.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                        currentMode === m.id ? "nf-accent-bg/10 border-2 nf-accent-border" : "nf-bg-3 border hover:nf-bg-4"
                      }`}
                      style={currentMode === m.id ? { borderColor: "hsl(var(--theme-color))" } : { borderColor: "hsl(var(--border))" }}
                    >
                      <Icon name={m.icon} size={20} className={currentMode === m.id ? "nf-accent" : "nf-text-muted"} />
                      <span className={`text-xs font-medium ${currentMode === m.id ? "nf-accent" : "nf-text-secondary"}`}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section === "notifications" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold nf-text-primary mb-6">Уведомления</h2>

              <div className="space-y-3">
                <div className="nf-bg-3 rounded-2xl border overflow-hidden" style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                    <div>
                      <p className="nf-text-primary font-medium text-sm">Все уведомления</p>
                      <p className="nf-text-muted text-xs mt-0.5">Включить/выключить все уведомления</p>
                    </div>
                    <button
                      onClick={() => setNotifAll(!notifAll)}
                      className={`w-12 h-6 rounded-full transition-all relative ${notifAll ? "nf-accent-bg" : "nf-bg-4"}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${notifAll ? "left-6" : "left-0.5"}`} />
                    </button>
                  </div>
                  {[
                    { label: "Личные сообщения", desc: "Уведомления от личных чатов" },
                    { label: "Групповые чаты", desc: "Уведомления из групп" },
                    { label: "Сервисный чат", desc: "Уведомления от Night" },
                    { label: "NightAI", desc: "Ответы от ИИ-ассистента" },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center justify-between p-4 ${i < 3 ? "border-b" : ""}`} style={{ borderColor: "hsl(var(--border))" }}>
                      <div>
                        <p className="nf-text-primary font-medium text-sm">{item.label}</p>
                        <p className="nf-text-muted text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full transition-all relative ${notifAll ? "nf-accent-bg" : "nf-bg-4"}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${notifAll ? "left-6" : "left-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section === "security" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold nf-text-primary mb-6">Безопасность</h2>

              <div className="e2e-badge rounded-2xl p-4 mb-6 flex items-start gap-3">
                <Icon name="ShieldCheck" size={20} className="nf-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="nf-text-primary font-semibold text-sm">End-to-End шифрование активно</p>
                  <p className="nf-text-muted text-xs mt-1">Все ваши сообщения зашифрованы и недоступны третьим лицам, включая серверы NIGHTFALL.</p>
                </div>
              </div>

              <div className="nf-bg-3 rounded-2xl border overflow-hidden" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                  <div>
                    <p className="nf-text-primary font-medium text-sm">Двухфакторная аутентификация</p>
                    <p className="nf-text-muted text-xs mt-0.5">Дополнительная защита аккаунта</p>
                  </div>
                  <button
                    onClick={() => setTwoFaEnabled(!twoFaEnabled)}
                    className={`w-12 h-6 rounded-full transition-all relative ${twoFaEnabled ? "nf-accent-bg" : "nf-bg-4"}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${twoFaEnabled ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                  <div>
                    <p className="nf-text-primary font-medium text-sm">Поиск по юзернейму</p>
                    <p className="nf-text-muted text-xs mt-0.5">Разрешить другим находить вас</p>
                  </div>
                  <button
                    onClick={() => setSearchByUsername(!searchByUsername)}
                    className={`w-12 h-6 rounded-full transition-all relative ${searchByUsername ? "nf-accent-bg" : "nf-bg-4"}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${searchByUsername ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="nf-text-primary font-medium text-sm">Сообщения от незнакомых</p>
                    <p className="nf-text-muted text-xs mt-0.5">Разрешить получать сообщения от всех</p>
                  </div>
                  <button
                    onClick={() => setUnknownMessages(!unknownMessages)}
                    className={`w-12 h-6 rounded-full transition-all relative ${unknownMessages ? "nf-accent-bg" : "nf-bg-4"}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${unknownMessages ? "left-6" : "left-0.5"}`} />
                  </button>
                </div>
              </div>

              {twoFaEnabled && (
                <div className="mt-4 nf-bg-3 rounded-2xl border p-4 animate-fade-in" style={{ borderColor: "hsl(var(--border))" }}>
                  <label className="text-xs font-semibold nf-text-secondary uppercase tracking-wide block mb-2">Код 2FA (TOTP)</label>
                  <Input type="text" placeholder="Введите код из приложения" className="nf-bg-2 border-border nf-text-primary h-11 mb-3" />
                  <Button className="nf-accent-bg hover:opacity-90 text-white font-semibold h-10 w-full">Привязать 2FA</Button>
                </div>
              )}
            </div>
          )}

          {section === "about" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold nf-text-primary mb-6">О приложении</h2>

              <div className="nf-bg-3 rounded-2xl border p-6 text-center mb-4" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="w-16 h-16 nf-accent-bg rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ boxShadow: "0 0 24px hsl(var(--theme-color) / 0.3)" }}>
                  <Icon name="Moon" size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold nf-text-primary mb-1">NIGHTFALL</h3>
                <p className="nf-text-muted text-sm mb-1">by Night</p>
                <p className="nf-text-muted text-xs">NightINC все права защищены</p>
              </div>

              <div className="nf-bg-3 rounded-2xl border overflow-hidden" style={{ borderColor: "hsl(var(--border))" }}>
                {[
                  { label: "Подробности", value: "nightt.tech/projects/nightfall", icon: "ExternalLink" },
                  { label: "Политика конфиденциальности", value: "nightfall.nightt.tech/docs/privacy", icon: "FileText" },
                  { label: "Политика сбора данных", value: "nightfall.nightt.tech/docs/dcasm", icon: "Database" },
                  { label: "Поддержка", value: "nightfall.nightt.tech/support", icon: "HeadphonesIcon" },
                ].map((item, i, arr) => (
                  <a
                    key={i}
                    href={`https://${item.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-4 hover:nf-bg-4 transition-all ${i < arr.length - 1 ? "border-b" : ""}`}
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    <Icon name={item.icon} size={16} className="nf-text-muted flex-shrink-0" />
                    <div className="flex-1">
                      <p className="nf-text-primary text-sm font-medium">{item.label}</p>
                      <p className="nf-text-muted text-xs">{item.value}</p>
                    </div>
                    <Icon name="ChevronRight" size={14} className="nf-text-muted" />
                  </a>
                ))}
              </div>

              <p className="text-center nf-text-muted text-xs mt-4">при поддержке Night</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}