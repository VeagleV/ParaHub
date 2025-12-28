import React, { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from "react-leaflet";
import { createTerrainPoint } from "../api/terrainPointsApi";
import { getAllSpots, createSpot } from "../api/spotApi";
import type { LatLngExpression } from "leaflet";
import Modal from "react-modal";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import type {Spot} from "../types/Spot.ts";
import type {TerrainPoint} from "../types/TerrainPoint.ts";
import SpotCard from "./SpotCard.tsx";
import SpotForm from "./SpotForm.tsx";
import TerrainPointForm from "./TerrainPointForm.tsx";

L.Icon.Default.mergeOptions({ iconUrl, shadowUrl });
delete (L.Icon.Default.prototype as any)._getIconUrl;

type LayerType = "standard" | "topo" | "satellite";

interface LocationSelectorProps {
    onSelect: (lat: number, lng: number) => void;
    setCursor: (lat: number, lng: number) => void;
    setContextMenuPos: (pos: { x: number; y: number } | null) => void;
    setContextMenuData: (data: { lat: number; lng: number } | null) => void;
}


function LocationSelector({
                              onSelect,
                              setCursor,
                              setContextMenuPos,
                              setContextMenuData,
                          }: LocationSelectorProps) {
    useMapEvents({
        click(e: L.LeafletMouseEvent) {
            setContextMenuPos(null); // close context menu
            onSelect(e.latlng.lat, e.latlng.lng);
        },
        mousemove(e: L.LeafletMouseEvent) {
            setCursor(e.latlng.lat, e.latlng.lng);
           // setContextMenuPos(null); // also close menu when moving map
        },
        contextmenu(e: L.LeafletMouseEvent) {
            setContextMenuPos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
            setContextMenuData({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
        dragstart: () => setContextMenuPos(null),
        zoomstart: () => setContextMenuPos(null),
    });
    return null;
}



const Toast = ({ message, type }: { message: string; type: "success" | "error" | "info" }) => (
    <div
        style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "15px 25px",
            borderRadius: "15px",
            color: "#fff",
            background:
                type === "success"
                    ? "rgba(0, 180, 100, 0.3)"
                    : type === "error"
                        ? "rgba(200, 50, 50, 0.3)"
                        : "rgba(50, 100, 200, 0.3)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            zIndex: 3000,
            fontWeight: 500,
        }}
    >
        {message}
    </div>
);

const MapView: React.FC = () => {
    const [spots, setSpots] = useState<Spot[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [hoverPos, setHoverPos] = useState<{ lat: number; lng: number } | null>(null);
    const [newSpot, setNewSpot] = useState<Spot | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    const [activeLayer, setActiveLayer] = useState<LayerType>("standard");
    const [layerPopupOpen, setLayerPopupOpen] = useState(false);

    const [cursorElevation, setCursorElevation] = useState<number | null>(null);
    const [cursorPos, setCursorPos] = useState<{ lat: number; lng: number } | null>(null);

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [elevationEnabled, setElevationEnabled] = useState(false);

    const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
    const [contextMenuData, setContextMenuData] = useState<{ lat: number; lng: number } | null>(null);

    const [spotFormOpen, setSpotFormOpen] = useState(false);
    const [terrainFormOpen, setTerrainFormOpen] = useState(false);



    const center: LatLngExpression = [55.75, 37.61];


    const layers: Record<LayerType, { url: string; label: string }> = {
        standard: { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", label: "Standard" },
        topo: { url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", label: "Topographic" },
        satellite: {
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            label: "Satellite",
        },
    };

    useEffect(() => {
        const fetchSpots = async () => {
            try {
                const data = await getAllSpots();
                setSpots(data);
            } catch (err) {
                console.error("Ошибка загрузки стартов:", err);
            }
        };
        fetchSpots();
    }, []);

    const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSpotSave = async (data: Spot) => {

        try {
            const savedSpot = await createSpot(data);

            setSpots([...spots, savedSpot]);
            setModalOpen(false);
            setSpotFormOpen(false); // Close the spot form modal
            setNewSpot(null);
            showToast("Старт успешно добавлен!", "success");
        } catch (err) {
            console.error(err);
            showToast("Ошибка при добавлении старта", "error");
        }
    };

    const handleTerrainSubmit = async (data: TerrainPoint & { spotId?: number }) => {
        try {
            const result = await createTerrainPoint(data, data.spotId);
            console.log("✅ TerrainPoint saved:", result);
            showToast("Точка рельефа успешно добавлена!", "success");
        } catch (err) {
            console.error("❌ Ошибка при добавлении точки рельефа:", err);
            showToast("Не удалось добавить точку рельефа", "error");
        }
    };


    const handleSelect = (lat: number, lng: number) => {
        if (isAdding) {
            setNewSpot({ latitude: lat, longitude: lng });
            setModalOpen(true);
            setIsAdding(false);
        }
    };

    // --- Elevation fetching ---
    const [lastFetchPos, setLastFetchPos] = useState<{lat: number, lng: number} | null>(null);

    useEffect(() => {
        if (!cursorPos) return;

        // Only fetch if moved > ~0.0001 degrees (~11m)
        const moved =
            !lastFetchPos ||
            Math.abs(cursorPos.lat - lastFetchPos.lat) > 0.0001 ||
            Math.abs(cursorPos.lng - lastFetchPos.lng) > 0.0001;

        if (!moved) return;

        const timer = setTimeout(async () => {
            if(elevationEnabled) {
                try {
                    const res = await fetch(
                        `https://api.open-elevation.com/api/v1/lookup?locations=${cursorPos.lat},${cursorPos.lng}`
                    );
                    const data = await res.json();
                    if (data.results && data.results.length > 0) {
                        setCursorElevation(Math.round(data.results[0].elevation));
                        setLastFetchPos(cursorPos);
                    }
                } catch (err) {
                    console.error("Elevation fetch error:", err);
                    setCursorElevation(null);
                }
            }
        }, 100); // smaller debounce for faster feeling

        return () => clearTimeout(timer);
    }, [cursorPos, lastFetchPos]);




    return (
        <div style={{ height: "100vh", width: "100vw", position: "relative" }}
        onClick={() => setContextMenuPos(null)}>
            {toast && (
                <div
                    style={{
                        position: "fixed",
                        top: 20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: 
                            toast.type === "success"
                                ? "rgba(0, 200, 120, 0.3)"
                                : toast.type === "error"
                                    ? "rgba(220, 60, 60, 0.3)"
                                    : "rgba(30, 144, 255, 0.3)",
                        backdropFilter: "blur(15px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "#fff",
                        padding: "15px 30px",
                        borderRadius: 15,
                        zIndex: 3000,
                        fontWeight: 500,
                        fontSize: 15,
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                        animation: "slideDown 0.3s ease",
                    }}
                >
                    {toast.message}
                </div>
            )}

            <MapContainer
                center={center}
                zoom={5}
                style={{ height: "100%", width: "100%" }}
                attributionControl={false} // hide Leaflet watermark
            >
                <TileLayer url={layers[activeLayer].url} />
                {spots.map((spot) => (
                    <Marker key={spot.id} position={[spot.latitude, spot.longitude]}>
                        <Popup>
                            <SpotCard
                                spot={spot}
                                onAddTerrainPoint={(s) => {
                                    console.log("Add terrain point for spot:", s);
                                }}
                            />
                        </Popup>
                    </Marker>
                ))}

                {hoverPos && isAdding && <Marker position={[hoverPos.lat, hoverPos.lng]} />}
                {newSpot && !modalOpen && <Marker position={[newSpot.latitude, newSpot.longitude]} />}
                <LocationSelector
                    onSelect={handleSelect}
                    setCursor={(lat, lng) => setCursorPos({ lat, lng })}
                    setContextMenuPos={setContextMenuPos}
                    setContextMenuData={setContextMenuData}
                />

            </MapContainer>

            {contextMenuPos && (
                <div
                    style={{
                        position: "fixed",
                        top: contextMenuPos.y,
                        left: contextMenuPos.x,
                        background: "rgba(20,20,20,0.9)",
                        color: "#fff",
                        padding: 12,
                        borderRadius: 15,
                        zIndex: 5000,
                        backdropFilter: "blur(15px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                        minWidth: 180,
                    }}
                    onClick={(e) => e.stopPropagation()} // prevent menu from closing when clicking inside
                >
                    <div
                        style={{ 
                            cursor: "pointer", 
                            padding: "8px 12px",
                            borderRadius: 10,
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(30,144,255,0.3)";
                            e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.transform = "translateX(0)";
                        }}
                        onClick={() => {
                            setNewSpot({ latitude: contextMenuData!.lat, longitude: contextMenuData!.lng });
                            setSpotFormOpen(true);
                            setContextMenuPos(null);
                        }}
                    >
                        ➕ Add Spot
                    </div>
                    <div
                        style={{ 
                            cursor: "pointer", 
                            padding: "8px 12px",
                            borderRadius: 10,
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(30,144,255,0.3)";
                            e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.transform = "translateX(0)";
                        }}
                        onClick={() => {
                            setTerrainFormOpen(true);
                            setContextMenuPos(null);
                        }}
                    >
                        🏔️ Add Terrain Point
                    </div>
                </div>
            )}


            {/* Control panel */}
            <div
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    zIndex: 1000,
                    background: "rgba(255,255,255,0.15)",
                    padding: 12,
                    borderRadius: 20,
                    backdropFilter: "blur(15px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease",
                }}
            >
                {/* Settings button */}
                <button
                    aria-label="Открыть настройки"
                    style={{
                        background: "rgba(100,100,100,0.4)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        padding: "10px 15px",
                        borderRadius: 12,
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: 500,
                        transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(100,100,100,0.6)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(100,100,100,0.4)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                    onClick={() => setSettingsOpen(true)}
                >
                    ⚙️ Настройки
                </button>
            </div>

            {/* Settings modal */}
            <Modal
                isOpen={settingsOpen}
                onRequestClose={() => setSettingsOpen(false)}
                style={{
                    overlay: { 
                        backgroundColor: "rgba(0,0,0,0.5)", 
                        zIndex: 2000,
                        backdropFilter: "blur(4px)",
                    },
                    content: {
                        inset: "50% auto auto 50%",
                        transform: "translate(-50%, -50%)",
                        width: 320,
                        borderRadius: 25,
                        padding: 30,
                        background: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(15px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                        color: "#fff",
                        textAlign: "center",
                    },
                }}
            >
                <h2 style={{ margin: "0 0 25px 0", fontSize: 24, fontWeight: 600 }}>Настройки</h2>

                {/* Elevation toggle */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 25,
                    }}
                >
                    <span style={{ fontWeight: 500, fontSize: 15 }}>Показывать высоту</span>
                    <div
                        onClick={() => setElevationEnabled(!elevationEnabled)}
                        style={{
                            width: 54,
                            height: 28,
                            borderRadius: 14,
                            background: elevationEnabled 
                                ? "linear-gradient(135deg, #4cd137 0%, #44bd32 100%)" 
                                : "rgba(150, 150, 150, 0.5)",
                            position: "relative",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            border: "1px solid rgba(255,255,255,0.2)",
                        }}
                    >
                        <div
                            style={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                background: "#fff",
                                position: "absolute",
                                top: 1.5,
                                left: elevationEnabled ? 28 : 2,
                                transition: "all 0.3s ease",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                            }}
                        />
                    </div>
                </div>

                <button
                    onClick={() => setSettingsOpen(false)}
                    aria-label="Закрыть настройки"
                    style={{
                        marginTop: 10,
                        padding: "12px 24px",
                        background: "rgba(30,144,255,0.6)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: 12,
                        cursor: "pointer",
                        color: "white",
                        fontWeight: 600,
                        fontSize: 15,
                        transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(30,144,255,0.8)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(30,144,255,0.4)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(30,144,255,0.6)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    Закрыть
                </button>
            </Modal>

            {/* Elevation info box */}
            {elevationEnabled && cursorElevation !== null && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 20,
                        left: 20,
                        padding: "12px 18px",
                        borderRadius: 15,
                        background: "rgba(20,20,20,0.6)",
                        backdropFilter: "blur(15px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "#fff",
                        fontWeight: 500,
                        fontSize: 14,
                        zIndex: 1000,
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    📍 Возвышение: <strong>{cursorElevation} m</strong>
                </div>
            )}

            {/* Layer selector button */}
            <div style={{ position: "absolute", bottom: 20, right: 20, zIndex: 1000 }}>
                <button
                    aria-label="Выбрать слой карты"
                    onClick={() => setLayerPopupOpen(!layerPopupOpen)}
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.3)",
                        background: "rgba(30,144,255,0.6)",
                        backdropFilter: "blur(10px)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 26,
                        color: "#fff",
                        boxShadow: "0 4px 16px rgba(30,144,255,0.3)",
                        transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(30,144,255,0.5)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(30,144,255,0.3)";
                    }}
                >
                    🗺️
                </button>

                {layerPopupOpen && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 65,
                            right: 0,
                            width: 240,
                            background: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(15px)",
                            borderRadius: 20,
                            padding: 15,
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                            border: "1px solid rgba(255,255,255,0.3)",
                        }}
                    >
                        {(Object.keys(layers) as LayerType[]).map((layerKey) => (
                            <div
                                key={layerKey}
                                onClick={() => {
                                    setActiveLayer(layerKey);
                                    setLayerPopupOpen(false);
                                }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: 8,
                                    borderRadius: 12,
                                    border:
                                        activeLayer === layerKey
                                            ? "2px solid #1E90FF"
                                            : "1px solid rgba(0,0,0,0.15)",
                                    cursor: "pointer",
                                    background: activeLayer === layerKey ? "rgba(30,144,255,0.15)" : "transparent",
                                    transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    if (activeLayer !== layerKey) {
                                        e.currentTarget.style.background = "rgba(30,144,255,0.08)";
                                        e.currentTarget.style.transform = "translateX(4px)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeLayer !== layerKey) {
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.style.transform = "translateX(0)";
                                    }
                                }}
                            >
                                <div
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 8,
                                        overflow: "hidden",
                                        border: "1px solid rgba(0,0,0,0.1)",
                                        background: 
                                            layerKey === "standard" 
                                                ? "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)" 
                                                : layerKey === "topo" 
                                                    ? "linear-gradient(135deg, #d4a574 0%, #a8805f 100%)" 
                                                    : "linear-gradient(135deg, #2d4a2b 0%, #4a7c59 100%)",
                                    }}
                                    aria-label={`Preview ${layers[layerKey].label}`}
                                />
                                <div style={{ flex: 1, fontWeight: 500 }}>{layers[layerKey].label}</div>
                                {activeLayer === layerKey && <div style={{ color: "#1E90FF", fontSize: 20 }}>✔</div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>



            {/* SpotForm modal */}
            <Modal
                isOpen={spotFormOpen}
                onRequestClose={() => setSpotFormOpen(false)}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.4)",
                        zIndex: 2000,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    },
                    content: {
                        position: "static", // remove default inset
                        inset: "auto",
                        transform: "none",
                        padding: 0,
                        border: "none",
                        background: "none",
                        overflow: "visible",
                    },
                }}
            >
                <SpotForm
                    initialSpot={contextMenuData ?
                            {latitude : contextMenuData.lat, longitude: contextMenuData.lng} : undefined}
                    onSubmit={handleSpotSave}
                />
            </Modal>


            {/* TerrainPointForm modal */}
            <Modal
                isOpen={terrainFormOpen}
                onRequestClose={() => setTerrainFormOpen(false)}
                style={{
                    overlay: { backgroundColor: "rgba(0,0,0,0.4)", zIndex: 2000, display: "flex", justifyContent: "center", alignItems: "center" },
                    content: {
                        position: "static",
                        inset: "auto",
                        transform: "none",
                        padding: 0,
                        border: "none",
                        background: "none",
                        overflow: "visible",
                    },
                }}
            >
                <TerrainPointForm
                    initialData={
                        contextMenuData
                            ? { latitude: contextMenuData.lat, longitude: contextMenuData.lng }
                            : undefined
                    }
                    spots={spots}
                    onSubmit={handleTerrainSubmit}
                    onCancel={() => setTerrainFormOpen(false)}
                />
            </Modal>

        </div>
    );
};

export default MapView;
