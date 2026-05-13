import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  openAuthModal: (tab?: "login" | "register") => void;
  closeAuthModal: () => void;
  authModalOpen: boolean;
  authModalTab: "login" | "register";
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "careconnect_user";
const ACCOUNTS_KEY = "careconnect_accounts";

type StoredAccount = { id: string; fullName: string; email: string; phone: string; password: string; createdAt: string };

function loadUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

function getAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  useEffect(() => {
    saveUser(user);
  }, [user]);

  const login = async (emailOrPhone: string, password: string) => {
    await new Promise(r => setTimeout(r, 800));
    const accounts = getAccounts();
    const found = accounts.find(
      a => (a.email === emailOrPhone || a.phone === emailOrPhone) && a.password === password
    );
    if (!found) throw new Error("Invalid email/phone or password.");
    const { password: _, ...authUser } = found;
    setUser(authUser);
  };

  const register = async (fullName: string, email: string, phone: string, password: string) => {
    await new Promise(r => setTimeout(r, 900));
    const accounts = getAccounts();
    if (accounts.find(a => a.email === email)) throw new Error("An account with this email already exists.");
    if (accounts.find(a => a.phone === phone)) throw new Error("An account with this phone number already exists.");
    const newAccount: StoredAccount = {
      id: `u_${Date.now()}`,
      fullName,
      email,
      phone,
      password,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
    saveAccounts([...accounts, newAccount]);
    const { password: _, ...authUser } = newAccount;
    setUser(authUser);
  };

  const logout = () => {
    setUser(null);
  };

  const openAuthModal = (tab: "login" | "register" = "login") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => setAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, openAuthModal, closeAuthModal, authModalOpen, authModalTab }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
