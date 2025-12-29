import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { login2FA, verifyEmail, resendCode } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
const RESEND_TIMEOUT = 30; // таймаут между отправками

const Verify2FAPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";

    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login, setUser } = useContext(AuthContext);

    // Проверка, регистрация это или 2FA-вход
    const isRegistration = searchParams.get("register") === "1";
    const location = useLocation();
    const infoMessage = location.state?.message;

    // Таймер для повторной отправки
    const [canResend, setCanResend] = useState(true);
    const [timer, setTimer] = useState<number>(0);

    // Обработчик повторной отправки кода
    const handleResend = async () => {
        if (!canResend) return;
        setError(null);
        try {
            await resendCode(email, isRegistration);
            setError("Код успешно повторно отправлен!");
            setCanResend(false);
            setTimer(RESEND_TIMEOUT);
        } catch (e) {
            setError("Ошибка при повторной отправке кода");
        }
    };

    // Таймер для блокировки повторной отправки
    useEffect(() => {
        if (!canResend && timer > 0) {
            const id = setInterval(() => {
                setTimer((t) => {
                    if (t <= 1) {
                        setCanResend(true);
                        clearInterval(id);
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
            return () => clearInterval(id);
        }
    }, [canResend, timer]);

    // Обработка сабмита кода
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            if (isRegistration) {
                await verifyEmail(email, code);
                setSuccess(true);
                setTimeout(() => navigate("/login"), 2000);
            } else {
                const resp = await login2FA(email, code);
                // Сохрани токен, если нужно (обычно в localStorage/cookie)
                // localStorage.setItem("token", resp.data.accessToken); // если у тебя есть токены
                // После этого делаем fetch на /api/user/me
                const meResp = await fetch("/api/user/me", {
                    headers: {
                        Authorization: "Bearer dev" // тот же что и для TopBar/AuthContext
                    }
                });
                const user = meResp.ok ? await meResp.json() : null;
                setUser(user);
                setSuccess(true);
                setTimeout(() => navigate("/profile"), 1500);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Ошибка подтверждения");
        }
        setLoading(false);
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
                        marginBottom: '18px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: '1.6rem',
                        color: '#363636'
                    }}>
                        {isRegistration ? "Подтвердите e-mail" : "Введите код 2FA"}
                    </h2>
                    <div style={{
                        marginBottom: '10px',
                        color: "#333",
                        textAlign: 'center',
                        fontSize: '1.07rem'
                    }}>
                        На <b>{email}</b> отправлен код подтверждения.<br />
                        <span style={{ fontSize: '0.96rem', color: "#666" }}>
                            Введите 6-значный код из письма.
                        </span>
                    </div>
                    {infoMessage && (
                        <div style={{
                            marginBottom: "10px",
                            color: "#d9534f",
                            background: "rgba(255,255,255,0.55)",
                            borderRadius: "8px",
                            padding: "10px",
                            fontWeight: 600,
                            textAlign: "center",
                            boxShadow: "0 2px 8px rgba(200,0,0,.07)",
                        }}>
                            {infoMessage}
                        </div>
                    )}
                    <input
                        type="text"
                        maxLength={6}
                        minLength={4}
                        placeholder="Код из e-mail"
                        required
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        style={{
                            width: '100%',
                            margin: '14px 0',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(200,200,200,0.6)',
                            fontSize: '1.16rem',
                            background: 'rgba(255,255,255,0.97)',
                            textAlign: 'center',
                            color: '#222'
                        }}
                        autoFocus
                        inputMode="numeric"
                    />
                    <button type="submit" style={{
                        ...buttonStyle,
                        background: success ? "#5cb85c" : "#333",
                        cursor: loading ? "wait" : "pointer",
                        opacity: loading ? 0.7 : 1
                    }}>
                        {isRegistration ? "Подтвердить E-mail" : "Войти"}
                    </button>
                    <div style={{ marginTop: "14px", textAlign: "center" }}>
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={!canResend}
                            style={{
                                background: "none",
                                color: canResend ? "#007bff" : "#999",
                                border: "none",
                                fontWeight: 700,
                                textDecoration: canResend ? "underline" : "none",
                                cursor: canResend ? "pointer" : "not-allowed",
                                padding: 0
                            }}
                        >
                            {canResend ? "Отправить код повторно" : `Можно отправить через ${timer} сек.`}
                        </button>
                    </div>
                    {error && <div style={{ color: 'red', margin: '18px 0 0 0', textAlign: 'center' }}>{error}</div>}
                    {success && <div style={{ color: "#5cb85c", marginTop: "15px", fontWeight: 600, textAlign: "center" }}>
                        Успешно! Перенаправление...
                    </div>}
                </form>
            </div>
        </div>
    );
};

const buttonStyle = {
    width: '100%',
    padding: '13px',
    marginTop: '10px',
    background: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '9px',
    fontWeight: 600,
    fontSize: '1.08rem',
    cursor: 'pointer',
    transition: 'background .13s',
};

export default Verify2FAPage;