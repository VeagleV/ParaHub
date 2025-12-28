import React from 'react';
import type { Spot } from '../types/Spot';
import type { TerrainPoint } from '../types/TerrainPoint';

interface SpotCardProps {
    spot: Spot;
    onAddTerrainPoint: (spot: Spot) => void;
    isShowingRelatedPoints?: boolean;
    onToggleRelatedPoints?: (spot: Spot) => void;
}

// Парсинг строки ветров "С, СВ, В" в массив
const parseWindDirections = (winds: string): string[] => {
    return winds.split(',').map(w => w.trim()).filter(w => w.length > 0);
};

// Цвет в зависимости от направления
const getWindColor = (direction: string): string => {
    const colors: Record<string, string> = {
        'С': '#3498db',   // Синий
        'СВ': '#5dade2',
        'В': '#48c9b0',   // Бирюзовый
        'ЮВ': '#58d68d',
        'Ю': '#f39c12',   // Оранжевый
        'ЮЗ': '#e67e22',
        'З': '#e74c3c',   // Красный
        'СЗ': '#9b59b6',  // Фиолетовый
    };
    return colors[direction.toUpperCase()] || '#95a5a6';
};

// Иконка-стрелка для направления
const getWindIcon = (direction: string): string => {
    const icons: Record<string, string> = {
        'С': '↑',
        'СВ': '↗',
        'В': '→',
        'ЮВ': '↘',
        'Ю': '↓',
        'ЮЗ': '↙',
        'З': '←',
        'СЗ': '↖',
    };
    return icons[direction.toUpperCase()] || '○';
};

const SpotCard: React.FC<SpotCardProps> = ({ spot, onAddTerrainPoint, isShowingRelatedPoints, onToggleRelatedPoints }) => {
    console.log('SpotCard spot data:', spot);
    
    return (
        <div style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '12px',
            padding: '15px',
            color: '#000000',
            maxWidth: '300px',
        }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>{spot.name}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <p style={{ margin: 0, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Elevation:</strong> <span>{spot.elevation ?? 'не указано'} m</span>
                </p>
                <p style={{ margin: 0, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <strong>XC difficulty:</strong> <span>{spot.xcDifficulty ?? 'не указано'}</span>
                </p>
                <p style={{ margin: 0, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Learning:</strong> <span>{spot.learningDifficulty ?? 'не указано'}</span>
                </p>
                <p style={{ margin: 0, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Accessibility:</strong> <span>{spot.accessibility || 'не указано'}</span>
                </p>
                <p style={{ margin: 0, fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Popularity:</strong> <span>{spot.popularity || 'не указано'}</span>
                </p>
            </div>

            {/* Wind directions visualization */}
            {spot.suitableWinds && (
                <div style={{ marginBottom: 12 }}>
                    <strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>Подходящие ветра:</strong>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 6,
                    }}>
                        {parseWindDirections(spot.suitableWinds).map((wind) => (
                            <div
                                key={wind}
                                style={{
                                    padding: '6px 12px',
                                    background: getWindColor(wind),
                                    borderRadius: 8,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                            >
                                {getWindIcon(wind)}
                                <span>{wind}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {spot.description && (
                <p style={{ 
                    margin: '0 0 12px 0', 
                    fontSize: 13, 
                    fontStyle: 'italic',
                    color: '#555',
                    padding: '8px',
                    background: 'rgba(0,0,0,0.03)',
                    borderRadius: 8,
                }}>{spot.description}</p>
            )}
            
            {onToggleRelatedPoints && spot.terrainPoints && spot.terrainPoints.length > 0 && (
                <button
                    onClick={() => onToggleRelatedPoints(spot)}
                    style={{
                        width: '100%',
                        padding: '10px 15px',
                        borderRadius: '12px',
                        background: isShowingRelatedPoints ? 'rgba(255,87,34,0.6)' : 'rgba(46,213,115,0.6)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: 15,
                        transition: 'all 0.3s ease',
                        marginBottom: '8px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = isShowingRelatedPoints ? 'rgba(255,87,34,0.8)' : 'rgba(46,213,115,0.8)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = isShowingRelatedPoints ? '0 6px 16px rgba(255,87,34,0.5)' : '0 6px 16px rgba(46,213,115,0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = isShowingRelatedPoints ? 'rgba(255,87,34,0.6)' : 'rgba(46,213,115,0.6)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    {isShowingRelatedPoints 
                        ? `🔴 Скрыть связанные точки (${spot.terrainPoints.length})`
                        : `🗺️ Показать связанные точки (${spot.terrainPoints.length})`
                    }
                </button>
            )}

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
