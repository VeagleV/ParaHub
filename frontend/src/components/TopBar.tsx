import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const TopBar: React.FC = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <header style={{
        display: "flex", alignItems: "center", gap: 16,
            background: "#f0f0f0", padding: "12px 24px",
            borderBottom: "1px solid #ddd"
    }}>
    <Link to="/" style={{ fontWeight: "bold", fontSize: 20 }}>ParaHub</Link>
    <nav style={{ display: "flex", gap: 14, flex: 1 }}>
    <Link to="/">Главная</Link>
    {user && <Link to="/profile">Профиль</Link>}
        {user && <Link to="/map">Карта</Link>}
            {user && user.role === "ADMIN" && <Link to="/admin">Панель админа</Link>}
            </nav>
                {!user &&
                <>
                    <Link to="/login">Войти</Link>
                    <Link to="/register">Регистрация</Link>
                    </>
                }
                {user && (
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: "#666" }}>{user.username} [{user.role}]</span>
                <button onClick={() => { logout(); navigate("/"); }}>Выйти</button>
                </span>
                )}
                </header>
            );
            };

            export default TopBar;