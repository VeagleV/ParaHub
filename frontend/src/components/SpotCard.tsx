import React from 'react';
import type { Spot } from '../types/Spot';

interface SpotCardProps {
    spot: Spot;
    onAddTerrainPoint: (spot: Spot) => void;
    isShowingRelatedPoints?:  boolean;
    onToggleRelatedPoints?: (spot: Spot) => void;
}

// Парсинг строки ветров "В 2-8, СВ 2-8" в массив объектов
const parseWinds = (windString: string | undefined): { direction: string; speed: string }[] => {
    if (! windString) return [];

    // Разделяем по запятой
    const parts = windString. split(',').map(s => s.trim());

    return parts.map(part => {
        // Паттерн: "В 2-8" или "СВ 2-8 м/с"
        const match = part.match(/^([А-Я]+)\s*(\d+-\d+)/i);

        if (match) {
            return {
                direction: match[1],
                speed: match[2]
            };
        }

        // Если просто направление без скорости:  "В"
        return {
            direction:  part,
            speed: ''
        };
    }).filter(w => w.direction); // Убираем пустые
};

// Стрелки для направлений
const WIND_ARROWS: Record<string, string> = {
    'С': '↑',
    'СВ': '↗',
    'В': '→',
    'ЮВ': '↘',
    'Ю': '↓',
    'ЮЗ': '↙',
    'З': '←',
    'СЗ': '↖',
    'N': '↑',
    'NE': '↗',
    'E': '→',
    'SE': '↘',
    'S': '↓',
    'SW': '↙',
    'W': '←',
    'NW': '↖'
};

// Бейджи сложности
const DIFFICULTY_CONFIG = {
    1: { label: 'Новичок', color: '#2ecc71', emoji: '🟢' },
    2: { label: 'Лёгкий', color: '#3498db', emoji:  '🔵' },
    3: { label: 'Средний', color: '#f39c12', emoji: '🟡' },
    4: { label: 'Сложный', color: '#e67e22', emoji: '🟠' },
    5: { label: 'Эксперт', color: '#e74c3c', emoji: '🔴' }
} as const;

const DifficultyBadge:  React.FC<{ level: number | undefined }> = ({ level }) => {
    if (!level) return <span style={{ fontSize: 13, opacity: 0.6 }}>—</span>;

    const config = DIFFICULTY_CONFIG[level as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG[3];

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 10px',
            borderRadius: 10,
            background: config.color,
            color: 'white',
            fontSize: 12,
            fontWeight: 600
        }}>
            <span style={{ fontSize: 14 }}>{config.emoji}</span>
            <span>{config.label}</span>
        </div>
    );
};

const SpotCard: React.FC<SpotCardProps> = ({ spot, onAddTerrainPoint, isShowingRelatedPoints, onToggleRelatedPoints }) => {
    console.log('SpotCard spot data:', spot);

    const winds = parseWinds(spot.suitableWinds);

    return (
        <div style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '12px',
            padding: '15px',
            color: '#000000',
            maxWidth: '320px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>
                {spot.name}
            </h3>

            {/* Координаты и высота */}
            <p style={{ margin: '0 0 8px 0', fontSize: 13, opacity: 0.7 }}>
                📍 {spot.latitude. toFixed(4)}, {spot.longitude.toFixed(4)}
            </p>
            <p style={{ margin:  '0 0 8px 0', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Высота:</strong>
                <span style={{ fontWeight: 600, color: '#3498db' }}>{spot.elevation} м</span>
            </p>

            {/* XC Сложность */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong style={{ fontSize: 14 }}>XC сложность: </strong>
                <DifficultyBadge level={spot. xcDifficulty} />
            </div>

            {/* Обучение */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong style={{ fontSize: 14 }}>Обучение: </strong>
                <DifficultyBadge level={spot.learningDifficulty} />
            </div>

            {/* Ветра */}
            <div style={{ marginBottom: 8 }}>
                <strong style={{ fontSize: 14, display: 'block', marginBottom: 6 }}>🌬️ Ветра:</strong>
                {winds. length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {winds.map((wind, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '4px 10px',
                                    borderRadius: 12,
                                    background: '#2ecc71',
                                    color: 'white',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                <span style={{ fontSize: 14 }}>
                                    {WIND_ARROWS[wind. direction. toUpperCase()] || '🌬️'}
                                </span>
                                <span>{wind.direction}</span>
                                {wind.speed && (
                                    <span style={{ opacity: 0.9, fontSize: 11 }}>
                                        {wind.speed} м/с
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <span style={{ fontSize: 13, opacity: 0.6, fontStyle: 'italic' }}>не указано</span>
                )}
            </div>

            {/* Доступность */}
            {spot.accessibility && (
                <p style={{ margin: '0 0 8px 0', fontSize:  14, display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Доступность:</strong>
                    <span>{spot.accessibility}</span>
                </p>
            )}

            {/* Популярность */}
            {spot.popularity && (
                <p style={{ margin: '0 0 8px 0', fontSize:  14, display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Популярность:</strong>
                    <span>{spot.popularity}</span>
                </p>
            )}

            {/* Описание */}
            {spot.description && (
                <p style={{
                    margin: '12px 0',
                    fontSize: 13,
                    fontStyle: 'italic',
                    color: '#555',
                    padding: '8px',
                    background: 'rgba(0,0,0,0.03)',
                    borderRadius: 8,
                }}>{spot.description}</p>
            )}

            {/* Кнопка показа связанных точек */}
            {onToggleRelatedPoints && spot.terrainPoints && spot.terrainPoints.length > 0 && (
                <button
                    onClick={() => onToggleRelatedPoints(spot)}
                    style={{
                        width: '100%',
                        padding: '10px 15px',
                        borderRadius: '10px',
                        background: isShowingRelatedPoints ? 'rgba(255,87,34,0.1)' : 'rgba(46,213,115,0.1)',
                        border: `2px solid ${isShowingRelatedPoints ? '#ff5722' : '#2ed573'}`,
                        color: isShowingRelatedPoints ? '#ff5722' : '#2ed573',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: 14,
                        transition: 'all 0.3s ease',
                        marginBottom: '8px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = isShowingRelatedPoints ? 'rgba(255,87,34,0.2)' : 'rgba(46,213,115,0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style. background = isShowingRelatedPoints ? 'rgba(255,87,34,0.1)' : 'rgba(46,213,115,0.1)';
                    }}
                >
                    {isShowingRelatedPoints
                        ? `👁️ Скрыть точки (${spot.terrainPoints.length})`
                        : `🗺️ Показать точки (${spot.terrainPoints. length})`
                    }
                </button>
            )}

            {/* Кнопка добавления точки */}
            <button
                onClick={() => onAddTerrainPoint(spot)}
                style={{
                    width: '100%',
                    padding: '10px 15px',
                    borderRadius: '10px',
                    background:  'linear-gradient(135deg, rgba(30,144,255,0.8) 0%, rgba(0,191,255,0.8) 100%)',
                    border:  'none',
                    color:  'white',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 14,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(30,144,255,0.3)',
                }}
                onMouseEnter={(e) => {
                    e. currentTarget.style.background = 'linear-gradient(135deg, rgba(30,144,255,1) 0%, rgba(0,191,255,1) 100%)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(30,144,255,0.5)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30,144,255,0.8) 0%, rgba(0,191,255,0.8) 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,144,255,0.3)';
                }}
            >
                ➕ Добавить точку рельефа
            </button>
        </div>
    );
};

export default SpotCard;