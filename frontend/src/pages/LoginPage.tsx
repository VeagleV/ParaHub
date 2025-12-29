import React, { useState } from "react";
import { loginRequest2FA } from "../api/auth";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await loginRequest2FA(form.email, form.password);
            setSent(true);
            setTimeout(() => navigate(`/verify?email=${encodeURIComponent(form.email)}`), 1000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Ошибка входа");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{maxWidth: 350, margin: "30px auto"}}>
            <h2>Вход</h2>
            <input type="email" name="email" placeholder="E-mail" required value={form.email} onChange={handleChange} />
            <input type="password" name="password" placeholder="Пароль" required value={form.password} onChange={handleChange} />
            <button type="submit">Войти</button>
            {sent && <div style={{color: "green"}}>Код отправлен на почту!</div>}
            {error && <div style={{color: "red"}}>{error}</div>}
        </form>
    );
};
export default LoginPage;