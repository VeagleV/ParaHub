// src/components/TerrainPointForm.tsx
import React, { useEffect, useState } from "react";
import type { TerrainPoint } from "../types/TerrainPoint";
import type { Spot } from "../types/Spot";

interface TerrainPointFormProps {
    initialData?: Partial<TerrainPoint>;
    spots?: Spot[];
    onSubmit: (tp: TerrainPoint & { spotId?: number }) => void;
    onCancel: () => void;
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
                                         }: TerrainPointFormProps) {
    const [formData, setFormData] = useState<TerrainPoint & { spotId?: number }>({
        name: initialData?.name || "",
        type: (initialData?.type as string) || "BEACON",
        latitude: initialData?.latitude ?? 0,
        longitude: initialData?.longitude ?? 0,
        elevation: initialData?.elevation ?? 0,
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
            latitude: initialData.latitude ?? prev.latitude,
            longitude: initialData.longitude ?? prev.longitude,
            description: initialData.description ?? prev.description,
        }));
    }, [initialData]);

    const handleChange = (field: keyof TerrainPoint | "spotId", value: any) => {
        setFormData((s) => ({ ...s, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return; // simple guard
        onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: 22,
                borderRadius: 16,
                background: "rgba(10,10,10,0.55)", // single dark glass card
                backdropFilter: "blur(8px)",
                color: "#fff",
                width: 420,
                boxSizing: "border-box",
                fontFamily: "Inter, system-ui, sans-serif",
                boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
            }}
        >
            <h3 style={{ margin: 0, textAlign: "center" }}>Добавить точку рельефа</h3>

            <label style={{ fontSize: 13, fontWeight: 600 }}>Название</label>
            <input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Название точки"
                style={inputStyle}
            />

            <label style={{ fontSize: 13, fontWeight: 600 }}>Тип</label>
            <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                style={inputStyle}
            >
                {TERRAIN_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                        {t.label}
                    </option>
                ))}
            </select>

            <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 13, fontWeight: 600 }}>Широта</label>
                    <input value={formData.latitude} readOnly style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 13, fontWeight: 600 }}>Долгота</label>
                    <input value={formData.longitude} readOnly style={inputStyle} />
                </div>
            </div>

            <label style={{ fontSize: 13, fontWeight: 600 }}>Высота</label>
            <input
                value={formData.elevation}
                onChange={(e) => handleChange("elevation", e.target.value)}
                placeholder="Высота точки"
                style={inputStyle}
            />

            <label style={{ fontSize: 13, fontWeight: 600 }}>Описание</label>
            <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                placeholder="Краткое описание (опционально)"
                style={{ ...inputStyle, height: 76, resize: "vertical" }}
            />

            <label style={{ fontSize: 13, fontWeight: 600 }}>Привязать к старту</label>
            <select
                value={formData.spotId ?? ""}
                onChange={(e) =>
                    handleChange("spotId", e.target.value ? parseInt(e.target.value) : undefined)
                }
                style={inputStyle}
            >
                <option value="">(не привязывать)</option>
                {spots.map((s) => (
                    <option key={s.id} value={s.id}>
                        {s.name}
                    </option>
                ))}
            </select>

            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <button type="submit"  style={primaryButtonStyle}>
                    Сохранить
                </button>
                <button type="button" onClick={onCancel} style={secondaryButtonStyle}>
                    Отмена
                </button>
            </div>
        </form>
    );
}

/* shared styles */
const inputStyle: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    outline: "none",
    fontSize: 14,
    background: "rgba(255,255,255,0.92)",
    color: "#000",
    boxSizing: "border-box",
    width: "100%",
};

const primaryButtonStyle: React.CSSProperties = {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(90deg,#1e90ff,#00b0ff)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
};

const secondaryButtonStyle: React.CSSProperties = {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
};
