"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Address = {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
};

export type NotificationPreferences = {
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  addresses: Address[];
  notificationPreferences: NotificationPreferences;
  role: "user" | "admin";
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
  updateProfile: (name: string, email: string) => Promise<boolean>;
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const storageKeyUser = "giant-store-user";

const MOCK_ADMIN_EMAIL = "admin@giantstore.com";
const MOCK_USER_EMAIL = "user@giantstore.com";
const MOCK_PASSWORD = "password123";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKeyUser);
    if (stored) {
      try {
        setUser(JSON.parse(stored) as User);
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
    setIsLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      clearError() {
        setError(null);
      },
      async login(email, password) {
        setIsLoading(true);
        setError(null);
        await new Promise((r) => setTimeout(r, 600)); // mock network delay

        // Simple mock credentials validation
        const normalizedEmail = email.trim().toLowerCase();
        const isDemoAdmin = normalizedEmail === MOCK_ADMIN_EMAIL;
        if (
          (isDemoAdmin && password === MOCK_PASSWORD) ||
          (!isDemoAdmin && ((normalizedEmail === MOCK_USER_EMAIL && password === MOCK_PASSWORD) ||
            (normalizedEmail.includes("@") && password.length >= 6)))
        ) {
          const loggedInUser: User = {
            id: isDemoAdmin ? "admin_001" : `user_${normalizedEmail}`,
            name: isDemoAdmin ? "Demo Admin" : normalizedEmail.split("@")[0],
            email: normalizedEmail,
            role: isDemoAdmin ? "admin" : "user",
            addresses: [
              {
                id: "addr_default",
                name: "Home",
                street: "123 Main St",
                city: "New York",
                state: "NY",
                postalCode: "10001",
                country: "USA",
                phone: "+1 555-0199",
                isDefault: true,
              },
            ],
            notificationPreferences: {
              orderUpdates: true,
              promotions: false,
              newsletter: true,
            },
          };

          setUser(loggedInUser);
          window.localStorage.setItem(storageKeyUser, JSON.stringify(loggedInUser));
          setIsLoading(false);
          return true;
        }

        setError("Invalid email or password. Password must be at least 6 characters.");
        setIsLoading(false);
        return false;
      },
      async register(name, email, password) {
        setIsLoading(true);
        setError(null);
        await new Promise((r) => setTimeout(r, 800));

        if (email.trim().toLowerCase() === MOCK_ADMIN_EMAIL) {
          setError("This address is reserved for the demo administrator.");
          setIsLoading(false);
          return false;
        }

        if (password.length < 6) {
          setError("Password must be at least 6 characters long.");
          setIsLoading(false);
          return false;
        }

        const newUser: User = {
          id: `user_${email.trim().toLowerCase()}`,
          name,
          email: email.toLowerCase(),
          role: "user",
          addresses: [],
          notificationPreferences: {
            orderUpdates: true,
            promotions: true,
            newsletter: false,
          },
        };

        setUser(newUser);
        window.localStorage.setItem(storageKeyUser, JSON.stringify(newUser));
        setIsLoading(false);
        return true;
      },
      logout() {
        setUser(null);
        window.localStorage.removeItem(storageKeyUser);
      },
      async forgotPassword(email) {
        setError(null);
        await new Promise((r) => setTimeout(r, 500));
        if (!email.includes("@")) {
          setError("Please enter a valid email address.");
          return false;
        }
        return true;
      },
      async resetPassword(email, newPassword) {
        setError(null);
        await new Promise((r) => setTimeout(r, 600));
        if (newPassword.length < 6) {
          setError("Password must be at least 6 characters.");
          return false;
        }
        return true;
      },
      async updateProfile(name, email) {
        if (!user) return false;
        if (email.trim().toLowerCase() === MOCK_ADMIN_EMAIL && user.role !== "admin") return false;
        const updated = { ...user, name, email };
        setUser(updated);
        window.localStorage.setItem(storageKeyUser, JSON.stringify(updated));
        return true;
      },
      addAddress(address) {
        if (!user) return;
        const newAddress: Address = {
          ...address,
          id: `addr_${Date.now()}`,
          isDefault: user.addresses.length === 0 ? true : address.isDefault,
        };

        let updatedAddresses = [...user.addresses];
        if (newAddress.isDefault) {
          updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
        }
        updatedAddresses.push(newAddress);

        const updated = { ...user, addresses: updatedAddresses };
        setUser(updated);
        window.localStorage.setItem(storageKeyUser, JSON.stringify(updated));
      },
      removeAddress(id) {
        if (!user) return;
        const updatedAddresses = user.addresses.filter((a) => a.id !== id);
        // If we deleted default and have other addresses left, make first default
        if (user.addresses.find((a) => a.id === id)?.isDefault && updatedAddresses.length > 0) {
          updatedAddresses[0].isDefault = true;
        }

        const updated = { ...user, addresses: updatedAddresses };
        setUser(updated);
        window.localStorage.setItem(storageKeyUser, JSON.stringify(updated));
      },
      setDefaultAddress(id) {
        if (!user) return;
        const updatedAddresses = user.addresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }));

        const updated = { ...user, addresses: updatedAddresses };
        setUser(updated);
        window.localStorage.setItem(storageKeyUser, JSON.stringify(updated));
      },
      updateNotificationPreferences(prefs) {
        if (!user) return;
        const updated = {
          ...user,
          notificationPreferences: {
            ...user.notificationPreferences,
            ...prefs,
          },
        };
        setUser(updated);
        window.localStorage.setItem(storageKeyUser, JSON.stringify(updated));
      },
    };
  }, [user, isLoading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
