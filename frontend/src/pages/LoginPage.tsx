import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { loginRequest2FA } from "../api/auth";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();
    const infoMessage = location.state?.message;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await loginRequest2FA(form.email, form.password);
            navigate("/verify?email=" + encodeURIComponent(form.email));
        } catch (err: any) {
            setError(err.response?.data?.message || "Ошибка при входе");
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        }}>
            {infoMessage && (
                <div style={{
                    marginBottom: '18px',
                    color: '#d9534f',
                    background: 'rgba(255,255,255,0.65)',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: 600,
                    textAlign: 'center',
                    boxShadow: '0 2px 12px rgba(200,0,0,.08)'
                }}>
                    {infoMessage}
                </div>
            )}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <form onSubmit={handleSubmit} style={{
                    width: '100%',
                    maxWidth: '370px',
                    padding: '36px 30px',
                    background: 'rgba(255,255,255,0.35)',
                    borderRadius: '22px',
                    boxShadow: '0 6px 30px rgba(0,0,0,0.14)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(200,200,200,0.20)',
                }}>
                    <h2 style={{
                        marginBottom: '26px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: '1.85rem',
                        color: '#363636'
                    }}>Вход в ParaHub</h2>
                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        required
                        autoComplete="username"
                        value={form.email}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        required
                        autoComplete="current-password"
                        value={form.password}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    <button type="submit" style={buttonStyle}>Войти</button>
                    {error && <div style={{color: 'red', margin: '18px 0 0 0', textAlign: 'center'}}>{error}</div>}
                    <div style={{
                        marginTop: '22px',
                        fontSize: '1.05rem',
                        textAlign: 'center',
                        color: '#191970', // Тёмный синий/фиолетовый хорошо виден на светлом фоне
                    }}>
                        Нет аккаунта?{' '}
                        <a href="/register" style={{
                            color: '#007bff',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontWeight: 700,
                            textShadow: '0px 1px 4px rgba(255,255,255,0.45)'
                        }}>
                            Зарегистрироваться
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    margin: '12px 0',
    padding: '12px',
    borderRadius: '9px',
    border: '1px solid rgba(200,200,200,0.6)',
    fontSize: '1.07rem',
    background: 'rgba(255,255,255,0.97)',
    boxSizing: 'border-box' as const,
    color: '#222',  // чёткий цвет текста!
};

const buttonStyle = {
    width: '100%',
    padding: '13px',
    marginTop: '14px',
    background: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '9px',
    fontWeight: 600,
    fontSize: '1.08rem',
    cursor: 'pointer',
    transition: 'background .13s',
};

export default LoginPage;