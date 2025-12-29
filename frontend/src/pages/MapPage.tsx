import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MapView from "../components/MapView"; // Твоя готовая карта

const MapPage: React.FC = () => {
    const { user } = useContext(AuthContext);

    const handleAddStart = () => {
        // Функция добавления старта админом
        console.log("Adding start by Admin");
    };

    const handleRemoveStart = () => {
        // Функция удаления старта админом
        console.log("Removing start by Admin");
    };

    return (
        <div>
            <MapView />
            {user?.role === "ADMIN" && (
                <div style={{ position: "absolute", bottom: 20, right: 20, display: "flex", gap: 10 }}>
                    <button style={buttonStyle} onClick={handleAddStart}>Добавить старт</button>
                    <button style={buttonStyle} onClick={handleRemoveStart}>Удалить старт</button>
                </div>
            )}
        </div>
    );
};

const buttonStyle = {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    padding: "10px 20px",
    cursor: "pointer",
    color: "#333",
};

export default MapPage;