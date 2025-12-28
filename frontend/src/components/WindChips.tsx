import React from 'react';
import type { Wind } from '../types/Spot';

const WIND_ARROWS: Record<string, string> = {
    'N': '↑', 'NE': '↗', 'E': '→', 'SE': '↘',
    'S': '↓', 'SW': '↙', 'W': '←', 'NW': '↖'
};

interface WindChipsProps {
    winds: Wind[];
}

const WindChips: React.FC<WindChipsProps> = ({ winds }) => {
    if (!winds || winds.length === 0) {
        return <span style={{ fontSize: 13, opacity: 0.6 }}>Не указано</span>;
    }
    
    return (
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
                        fontWeight: 600
                    }}
                >
                    <span style={{ fontSize: 14 }}>{WIND_ARROWS[wind.direction]}</span>
                    <span>{wind.direction}</span>
                    <span style={{ opacity: 0.8, fontSize: 11 }}>
                        {wind.minSpeed}-{wind.maxSpeed}м/с
                    </span>
                </div>
            ))}
        </div>
    );
};

export default WindChips;
export { WIND_ARROWS };
