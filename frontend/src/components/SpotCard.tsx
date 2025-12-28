import React from 'react';
import type { Spot } from '../types/Spot';
import type { TerrainPoint } from '../types/TerrainPoint';

interface SpotCardProps {
    spot: Spot;
    onAddTerrainPoint: (spot: Spot) => void;
}

const SpotCard: React.FC<SpotCardProps> = ({ spot, onAddTerrainPoint }) => {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '20px',
            padding: '20px',
            color: '#000000',
            maxWidth: '320px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>{spot.name}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 15 }}>
                <p style={{ margin: 0, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Elevation:</strong> <span>{spot.elevation} m</span>
                </p>
                <p style={{ margin: 0, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Winds:</strong> <span>{spot.suitableWinds || '—'}</span>
                </p>
                <p style={{ margin: 0, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <strong>XC difficulty:</strong> <span>{spot.xcDifficulty || '—'}</span>
                </p>
                <p style={{ margin: 0, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Learning:</strong> <span>{spot.learningDifficulty || '—'}</span>
                </p>
                <p style={{ margin: 0, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Accessibility:</strong> <span>{spot.accessibility || '—'}</span>
                </p>
                <p style={{ margin: 0, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Popularity:</strong> <span>{spot.popularity || '—'}</span>
                </p>
            </div>
            
            {spot.description && (
                <p style={{ 
                    margin: '0 0 15px 0', 
                    fontSize: 14, 
                    fontStyle: 'italic',
                    color: '#333',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.3)',
                    borderRadius: 10,
                }}>{spot.description}</p>
            )}
            
            <h4 style={{ margin: '15px 0 10px 0', fontSize: 16, fontWeight: 600 }}>Terrain Points:</h4>
            <ul style={{ 
                maxHeight: '120px', 
                overflowY: 'auto',
                margin: '0 0 15px 0',
                padding: '0 0 0 20px',
                listStyle: 'none',
            }}>
                {spot.terrainPoints?.map((tp: TerrainPoint, idx) => (
                    <li key={idx} style={{
                        padding: '6px 10px',
                        margin: '4px 0',
                        background: 'rgba(30,144,255,0.1)',
                        borderRadius: 8,
                        fontSize: 13,
                        borderLeft: '3px solid rgba(30,144,255,0.6)',
                    }}>
                        <strong>{tp.name}</strong> ({tp.type})<br/>
                        <span style={{ fontSize: 12, opacity: 0.8 }}>
                            [{tp.latitude.toFixed(4)}, {tp.longitude.toFixed(4)}]
                        </span>
                    </li>
                )) || <li style={{ fontSize: 14, opacity: 0.6 }}>Нет точек</li>}
            </ul>

            <button
                onClick={() => onAddTerrainPoint(spot)}
                style={{
                    width: '100%',
                    padding: '10px 15px',
                    borderRadius: '12px',
                    background: 'rgba(30,144,255,0.6)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 15,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(30,144,255,0.3)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(30,144,255,0.8)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(30,144,255,0.5)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(30,144,255,0.6)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,144,255,0.3)';
                }}
            >
                Добавить точку
            </button>
        </div>
    );
};

export default SpotCard;
