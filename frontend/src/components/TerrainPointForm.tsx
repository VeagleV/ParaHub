// src/components/TerrainPointForm.tsx
import React, { useEffect, useState } from "react";
import type { TerrainPoint } from "../types/TerrainPoint";
import type { Spot } from "../types/Spot";

interface TerrainPointFormProps {
    initialData?: Partial<TerrainPoint>;
    spots?: Spot[];
    onSubmit: (tp: TerrainPoint & { spotId?: number }) => void;
    onCancel: () => void;
    autoFillMode?: 'coords-elevation' | 'elevation' | 'none';
    fetchElevation?: (lat: number, lng: number) => Promise<number | null>;
}

const TERRAIN_TYPES = [
    { value: "TAKEOFF", label: "Точка взлёта" },
    { value: "LANDING_ZONE", label: "Зона посадки" },
    { value: "BEACON", label: "Путевая точка" },
    { value: "LANDMARK", label: "Ориентир" },
];

export default function TerrainPointForm({
                                             initialData,
                                             spots = [],
                                             onSubmit,
                                             onCancel,
                                             autoFillMode = 'none',
                                             fetchElevation,
                                         }: TerrainPointFormProps) {
    const [formData, setFormData] = useState<TerrainPoint & { spotId?: number }>({
        name: initialData?.name || "",
        type: (initialData?.type as string) || "BEACON",
        latitude: (autoFillMode === 'coords-elevation' && initialData?.latitude != null) 
            ? initialData.latitude 
            : 0,
        longitude: (autoFillMode === 'coords-elevation' && initialData?.longitude != null) 
            ? initialData.longitude 
            : 0,
        elevation: 0,
        description: initialData?.description || "",
        // spotId optional
    });

    // Update internal state when initialData changes (important!)
    useEffect(() => {
        if (!initialData) return;
        setFormData((prev) => ({
            ...prev,
            name: initialData.name ?? prev.name,
            type: (initialData.type as string) ?? prev.type,
            // Only update coordinates if autoFillMode allows it
            latitude: (autoFillMode === 'coords-elevation' && initialData.latitude != null) 
                ? initialData.latitude 
                : prev.latitude,
            longitude: (autoFillMode === 'coords-elevation' && initialData.longitude != null) 
                ? initialData.longitude 
                : prev.longitude,
            description: initialData.description ?? prev.description,
        }));
    }, [initialData, autoFillMode]);

    // Auto-fill elevation when form opens
    useEffect(() => {
        const autoFillData = async () => {
            if (initialData?.latitude == null || initialData?.longitude == null || !fetchElevation) return;
            
            if (autoFillMode === 'coords-elevation') {
                const elevation = await fetchElevation(initialData.latitude, initialData.longitude);
                setFormData(prev => ({ 
                    ...prev, 
                    latitude: initialData.latitude!,
                    longitude: initialData.longitude!,
                    elevation: elevation ?? 0 
                }));
            } else if (autoFillMode === 'elevation') {
                const elevation = await fetchElevation(initialData.latitude, initialData.longitude);
                if (elevation !== null) {
                    setFormData(prev => ({ ...prev, elevation }));
                }
            }
        };
        autoFillData();
    }, [initialData?.latitude, initialData?.longitude, autoFillMode, fetchElevation]);

    const handleChange = (field: keyof TerrainPoint | "spotId", value: any) => {
        setFormData((s) => ({ ...s, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return; // simple guard
        onSubmit(formData);
        // Reset form after submission - respect autoFillMode
        setFormData({
            name: "",
            type: "BEACON",
            latitude: (autoFillMode === 'coords-elevation' && initialData?.latitude != null) 
                ? initialData.latitude 
                : 0,
            longitude: (autoFillMode === 'coords-elevation' && initialData?.longitude != null) 
                ? initialData.longitude 
                : 0,
            elevation: 0,
            description: "",
        });
        // Close the form
        onCancel();
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                padding: 30,
                borderRadius: 25,
                background: "rgba(20,20,20,0.75)", // enhanced dark glass matching SpotForm
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                width: 450,
                maxWidth: "90vw",
                boxSizing: "border-box",
                fontFamily: "system-ui, sans-serif",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
        >
            <h3 style={{ margin: "0 0 10px 0", textAlign: "center", fontSize: 22, fontWeight: 600 }}>Добавить точку рельефа</h3>

            <label style={{ fontSize: 14, fontWeight: 600 }}>Название</label>
            <input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Название точки"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />

            <label style={{ fontSize: 14, fontWeight: 600 }}>Тип</label>
            <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                style={{...inputStyle, cursor: "pointer"}}
                onFocus={handleFocus}
                onBlur={handleBlur}
            >
                {TERRAIN_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                        {t.label}
                    </option>
                ))}
            </select>

            <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 14, fontWeight: 600 }}>Широта</label>
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
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 14, fontWeight: 600 }}>Долгота</label>
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

            <label style={{ fontSize: 14, fontWeight: 600 }}>Высота</label>
            <input
                value={formData.elevation}
                onChange={(e) => handleChange("elevation", e.target.value)}
                placeholder="Высота точки"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />

            <label style={{ fontSize: 14, fontWeight: 600 }}>Описание</label>
            <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                placeholder="Краткое описание (опционально)"
                style={{ ...inputStyle, height: 80, resize: "vertical" as const }}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />

            <label style={{ fontSize: 14, fontWeight: 600 }}>Привязать к старту</label>
            <select
                value={formData.spotId ?? ""}
                onChange={(e) =>
                    handleChange("spotId", e.target.value ? parseInt(e.target.value) : undefined)
                }
                style={{...inputStyle, cursor: "pointer"}}
                onFocus={handleFocus}
                onBlur={handleBlur}
            >
                <option value="">(не привязывать)</option>
                {spots.map((s) => (
                    <option key={s.id} value={s.id}>
                        {s.name}
                    </option>
                ))}
            </select>

            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button 
                    type="submit"  
                    style={primaryButtonStyle}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(90deg,#1e90ff,#00b0ff)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(30,144,255,0.5)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "linear-gradient(90deg,#1e90ff,#00b0ff)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(30,144,255,0.3)";
                    }}
                >
                    Сохранить
                </button>
                <button 
                    type="button" 
                    onClick={onCancel} 
                    style={secondaryButtonStyle}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.transform = "translateY(0)";
                    }}
                >
                    Отмена
                </button>
            </div>
        </form>
    );
}

/* shared styles */
const inputStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.2)",
    outline: "none",
    fontSize: 15,
    background: "rgba(255,255,255,0.95)",
    color: "#000",
    boxSizing: "border-box",
    width: "100%",
    transition: "all 0.3s ease",
};

const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.boxShadow = "0 0 0 3px rgba(30,144,255,0.4)";
    e.target.style.borderColor = "rgba(30,144,255,0.6)";
    e.target.style.transform = "scale(1.01)";
};

const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.boxShadow = "none";
    e.target.style.borderColor = "rgba(255,255,255,0.2)";
    e.target.style.transform = "scale(1)";
};

const primaryButtonStyle: React.CSSProperties = {
    flex: 1,
    padding: "12px 20px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.3)",
    background: "linear-gradient(90deg,#1e90ff,#00b0ff)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 15,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(30,144,255,0.3)",
};

const secondaryButtonStyle: React.CSSProperties = {
    flex: 1,
    padding: "12px 20px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 15,
    transition: "all 0.3s ease",
};
