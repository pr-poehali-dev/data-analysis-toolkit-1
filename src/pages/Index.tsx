import { useState } from "react";
import AuthPage from "@/components/AuthPage";
import MessengerLayout from "@/components/messenger/MessengerLayout";

interface User {
  name: string;
  username: string;
  email: string;
}

export default function Index() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    return <AuthPage onAuth={setUser} />;
  }

  return <MessengerLayout user={user} onLogout={() => setUser(null)} />;
}
