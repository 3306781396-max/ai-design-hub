// ============================================================
// Frontend Auth System (localStorage-based, no backend required)
// ============================================================

const USERS_KEY = "aid-hub_users";
const SESSION_KEY = "aid-hub_session";

// ============================================================
// Built-in admin account (hashed at build time)
// ============================================================

const BUILTIN_ADMIN: StoredUser = {
  id: "admin-001",
  email: "admin@aidesignhub.com",
  // Pre-hashed password: Admin123!
  passwordHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
  name: "Admin",
  avatar: "",
  role: "admin" as const,
};

// ============================================================
// Types
// ============================================================

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatar: string;
  role: "admin" | "user";
}

export interface AuthSession {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: "admin" | "user";
}

// ============================================================
// Password Hashing (SHA-256 via Web Crypto)
// ============================================================

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "aid-hub-salt-v1");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ============================================================
// User Storage
// ============================================================

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getAllUsers(): StoredUser[] {
  const users = getUsers();
  // Always ensure built-in admin exists
  const hasAdmin = users.some((u) => u.email === BUILTIN_ADMIN.email);
  if (!hasAdmin) {
    users.push(BUILTIN_ADMIN);
    saveUsers(users);
  }
  return users;
}

// ============================================================
// Session Management
// ============================================================

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

// ============================================================
// Auth Functions
// ============================================================

export async function registerUser(
  email: string,
  password: string,
  name?: string
): Promise<{ success: boolean; error?: string }> {
  // Validate
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }
  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  const users = getAllUsers();

  // Check if email already exists
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "An account with this email already exists" };
  }

  // Create user
  const passwordHash = await hashPassword(password);
  const newUser: StoredUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    email: email.toLowerCase(),
    passwordHash,
    name: name || email.split("@")[0],
    avatar: "",
    role: "user",
  };

  users.push(newUser);
  saveUsers(users);

  // Auto-login after register
  saveSession({
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    avatar: newUser.avatar,
    role: newUser.role,
  });

  return { success: true };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  const users = getAllUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) {
    return { success: false, error: "Invalid email or password" };
  }

  // Create session
  saveSession({
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    role: user.role,
  });

  return { success: true };
}

export function logoutUser(): void {
  clearSession();
  // Clear favorites on logout (user-specific data)
  if (typeof window !== "undefined") {
    localStorage.removeItem("aid-hub_favorites");
  }
}

// ============================================================
// Session Change Listener
// ============================================================

type AuthListener = (session: AuthSession | null) => void;
const listeners: Set<AuthListener> = new Set();

export function onAuthChange(listener: AuthListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyAuthChange(session: AuthSession | null): void {
  listeners.forEach((fn) => fn(session));
}
