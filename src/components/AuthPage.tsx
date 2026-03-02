import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";

type AuthMode = "login" | "register" | "verify2fa" | "registerProfile";

interface AuthPageProps {
  onAuth: (user: { name: string; username: string; email: string; avatar?: string }) => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code2fa, setCode2fa] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const fakeSubmit = (next: () => void) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); next(); }, 900);
  };

  const handleLogin = () => {
    fakeSubmit(() => {
      // Demo: skip 2FA if not set
      onAuth({ name: "Пользователь", username: "user", email });
    });
  };

  const handleRegister = () => {
    fakeSubmit(() => setMode("registerProfile"));
  };

  const handleProfile = () => {
    fakeSubmit(() => {
      onAuth({ name: `${firstName} ${lastName}`.trim() || "Пользователь", username: username || "user", email });
    });
  };

  return (
    <div className="min-h-screen nf-bg-1 flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: "hsl(var(--theme-color))" }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-8"
          style={{ background: "hsl(var(--nf-accent-teal))" }} />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl nf-accent-bg mx-auto mb-4 flex items-center justify-center shadow-lg"
            style={{ boxShadow: "0 0 32px hsl(var(--theme-color) / 0.4)" }}>
            <Icon name="Moon" size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold nf-text-primary tracking-tight">NIGHTFALL</h1>
          <p className="nf-text-muted text-sm mt-1">by Night</p>
        </div>

        {/* Card */}
        <div className="nf-bg-3 rounded-2xl p-8 border" style={{ borderColor: "hsl(var(--border))" }}>
          {/* Login */}
          {mode === "login" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold nf-text-primary mb-1">Добро пожаловать</h2>
              <p className="nf-text-muted text-sm mb-6">Войдите в свой аккаунт</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold nf-text-secondary uppercase tracking-wide block mb-1.5">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="nf-bg-2 border-border nf-text-primary placeholder:text-muted-foreground h-11"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold nf-text-secondary uppercase tracking-wide block mb-1.5">
                    Пароль
                  </label>
                  <div className="relative">
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="nf-bg-2 border-border nf-text-primary placeholder:text-muted-foreground h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 nf-text-muted hover:nf-text-secondary"
                    >
                      <Icon name={showPass ? "EyeOff" : "Eye"} size={16} />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={loading || !email || !password}
                  className="w-full h-11 nf-accent-bg hover:opacity-90 text-white font-semibold"
                >
                  {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : "Войти"}
                </Button>
              </div>

              {/* E2E badge */}
              <div className="e2e-badge rounded-xl p-3 mt-5 flex items-center gap-2.5">
                <Icon name="ShieldCheck" size={16} className="nf-accent flex-shrink-0" />
                <span className="text-xs nf-text-secondary">End-to-end шифрование включено</span>
              </div>

              <p className="text-center nf-text-muted text-sm mt-6">
                Нет аккаунта?{" "}
                <button onClick={() => setMode("register")} className="nf-accent hover:underline font-medium">
                  Зарегистрироваться
                </button>
              </p>
            </div>
          )}

          {/* 2FA */}
          {mode === "verify2fa" && (
            <div className="animate-fade-in">
              <button onClick={() => setMode("login")} className="flex items-center gap-2 nf-text-muted hover:nf-text-secondary text-sm mb-6">
                <Icon name="ArrowLeft" size={16} />
                Назад
              </button>
              <div className="text-center mb-6">
                <div className="w-12 h-12 nf-bg-2 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon name="Shield" size={24} className="nf-accent" />
                </div>
                <h2 className="text-xl font-semibold nf-text-primary mb-1">Двухфакторная защита</h2>
                <p className="nf-text-muted text-sm">Введите код из приложения-аутентификатора</p>
              </div>
              <Input
                type="text"
                placeholder="000000"
                value={code2fa}
                onChange={e => setCode2fa(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="nf-bg-2 border-border nf-text-primary text-center text-2xl tracking-[0.5em] h-14 mb-4"
                maxLength={6}
              />
              <Button
                onClick={() => fakeSubmit(() => onAuth({ name: "Пользователь", username: "user", email }))}
                disabled={loading || code2fa.length !== 6}
                className="w-full h-11 nf-accent-bg hover:opacity-90 text-white font-semibold"
              >
                {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : "Подтвердить"}
              </Button>
            </div>
          )}

          {/* Register */}
          {mode === "register" && (
            <div className="animate-fade-in">
              <button onClick={() => setMode("login")} className="flex items-center gap-2 nf-text-muted hover:nf-text-secondary text-sm mb-6">
                <Icon name="ArrowLeft" size={16} />
                Назад
              </button>
              <h2 className="text-xl font-semibold nf-text-primary mb-1">Создать аккаунт</h2>
              <p className="nf-text-muted text-sm mb-6">Введите email для регистрации</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold nf-text-secondary uppercase tracking-wide block mb-1.5">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="nf-bg-2 border-border nf-text-primary placeholder:text-muted-foreground h-11"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold nf-text-secondary uppercase tracking-wide block mb-1.5">Пароль</label>
                  <div className="relative">
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="Минимум 8 символов"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="nf-bg-2 border-border nf-text-primary placeholder:text-muted-foreground h-11 pr-10"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 nf-text-muted">
                      <Icon name={showPass ? "EyeOff" : "Eye"} size={16} />
                    </button>
                  </div>
                </div>

                <div className="nf-bg-2 rounded-xl p-3 text-xs nf-text-secondary flex items-start gap-2">
                  <Icon name="Mail" size={14} className="mt-0.5 flex-shrink-0 nf-accent" />
                  <span>После регистрации на ваш email придёт подтверждение</span>
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={loading || !email || password.length < 8}
                  className="w-full h-11 nf-accent-bg hover:opacity-90 text-white font-semibold"
                >
                  {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : "Продолжить"}
                </Button>
              </div>

              <p className="text-center nf-text-muted text-sm mt-6">
                Уже есть аккаунт?{" "}
                <button onClick={() => setMode("login")} className="nf-accent hover:underline font-medium">Войти</button>
              </p>
            </div>
          )}

          {/* Profile Setup */}
          {mode === "registerProfile" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold nf-text-primary mb-1">Настройте профиль</h2>
              <p className="nf-text-muted text-sm mb-6">Расскажите о себе</p>

              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="relative cursor-pointer group">
                  <div className="w-20 h-20 nf-bg-2 rounded-full flex items-center justify-center border-2"
                    style={{ borderColor: "hsl(var(--theme-color))" }}>
                    <Icon name="User" size={32} className="nf-text-muted" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="Camera" size={20} className="text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 nf-accent-bg rounded-full flex items-center justify-center">
                    <Icon name="Plus" size={12} className="text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold nf-text-secondary uppercase tracking-wide block mb-1.5">Имя</label>
                    <Input
                      placeholder="Иван"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="nf-bg-2 border-border nf-text-primary placeholder:text-muted-foreground h-11"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold nf-text-secondary uppercase tracking-wide block mb-1.5">Фамилия</label>
                    <Input
                      placeholder="Иванов"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="nf-bg-2 border-border nf-text-primary placeholder:text-muted-foreground h-11"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold nf-text-secondary uppercase tracking-wide block mb-1.5">
                    Юзернейм
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 nf-text-muted">@</span>
                    <Input
                      placeholder="username"
                      value={username}
                      onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                      className="nf-bg-2 border-border nf-text-primary placeholder:text-muted-foreground h-11 pl-7"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleProfile}
                  disabled={loading || !firstName}
                  className="w-full h-11 nf-accent-bg hover:opacity-90 text-white font-semibold"
                >
                  {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : "Начать использовать NIGHTFALL"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center nf-text-muted text-xs mt-6">
          NIGHTFALL by Night · NightINC · Все права защищены
        </p>
      </div>
    </div>
  );
}
