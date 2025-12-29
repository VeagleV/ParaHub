import React, { createContext, useEffect, useState, useCallback } from "react";
import type {User} from "../types/auth";
import axios from "axios";

interface AuthContextProps {
    user: User | null;
    token: string | null;
    login: (accessToken: string) => void;
    logout: () => void;
    check: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    token: null,
    login: () => {},
    logout: () => {},
    check: async () => {}
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("accessToken"));

    const check = useCallback(async () => {
        if (token) {
            try {
                const resp = await axios.get<User>("/api/user/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(resp.data);
            } catch {
                logout();
            }
        } else {
            setUser(null);
        }
    }, [token]);

    useEffect(() => { check(); }, [token]);

    const login = (tok: string) => {
        localStorage.setItem("accessToken", tok);
        setToken(tok);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, token, login, logout, check}}>
    {children}
    </AuthContext.Provider>
);
};