import React, { useState, useEffect } from "react";
import type { Spot } from "../types/Spot";

interface SpotFormProps {
    initialSpot?:  Partial<Spot>;
    onSubmit: (spot: Spot) => void;
    autoFillMode?: 'coords-elevation' | 'elevation' | 'none';
    fetchElevation?:  (lat: number, lng: number) => Promise<number | null>;
}

export default function SpotForm({ initialSpot, onSubmit, autoFillMode = 'none', fetchElevation }: SpotFormProps) {
    const [formData, setFormData] = useState<Spot>({
        name: initialSpot?.name || "",
        latitude: initialSpot?.latitude ??  0,
        longitude: initialSpot?.longitude ?? 0,
        elevation: initialSpot?.elevation ?? 0,
        description: initialSpot?.description || "",
        suitableWinds: initialSpot?.suitableWinds || "",
        xcDifficulty: initialSpot?.xcDifficulty ??  1,
        learningDifficulty: initialSpot?. learningDifficulty ?? 1,
        accessibility: initialSpot?.accessibility || "",
        popularity: initialSpot?.popularity || "",
    });

    const handleChange = (field: keyof Spot, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    // Auto-fill coordinates and elevation when form opens
    useEffect(() => {
        if (initialSpot?. latitude != null && initialSpot?. longitude != null) {
            setFormData(prev => ({
                ...prev,
                latitude: initialSpot.latitude!,
                longitude: initialSpot.longitude!
            }));

            // Auto-fill elevation if enabled
            if (fetchElevation && (autoFillMode === 'coords-elevation' || autoFillMode === 'elevation')) {
                fetchElevation(initialSpot.latitude, initialSpot.longitude).then(elevation => {
                    if (elevation !== null) {
                        setFormData(prev => ({ ... prev, elevation }));
                    }
                });
            }
        }
    }, [initialSpot?.latitude, initialSpot?. longitude, autoFillMode, fetchElevation]);

    const handleSubmit = (e: React. FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Shared input style
    const inputStyle:  React.CSSProperties = {
        padding: "10px 14px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.2)",
        outline: "none",
        fontSize: 15,
        background: "rgba(255,255,255,0.95)",
        color: "#000",
        transition: "all 0.3s ease",
        width: "100%",
        boxSizing: "border-box" as const,
    };

    const labelStyle: React.CSSProperties = {
        marginBottom: 6,
        fontWeight: 600,
        fontSize: 14,
        display: "block",
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.target.style.boxShadow = "0 0 0 3px rgba(30,144,255,0.4)";
        e.target.style.borderColor = "rgba(30,144,255,0.6)";
        e.target.style.transform = "scale(1.01)";
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.target.style.boxShadow = "none";
        e.target.style.borderColor = "rgba(255,255,255,0.2)";
        e.target. style.transform = "scale(1)";
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                flexDirection: "column",
                gap:  "14px",
                padding: "25px",
                borderRadius: "25px",
                background: "rgba(20,20,20,0.80)", // glassmorphism
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                color: "#fff",
                maxWidth: "500px",
                width: "90vw",
                maxHeight: "88vh",
                overflowY: "auto",
                boxSizing: "border-box",
                fontFamily: "system-ui, sans-serif",
            }}
        >
            <h3 style={{ margin: "0 0 10px 0", textAlign: "center", fontSize: 22, fontWeight: 600 }}>
                ✈️ Добавить старт
            </h3>

            {/* Название */}
            <div>
                <label style={labelStyle}>Название старта</label>
                <input
                    type="text"
                    placeholder="Введите название"
                    value={formData. name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    required
                />
            </div>

            {/* Coordinates Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div>
                    <label style={labelStyle}>Широта</label>
                    <input
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) => handleChange("latitude", parseFloat(e. target.value) || 0)}
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required
                    />
                </div>
                <div>
                    <label style={labelStyle}>Долгота</label>
                    <input
                        type="number"
                        step="any"
                        value={formData. longitude}
                        onChange={(e) => handleChange("longitude", parseFloat(e.target.value) || 0)}
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required
                    />
                </div>
                <div>
                    <label style={labelStyle}>Высота (м)</label>
                    <input
                        type="number"
                        value={formData.elevation}
                        onChange={(e) => handleChange("elevation", parseFloat(e. target.value) || 0)}
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required
                    />
                </div>
            </div>

            {/* Suitable Winds with visual wind rose */}
            <div>
                <label style={labelStyle}>🌬️ Подходящие ветра (направление и сила)</label>
                <input
                    type="text"
                    placeholder="например:  С 5-10 м/с, СВ 3-7 м/с, З 4-8 м/с"
                    value={formData.suitableWinds}
                    onChange={(e) => handleChange("suitableWinds", e.target. value)}
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <div style={{
                    marginTop: 8,
                    fontSize:  12,
                    opacity: 0.7,
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0 5px"
                }}>
                    <span>💡 Направления: С, СВ, В, ЮВ, Ю, ЮЗ, З, СЗ</span>
                </div>
            </div>

            {/* Difficulty Sliders - Beautiful with gradient track */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                    <label style={labelStyle}>
                        🎯 XC сложность:  <strong style={{color: "#1E90FF"}}>{formData.xcDifficulty}</strong>
                    </label>
                    <input
                        type="range"
                        min={1}
                        max={5}
                        value={formData.xcDifficulty}
                        onChange={(e) => handleChange("xcDifficulty", parseInt(e.target.value))}
                        style={{
                            width: "100%",
                            accentColor: "rgba(30,144,255,0.8)",
                            height: 6,
                            cursor: "pointer",
                        }}
                    />
                    <div style={{display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.6, marginTop: 4}}>
                        <span>Легко</span>
                        <span>Сложно</span>
                    </div>
                </div>
                <div>
                    <label style={labelStyle}>
                        🎓 Обучение: <strong style={{color: "#1E90FF"}}>{formData.learningDifficulty}</strong>
                    </label>
                    <input
                        type="range"
                        min={1}
                        max={5}
                        value={formData. learningDifficulty}
                        onChange={(e) => handleChange("learningDifficulty", parseInt(e.target.value))}
                        style={{
                            width: "100%",
                            accentColor:  "rgba(30,144,255,0.8)",
                            height: 6,
                            cursor: "pointer",
                        }}
                    />
                    <div style={{display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.6, marginTop: 4}}>
                        <span>Легко</span>
                        <span>Сложно</span>
                    </div>
                </div>
            </div>

            {/* Accessibility and Popularity */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                    <label style={labelStyle}>🚗 Доступность</label>
                    <input
                        type="text"
                        placeholder="дорога, тропа"
                        value={formData. accessibility}
                        onChange={(e) => handleChange("accessibility", e.target.value)}
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </div>
                <div>
                    <label style={labelStyle}>⭐ Популярность</label>
                    <input
                        type="text"
                        placeholder="высокая, средняя"
                        value={formData. popularity}
                        onChange={(e) => handleChange("popularity", e.target.value)}
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                <label style={labelStyle}>📝 Описание</label>
                <textarea
                    placeholder="Краткое описание старта..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={3}
                    style={{... inputStyle, resize: "vertical" as const, minHeight: "60px"}}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                style={{
                    padding: "12px 20px",
                    borderRadius:  14,
                    border: "1px solid rgba(255,255,255,0.3)",
                    background: "linear-gradient(135deg, rgba(30,144,255,0.8) 0%, rgba(0,191,255,0.8) 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: "pointer",
                    marginTop: 6,
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(30,144,255,0.3)",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(30,144,255,1) 0%, rgba(0,191,255,1) 100%)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(30,144,255,0.5)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget. style.background = "linear-gradient(135deg, rgba(30,144,255,0.8) 0%, rgba(0,191,255,0.8) 100%)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget. style.boxShadow = "0 4px 12px rgba(30,144,255,0.3)";
                }}
            >
                ✅ Добавить старт
            </button>

            {/* Custom scrollbar styling */}
            <style>{`
                form: :-webkit-scrollbar {
                    width: 8px;
                }
                form::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
                form::-webkit-scrollbar-thumb {
                    background: rgba(30,144,255,0.6);
                    border-radius:  10px;
                }
                form::-webkit-scrollbar-thumb:hover {
                    background: rgba(30,144,255,0.8);
                }
            `}</style>
        </form>
    );
}