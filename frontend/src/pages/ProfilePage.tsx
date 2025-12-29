import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProfilePage: React.FC = () => {
    const { user } = useContext(AuthContext);
    if (!user) return null;

    return (
        <div style={{maxWidth: 400, margin: "30px auto"}}>
            <h2>Профиль</h2>
            <p><b>Имя:</b> {user.username}</p>
            <p><b>E-mail:</b> {user.email}</p>
            <p><b>Роль:</b> {user.role}</p>
            <p><b>Аккаунт активирован:</b> {user.enabled ? "Да" : "Нет"}</p>
            <p><b>Зарегистрирован:</b> {user.createdAt && (new Date(user.createdAt)).toLocaleString()}</p>
        </div>
    );
};
export default ProfilePage;