import React, { useState, useEffect } from "react";
import type { Spot, Wind } from "../types/Spot";
import DifficultyBadge, { DIFFICULTY_CONFIG } from './DifficultyBadge';
import { WIND_ARROWS } from './WindChips';

interface SpotFormProps {
    initialSpot?: Partial<Spot>;
    onSubmit: (spot: Spot) => void;
    autoFillMode?: 'coords-elevation' | 'elevation' | 'none';
    fetchElevation?: (lat: number, lng: number) => Promise<number | null>;
}

const DIRECTIONS = [
    { code: 'N' as const, label: 'Север', arrow: '↑' },
    { code: 'NE' as const, label: 'Северо-Восток', arrow: '↗' },
    { code: 'E' as const, label: 'Восток', arrow: '→' },
    { code: 'SE' as const, label: 'Юго-Восток', arrow: '↘' },
    { code: 'S' as const, label: 'Юг', arrow: '↓' },
    { code: 'SW' as const, label: 'Юго-Запад', arrow: '↙' },
    { code: 'W' as const, label: 'Запад', arrow: '←' },
    { code: 'NW' as const, label: 'Северо-Запад', arrow: '↖' }
];

export default function SpotForm({ initialSpot, onSubmit, autoFillMode = 'none', fetchElevation }: SpotFormProps) {
    const [winds, setWinds] = useState<Wind[]>(initialSpot?.winds || []);
    const [formData, setFormData] = useState<Spot>({
        name: initialSpot?.name || "",
        // Координаты заполняются только если режим 'coords-elevation'
        latitude: (autoFillMode === 'coords-elevation' && initialSpot?.latitude != null) 
            ? initialSpot.latitude 
            : 0,
        longitude: (autoFillMode === 'coords-elevation' && initialSpot?.longitude != null) 
            ? initialSpot.longitude 
            : 0,
        elevation: 0, // Будет заполнено в useEffect
        description: initialSpot?.description || "",
        suitableWinds: initialSpot?.suitableWinds || "",
        xcDifficulty: initialSpot?.xcDifficulty ?? 1,
        learningDifficulty: initialSpot?.learningDifficulty ?? 1,
        accessibility: initialSpot?.accessibility || "",
        popularity: initialSpot?.popularity || "",
    });

    const handleChange = (field: keyof Spot, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    // Auto-fill elevation when form opens
    useEffect(() => {
        const autoFillData = async () => {
            if (initialSpot?.latitude == null || initialSpot?.longitude == null || !fetchElevation) return;
            
            if (autoFillMode === 'coords-elevation') {
                // Заполнить координаты и высоту
                const elevation = await fetchElevation(initialSpot.latitude, initialSpot.longitude);
                setFormData(prev => ({ 
                    ...prev, 
                    latitude: initialSpot.latitude!,
                    longitude: initialSpot.longitude!,
                    elevation: elevation ?? 0 
                }));
            } else if (autoFillMode === 'elevation') {
                // Только высота
                const elevation = await fetchElevation(initialSpot.latitude, initialSpot.longitude);
                if (elevation !== null) {
                    setFormData(prev => ({ ...prev, elevation }));
                }
            }
            // autoFillMode === 'none' - ничего не заполняем
        };
        autoFillData();
    }, [initialSpot?.latitude, initialSpot?.longitude, autoFillMode, fetchElevation]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, winds });
        // Reset form after submission - respect autoFillMode
        setFormData({
            name: "",
            latitude: (autoFillMode === 'coords-elevation' && initialSpot?.latitude != null) 
                ? initialSpot.latitude 
                : 0,
            longitude: (autoFillMode === 'coords-elevation' && initialSpot?.longitude != null) 
                ? initialSpot.longitude 
                : 0,
            elevation: 0,
            description: "",
            suitableWinds: "",
            xcDifficulty: 1,
            learningDifficulty: 1,
            accessibility: "",
            popularity: "",
        });
        setWinds([]);
    };

    // Shared input style
    const inputStyle: React.CSSProperties = {
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
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.target.style.boxShadow = "0 0 0 3px rgba(30,144,255,0.4)";
        e.target.style.borderColor = "rgba(30,144,255,0.6)";
        e.target.style.transform = "scale(1.01)";
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.target.style.boxShadow = "none";
        e.target.style.borderColor = "rgba(255,255,255,0.2)";
        e.target.style.transform = "scale(1)";
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "30px",
                borderRadius: "25px",
                background: "rgba(20,20,20,0.75)", // enhanced dark glass
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                color: "#fff",
                maxWidth: "450px",
                width: "100%",
                boxSizing: "border-box",
                fontFamily: "system-ui, sans-serif",
            }}
        >
            {/* Название */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Название старта</label>
                <input
                    type="text"
                    placeholder="Введите название"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </div>

            {/* Latitude / Longitude */}
            <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <label style={labelStyle}>Широта</label>
                    <input
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) => {
                            const parsed = parseFloat(e.target.value);
                            handleChange("latitude", isNaN(parsed) ? 0 : parsed);
                        }}
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder="Широта"
                    />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <label style={labelStyle}>Долгота</label>
                    <input
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) => {
                            const parsed = parseFloat(e.target.value);
                            handleChange("longitude", isNaN(parsed) ? 0 : parsed);
                        }}
                        style={inputStyle}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder="Долгота"
                    />
                </div>
            </div>

            {/* Elevation */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Высота (м)</label>
                <input
                    type="number"
                    value={formData.elevation}
                    onChange={(e) => handleChange("elevation", parseFloat(e.target.value))}
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </div>

            {/* Description */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Описание</label>
                <textarea
                    placeholder="Краткое описание..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={3}
                    style={{...inputStyle, resize: "vertical" as const}}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </div>

            {/* Wind Management Section */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={labelStyle}>Подходящие ветра</label>
                
                {DIRECTIONS.map(dir => {
                    const wind = winds.find(w => w.direction === dir.code);
                    const isActive = !!wind;
                    
                    return (
                        <div key={dir.code} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 12,
                            padding: 8,
                            borderRadius: 8,
                            background: isActive ? 'rgba(46,204,113,0.1)' : 'transparent'
                        }}>
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setWinds([...winds, { direction: dir.code, minSpeed: 3, maxSpeed: 10 }]);
                                    } else {
                                        setWinds(winds.filter(w => w.direction !== dir.code));
                                    }
                                }}
                                style={{ width: 18, height: 18, cursor: 'pointer' }}
                            />
                            
                            <span style={{ fontSize: 18 }}>{dir.arrow}</span>
                            <span style={{ fontSize: 14, fontWeight: 500, minWidth: 120 }}>
                                {dir.label}
                            </span>
                            
                            {isActive && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                                    <input
                                        type="number"
                                        min={0}
                                        max={30}
                                        value={wind!.minSpeed}
                                        onChange={(e) => {
                                            setWinds(winds.map(w => 
                                                w.direction === dir.code 
                                                    ? { ...w, minSpeed: parseInt(e.target.value) || 0 } 
                                                    : w
                                            ));
                                        }}
                                        style={{ width: 50, padding: 4, textAlign: 'center', borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)' }}
                                    />
                                    <span>—</span>
                                    <input
                                        type="number"
                                        min={0}
                                        max={30}
                                        value={wind!.maxSpeed}
                                        onChange={(e) => {
                                            setWinds(winds.map(w => 
                                                w.direction === dir.code 
                                                    ? { ...w, maxSpeed: parseInt(e.target.value) || 0 } 
                                                    : w
                                            ));
                                        }}
                                        style={{ width: 50, padding: 4, textAlign: 'center', borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)' }}
                                    />
                                    <span style={{ fontSize: 12 }}>м/с</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Difficulty */}
            {/* XC Difficulty */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={labelStyle}>
                    Сложность маршрутных полётов: <DifficultyBadge level={formData.xcDifficulty || 1} />
                </label>
                <input
                    type="range"
                    min={1}
                    max={5}
                    value={formData.xcDifficulty}
                    onChange={(e) => handleChange("xcDifficulty", parseInt(e.target.value))}
                    style={{ 
                        width: "100%",
                        accentColor: DIFFICULTY_CONFIG[formData.xcDifficulty as keyof typeof DIFFICULTY_CONFIG]?.color || '#f39c12',
                        height: 8,
                        cursor: "pointer",
                    }}
                />
                <div style={{display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.7}}>
                    <span>🟢 Новичок</span>
                    <span>🔵 Лёгкий</span>
                    <span>🟡 Средний</span>
                    <span>🟠 Сложный</span>
                    <span>🔴 Эксперт</span>
                </div>
            </div>

            {/* Learning Difficulty */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={labelStyle}>
                    Сложность для обучения: <DifficultyBadge level={formData.learningDifficulty || 1} />
                </label>
                <input
                    type="range"
                    min={1}
                    max={5}
                    value={formData.learningDifficulty}
                    onChange={(e) =>
                        handleChange("learningDifficulty", parseInt(e.target.value))
                    }
                    style={{ 
                        width: "100%",
                        accentColor: DIFFICULTY_CONFIG[formData.learningDifficulty as keyof typeof DIFFICULTY_CONFIG]?.color || '#f39c12',
                        height: 8,
                        cursor: "pointer",
                    }}
                />
                <div style={{display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.7}}>
                    <span>🟢 Новичок</span>
                    <span>🔵 Лёгкий</span>
                    <span>🟡 Средний</span>
                    <span>🟠 Сложный</span>
                    <span>🔴 Эксперт</span>
                </div>
            </div>


            {/* Accessibility */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Доступность</label>
                <input
                    type="text"
                    placeholder="например: дорога, тропа"
                    value={formData.accessibility}
                    onChange={(e) => handleChange("accessibility", e.target.value)}
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </div>

            {/* Popularity */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Популярность</label>
                <input
                    type="text"
                    placeholder="например: высокая, средняя"
                    value={formData.popularity}
                    onChange={(e) => handleChange("popularity", e.target.value)}
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                style={{
                    padding: "12px 20px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.3)",
                    background: "rgba(30,144,255,0.7)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: "pointer",
                    marginTop: 10,
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(30,144,255,0.3)",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(30,144,255,0.9)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(30,144,255,0.5)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(30,144,255,0.7)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(30,144,255,0.3)";
                }}
            >
                Добавить старт
            </button>
        </form>
    );
}
