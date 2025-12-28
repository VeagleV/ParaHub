import React from 'react';

const DIFFICULTY_CONFIG = {
    1: { label: 'Новичок', color: '#2ecc71', emoji: '🟢' },
    2: { label: 'Лёгкий', color: '#3498db', emoji: '🔵' },
    3: { label: 'Средний', color: '#f39c12', emoji: '🟡' },
    4: { label: 'Сложный', color: '#e67e22', emoji: '🟠' },
    5: { label: 'Эксперт', color: '#e74c3c', emoji: '🔴' }
} as const;

interface DifficultyBadgeProps {
    level: number;
}

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ level }) => {
    const config = DIFFICULTY_CONFIG[level as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG[3];
    
    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            borderRadius: 12,
            background: config.color,
            color: 'white',
            fontSize: 13,
            fontWeight: 600
        }}>
            <span>{config.emoji}</span>
            <span>{config.label}</span>
        </div>
    );
};

export default DifficultyBadge;
export { DIFFICULTY_CONFIG };
