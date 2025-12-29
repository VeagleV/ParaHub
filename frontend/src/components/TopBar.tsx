import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: 500,
    fontSize: "1.07rem"
};

const activeStyle = {
    background: "rgba(0,0,0,0.13)"
};

const TopBar: React.FC = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <header style={{
            background: 'rgba(30,30,36,0.55)',
            borderBottom: '1px solid rgba(200,200,200,0.16)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
            backdropFilter: 'blur(10px)',
        }}>
            <nav style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                height: '58px', maxWidth: 1000, margin: '0 auto', padding: '0 24px',
            }}>
                <Link to="/" style={{
                    fontWeight: "bold", fontSize: "1.5rem", color: "#fff"
                }}>ParaHub</Link>
                <div style={{ display: "flex", gap: "14px" }}>
                    <Link
                        to="/"
                        style={{
                            ...linkStyle,
                            ...(location.pathname === "/" ? activeStyle : {})
                        }}
                    >Главная</Link>
                    <Link
                        to="/map"
                        style={{
                            ...linkStyle,
                            ...(location.pathname === "/map" ? activeStyle : {})
                        }}
                    >Карта</Link>

                    {/* Кнопки для авторизованного пользователя */}
                    {user && (
                        <>
                            <Link
                                to="/profile"
                                style={{
                                    ...linkStyle,
                                    ...(location.pathname === "/profile" ? activeStyle : {})
                                }}
                            >Профиль</Link>
                            <button
                                onClick={() => {
                                    logout();
                                    navigate("/");
                                }}
                                style={{
                                    background: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    marginLeft: "8px",
                                    fontWeight: 500
                                }}
                            >Выйти</button>
                        </>
                    )}

                    {/* Кнопки для НЕавторизованного пользователя */}
                    {!user && (
                        <>
                            <Link
                                to="/login"
                                style={{
                                    ...linkStyle,
                                    ...(location.pathname === "/login" ? activeStyle : {})
                                }}
                            >Войти</Link>
                            <Link
                                to="/register"
                                style={{
                                    ...linkStyle,
                                    ...(location.pathname === "/register" ? activeStyle : {})
                                }}
                            >Регистрация</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default TopBar;