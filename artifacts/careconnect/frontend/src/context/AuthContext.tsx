import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// 🔥 Firebase Imports (Yahan apne sahi path se import karein)
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/pages/firebase"; 

export interface AuthUser {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  photo?: string;
}

type AuthContextType = {
  user: AuthUser | null;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<void>;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>; 
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);
const USER_KEY = "careconnect_user";
const TOKEN_KEY = "token"; // JWT Token localstorage key

function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser());

  useEffect(() => {
    saveUser(user);
  }, [user]);

  // =========================
  // NORMAL REGISTER
  // =========================
  const register = async (fullName: string, email: string, phone: string, password: string) => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    
    if (data.token) localStorage.setItem(TOKEN_KEY, data.token);

    setUser({
      id: data.user?._id || data.user?.id,
      fullName: data.user?.fullName || fullName,
      email: data.user?.email || email,
      phone: data.user?.phone || phone,
    });
  };

  // =========================
  // NORMAL LOGIN
  // =========================
  const login = async (emailOrPhone: string, password: string) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOrPhone, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    if (data.token) localStorage.setItem(TOKEN_KEY, data.token);

    setUser({
      id: data.user?._id || data.user?.id,
      fullName: data.user?.fullName,
      email: data.user?.email,
      phone: data.user?.phone,
    });
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const loginWithGoogle = async () => {
    // 1. Firebase Popup Trigger karna
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // 2. Backend API par data bhejna (Dhyan rahe ki Backend 'fullName' hi accept ya return kare)
    const res = await fetch("http://localhost:5000/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: firebaseUser.displayName, // Backend expectations ke mutabiq
        email: firebaseUser.email,
        photo: firebaseUser.photoURL,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Google login failed");

    // 3. Token secure karna
    if (data.token) localStorage.setItem(TOKEN_KEY, data.token);

    // 4. Global State ko set karna takay Navbar instantly update ho jaye
    setUser({
      id: data.user?._id || data.user?.id,
      // Map backend fields correctly (Agar backend se sirf 'name' aaye to data.user?.name || data.user?.fullName use karein)
      fullName: data.user?.fullName || data.user?.name || firebaseUser.displayName || "Google User",
      email: data.user?.email || firebaseUser.email || "",
      phone: data.user?.phone || "",
      photo: data.user?.photo || firebaseUser.photoURL || undefined,
    });
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};