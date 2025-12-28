import React, { useState, useEffect } from 'react';
import { PerformanceTracker } from '../hooks/usePerformance';

interface PerformanceEntry {
    name: string;
    duration: number;
    timestamp: number;
    type: 'render' | 'api' | 'function';
}

export const PerformanceMonitor: React.FC = () => {
    const [entries, setEntries] = useState<PerformanceEntry[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const tracker = PerformanceTracker.getInstance();
        const unsubscribe = tracker.subscribe(setEntries);
        setEntries(tracker.getEntries());
        return unsubscribe;
    }, []);

    // Group by name and calculate averages
    const aggregated = entries.reduce((acc, entry) => {
        if (!acc[entry.name]) {
            acc[entry.name] = { count: 0, total: 0, type: entry.type, lastDuration: 0 };
        }
        acc[entry.name].count++;
        acc[entry.name].total += entry.duration;
        acc[entry.name].lastDuration = entry.duration;
        return acc;
    }, {} as Record<string, { count: number; total: number; type: string; lastDuration: number }>);

    const sortedEntries = Object.entries(aggregated)
        .map(([name, data]) => ({
            name,
            avgDuration: data.total / data.count,
            lastDuration: data.lastDuration,
            count: data.count,
            type: data.type
        }))
        .sort((a, b) => b.avgDuration - a.avgDuration)
        .slice(0, 10);

    const getColor = (duration: number): string => {
        if (duration < 50) return '#2ecc71'; // Green
        if (duration < 100) return '#f39c12'; // Orange
        return '#e74c3c'; // Red
    };

    const getEmoji = (duration: number): string => {
        if (duration < 50) return '✅';
        if (duration < 100) return '⚠️';
        return '🔴';
    };

    const getTypeIcon = (type: string): string => {
        switch (type) {
            case 'render': return '🎨';
            case 'api': return '🌐';
            case 'function': return '⚙️';
            default: return '📊';
        }
    };

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                style={{
                    position: 'fixed',
                    bottom: 20,
                    left: 20,
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    background: 'rgba(30,144,255,0.8)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                    fontSize: 24,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                    zIndex: 9999,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                }}
                title="Open Performance Monitor"
            >
                📊
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            width: 350,
            maxHeight: 500,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 15,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            color: '#fff',
            fontFamily: 'system-ui, sans-serif',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Header */}
            <div style={{
                padding: '15px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>📊</span>
                    <span style={{ fontWeight: 600, fontSize: 16 }}>Performance Monitor</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => PerformanceTracker.getInstance().clear()}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 6,
                            color: '#fff',
                            padding: '4px 8px',
                            fontSize: 12,
                            cursor: 'pointer',
                        }}
                        title="Clear logs"
                    >
                        🗑️
                    </button>
                    <button
                        onClick={() => setIsExpanded(false)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            fontSize: 18,
                            cursor: 'pointer',
                        }}
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Entries */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
                {sortedEntries.length === 0 ? (
                    <div style={{ padding: 20, textAlign: 'center', opacity: 0.6 }}>
                        No performance data yet
                    </div>
                ) : (
                    sortedEntries.map(entry => (
                        <div
                            key={entry.name}
                            style={{
                                padding: '10px 12px',
                                marginBottom: 8,
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: 10,
                                borderLeft: `4px solid ${getColor(entry.lastDuration)}`,
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 4,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span>{getTypeIcon(entry.type)}</span>
                                    <span style={{ fontSize: 13, fontWeight: 500 }}>{entry.name}</span>
                                </div>
                                <span style={{ fontSize: 18 }}>{getEmoji(entry.lastDuration)}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: 12,
                                opacity: 0.8,
                            }}>
                                <span>Avg: {entry.avgDuration.toFixed(1)}ms</span>
                                <span>Last: {entry.lastDuration.toFixed(1)}ms</span>
                                <span>Count: {entry.count}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
