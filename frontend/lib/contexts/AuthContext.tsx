"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import { AuthUser } from "@/lib/api/auth";
import { getUserCookie, clearAuthCookies, getTokenCookie } from "@/lib/api/cookies";

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    setUser: (user: AuthUser | null) => void;
    logout: () => void;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user:        null,
    token:       null,
    setUser:     () => {},
    logout:      () => {},
    refreshUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser]   = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Load from cookies on mount
    const refreshUser = useCallback(() => {
        const storedUser  = getUserCookie() as AuthUser | null;
        const storedToken = getTokenCookie();
        setUser(storedUser);
        setToken(storedToken);
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    function logout() {
        clearAuthCookies();
        setUser(null);
        setToken(null);
        window.location.href = "/login";
    }

    return (
        <AuthContext.Provider value={{ user, token, setUser, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
