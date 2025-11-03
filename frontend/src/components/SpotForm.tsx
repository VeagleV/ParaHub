import React, { useState } from "react";
import type { Spot } from "../types/Spot";

interface SpotFormProps {
    initialSpot?: Partial<Spot>;
    onSubmit: (spot: Spot) => void;
}

export default function SpotForm({ initialSpot, onSubmit }: SpotFormProps) {
    const [formData, setFormData] = useState<Spot>({
        name: initialSpot?.name || "",
        latitude: initialSpot?.latitude || 0,
        longitude: initialSpot?.longitude || 0,
        elevation: initialSpot?.elevation || 0,
        description: initialSpot?.description || "",
        suitableWinds: initialSpot?.suitableWinds || "",
        xcDifficulty: initialSpot?.xcDifficulty || 1,
        learningDifficulty: initialSpot?.learningDifficulty || 1,
        accessibility: initialSpot?.accessibility || "",
        popularity: initialSpot?.popularity || "",
    });

    const handleChange = (field: keyof Spot, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                padding: "25px",
                borderRadius: "20px",
                background: "rgba(0,0,0,0.6)", // dark glass
                backdropFilter: "blur(10px)",
                color: "#fff",
                maxWidth: "400px",
                width: "100%",
                boxSizing: "border-box",
                fontFamily: "sans-serif",
            }}
        >
            {/* Название */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: 5, fontWeight: 500 }}>Название старта</label>
                <input
                    type="text"
                    placeholder="Введите название"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: "none",
                        outline: "none",
                        fontSize: 14,
                        background: "rgba(255,255,255,0.9)",
                        color: "#000",
                    }}
                />
            </div>

            {/* Latitude / Longitude */}
            <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <label>Широта</label>
                    <input
                        type="number"
                        value={formData.latitude}
                        readOnly
                        style={{
                            padding: "8px 12px",
                            borderRadius: 10,
                            border: "none",
                            background: "rgba(255,255,255,0.9)",
                            color: "#000",
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                    />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <label>Долгота</label>
                    <input
                        type="number"
                        value={formData.longitude}
                        readOnly
                        style={{
                            padding: "8px 12px",
                            borderRadius: 10,
                            border: "none",
                            background: "rgba(255,255,255,0.9)",
                            color: "#000",
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                    />
                </div>
            </div>

            {/* Elevation */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Высота (м)</label>
                <input
                    type="number"
                    value={formData.elevation}
                    onChange={(e) => handleChange("elevation", parseFloat(e.target.value))}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: "none",
                        outline: "none",
                        fontSize: 14,
                        background: "rgba(255,255,255,0.9)",
                        color: "#000",
                    }}
                />
            </div>

            {/* Description */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Описание</label>
                <textarea
                    placeholder="Краткое описание..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={3}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: "none",
                        outline: "none",
                        resize: "vertical",
                        fontSize: 14,
                        background: "rgba(255,255,255,0.9)",
                        color: "#000",
                    }}
                />
            </div>

            {/* Suitable Winds */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Подходящие ветра</label>
                <input
                    type="text"
                    placeholder="например: С, СВ"
                    value={formData.suitableWinds}
                    onChange={(e) => handleChange("suitableWinds", e.target.value)}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: "none",
                        outline: "none",
                        fontSize: 14,
                        background: "rgba(255,255,255,0.9)",
                        color: "#000",
                    }}
                />
            </div>

            {/* Difficulty */}
            {/* XC Difficulty */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontWeight: 500 }}>Сложность маршрутных полётов ({formData.xcDifficulty})</label>
                <input
                    type="range"
                    min={1}
                    max={5}
                    value={formData.xcDifficulty}
                    onChange={(e) => handleChange("xcDifficulty", parseInt(e.target.value))}
                    style={{ width: "100%" }}
                />
            </div>

            {/* Learning Difficulty */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontWeight: 500 }}>
                    Сложность для обучения ({formData.learningDifficulty})
                </label>
                <input
                    type="range"
                    min={1}
                    max={5}
                    value={formData.learningDifficulty}
                    onChange={(e) =>
                        handleChange("learningDifficulty", parseInt(e.target.value))
                    }
                    style={{ width: "100%" }}
                />
            </div>


            {/* Accessibility */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Доступность</label>
                <input
                    type="text"
                    placeholder="например: дорога, тропа"
                    value={formData.accessibility}
                    onChange={(e) => handleChange("accessibility", e.target.value)}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: "none",
                        outline: "none",
                        fontSize: 14,
                        background: "rgba(255,255,255,0.9)",
                        color: "#000",
                    }}
                />
            </div>

            {/* Popularity */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Популярность</label>
                <input
                    type="text"
                    placeholder="например: высокая, средняя"
                    value={formData.popularity}
                    onChange={(e) => handleChange("popularity", e.target.value)}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: "none",
                        outline: "none",
                        fontSize: 14,
                        background: "rgba(255,255,255,0.9)",
                        color: "#000",
                    }}
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                style={{
                    padding: "10px 15px",
                    borderRadius: 12,
                    border: "none",
                    background: "rgba(30,144,255,0.8)",
                    color: "#fff",
                    fontWeight: 500,
                    cursor: "pointer",
                    marginTop: 10,
                }}
            >
                Добавить старт
            </button>
        </form>
    );
}
