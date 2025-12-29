import React, { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await register(form);
            setSuccess(true);
            setTimeout(() => navigate("/verify?email=" + encodeURIComponent(form.email)), 1000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Ошибка регистрации");
        }
    };

    if (success) return <div>Проверьте почту — вам отправлен код подтверждения!</div>;

    return (
        <form onSubmit={handleSubmit} style={{maxWidth: 350, margin: "30px auto"}}>
            <h2>Регистрация</h2>
            <input type="text" name="username" placeholder="Имя пользователя" required value={form.username} onChange={handleChange} />
            <input type="email" name="email" placeholder="E-mail" required value={form.email} onChange={handleChange} />
            <input type="password" name="password" placeholder="Пароль" required value={form.password} onChange={handleChange} />
            <button type="submit">Зарегистрироваться</button>
            {error && <div style={{color: "red"}}>{error}</div>}
        </form>
    );
};

export default RegisterPage;