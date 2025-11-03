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
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '15px',
            padding: '15px',
            color: '#000000',
            maxWidth: '300px'
        }}>
            <h3>{spot.name}</h3>
            <p>Elevation: {spot.elevation} m</p>
            <p>Winds: {spot.suitableWinds || '—'}</p>
            <p>XC difficulty: {spot.xcDifficulty || '—'}</p>
            <p>Learning difficulty: {spot.learningDifficulty || '—'}</p>
            <p>Accessibility: {spot.accessibility || '—'}</p>
            <p>Popularity: {spot.popularity || '—'}</p>
            <p>{spot.description}</p>
            <h4>Terrain Points:</h4>
            <ul style={{ maxHeight: '100px', overflowY: 'auto' }}>
                {spot.terrainPoints?.map((tp: TerrainPoint, idx) => (
                    <li key={idx}>
                        {tp.name} ({tp.type}) [{tp.latitude.toFixed(4)}, {tp.longitude.toFixed(4)}]
                    </li>
                )) || <li>Нет точек</li>}
            </ul>

            <button
                onClick={() => onAddTerrainPoint(spot)}
                style={{
                    marginTop: '10px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: 'rgba(0,150,255,0.4)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer'
                }}
            >
                Добавить точку
            </button>
        </div>
    );
};

export default SpotCard;
