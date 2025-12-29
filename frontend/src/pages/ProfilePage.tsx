import React, { useEffect, useState } from "react";

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetch("/api/user/me", {
            headers: {
                Authorization: "Bearer any-dev-token" // Любой токен, чтобы фильтр пропустил
            }
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => setUser(data))
            .catch(() => setUser(null));
    }, []);

    if (!user) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    width: "100vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                }}
            >
                <div
                    style={{
                        padding: "34px 26px",
                        borderRadius: "20px",
                        background: "rgba(255,255,255,0.27)",
                        backdropFilter: "blur(20px)",
                        boxShadow: "0 8px 36px rgba(0,0,0,.12)",
                        border: "1px solid rgba(200,200,200,0.14)",
                        textAlign: "center",
                        fontSize: "1.2rem",
                    }}
                >
                    <b>Загрузка профиля...</b>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100vw",
                margin: 0,
                padding: 0,
                display: "flex",
                background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    maxWidth: 390,
                    width: "100%",
                    padding: "38px 32px",
                    background: "rgba(255,255,255,0.37)",
                    borderRadius: "22px",
                    boxShadow: "0 6px 30px rgba(0,0,0,0.14)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(200,200,200,0.20)",
                }}
            >
                <h2
                    style={{
                        marginBottom: "28px",
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: "1.92rem",
                        color: "#303355",
                        letterSpacing: ".01em",
                    }}
                >
                    Профиль пользователя
                </h2>
                <div style={{ marginBottom: 18 }}>
                    <span style={keyStyle}>E-mail:</span>
                    <span style={valStyle}>{user.email}</span>
                </div>
                <div style={{ marginBottom: 18 }}>
                    <span style={keyStyle}>Имя пользователя:</span>
                    <span style={valStyle}>{user.username}</span>
                </div>
                <div style={{ marginBottom: 18 }}>
                    <span style={keyStyle}>Роль:</span>
                    <span style={valStyle}>{user.role === "USER" ? "Пользователь" : user.role}</span>
                </div>
                {user.createdAt && (
                    <div style={{ marginBottom: 18 }}>
                        <span style={keyStyle}>Дата регистрации:</span>
                        <span style={valStyle}>{new Date(user.createdAt).toLocaleString()}</span>
                    </div>
                )}
                {user.lastLogin && (
                    <div style={{ marginBottom: 18 }}>
                        <span style={keyStyle}>Последний вход:</span>
                        <span style={valStyle}>{new Date(user.lastLogin).toLocaleString()}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const keyStyle: React.CSSProperties = {
    fontWeight: 600,
    display: "inline-block",
    minWidth: 125,
    color: "#191970",
};

const valStyle: React.CSSProperties = {
    fontWeight: 400,
    color: "#22223b",
    marginLeft: 6,
};

export default ProfilePage;