import React, { useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login2FA, verifyEmail } from "../api/auth";
import { AuthContext } from "../context/AuthContext";

const Verify2FAPage: React.FC = () => {
    const [params] = useSearchParams();
    const email = params.get("email") || "";
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    // если сюда попали после регистрации, будет ключ ?email=...
    const isRegistration = params.get("register") === "1";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (isRegistration) {
                await verifyEmail(email, code);
                setSuccess(true);
                setTimeout(() => navigate("/login"), 1500);
            } else {
                const resp = await login2FA(email, code);
                login(resp.data.accessToken);
                setSuccess(true);
                setTimeout(() => navigate("/profile"), 1000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Ошибка подтверждения");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{maxWidth: 350, margin: "30px auto"}}>
    <h2>Подтвердите код из e-mail</h2>
    <div>На e-mail <b>{email}</b> отправлен 6-значный код:</div>
    <input type="text" maxLength={6} minLength={4} placeholder="Код" required value={code} onChange={e=>setCode(e.target.value)} />
    <button type="submit">Подтвердить</button>
    {success && <div style={{color: "green"}}>Успех!</div>}
        {error && <div style={{color: "red"}}>{error}</div>}
        </form>
        );
        };
        export default Verify2FAPage;