import React, {type JSX, useContext} from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: JSX.Element;
    requiredRole?: "USER" | "ADMIN";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    if (!user) {
        // Если не залогинен — отправляем на /login с возвратом
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // Если не хватает прав — перенаправим на главную
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;