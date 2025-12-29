// context/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
    user: null,
    setUser: (u:any) => {},
    logout: () => {}
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<any>(null);

    // Главное: всегда запрашиваем пользователя с /api/user/me при загрузке приложения/страницы
    useEffect(() => {
        fetch("/api/user/me", {
            headers: {
                Authorization: "Bearer dev" // можно любое значение для dev-режима
            }
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => setUser(data))
            .catch(() => setUser(null));
    }, []);

    function logout() {
        setUser(null); // Просто "выход" — убираем пользователя из context
    }

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};