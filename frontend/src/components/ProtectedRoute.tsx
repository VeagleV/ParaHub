import React, {type JSX, useContext} from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    if (!user) {
        // Используем state чтобы передать сообщение
        return <Navigate to="/login" replace state={{
            message: "Карта доступна только авторизованным пользователям."
        }} />;
    }

    return children;
};

export default ProtectedRoute;