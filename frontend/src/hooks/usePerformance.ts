import { useEffect, useRef } from 'react';

const MAX_PERFORMANCE_ENTRIES = 100;

interface PerformanceEntry {
    name: string;
    duration: number;
    timestamp: number;
    type: 'render' | 'api' | 'function';
}

class PerformanceTracker {
    private static instance: PerformanceTracker;
    private entries: PerformanceEntry[] = [];
    private listeners: Array<(entries: PerformanceEntry[]) => void> = [];

    static getInstance(): PerformanceTracker {
        if (!PerformanceTracker.instance) {
            PerformanceTracker.instance = new PerformanceTracker();
        }
        return PerformanceTracker.instance;
    }

    addEntry(entry: PerformanceEntry) {
        this.entries.push(entry);
        
        // Log to console
        const emoji = entry.duration < 50 ? '✅' : entry.duration < 100 ? '⚠️' : '🔴';
        console.log(`${emoji} [${entry.type}] ${entry.name}: ${entry.duration.toFixed(2)}ms`);
        
        // Notify listeners
        this.listeners.forEach(listener => listener([...this.entries]));
        
        // Keep only the last MAX_PERFORMANCE_ENTRIES entries
        if (this.entries.length > MAX_PERFORMANCE_ENTRIES) {
            this.entries.shift();
        }
    }

    subscribe(listener: (entries: PerformanceEntry[]) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    getEntries(): PerformanceEntry[] {
        return [...this.entries];
    }

    clear() {
        this.entries = [];
        this.listeners.forEach(listener => listener([]));
    }
}

export const usePerformance = (componentName: string, enabled: boolean = true) => {
    const renderCountRef = useRef(0);
    const renderStartRef = useRef(performance.now());

    useEffect(() => {
        if (!enabled) return;

        renderCountRef.current++;
        const renderTime = performance.now() - renderStartRef.current;

        if (renderCountRef.current > 1) { // Skip first render
            PerformanceTracker.getInstance().addEntry({
                name: componentName,
                duration: renderTime,
                timestamp: Date.now(),
                type: 'render'
            });
        }

        renderStartRef.current = performance.now();
    });
};

export const profileAsync = async <T,>(name: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    try {
        const result = await fn();
        const duration = performance.now() - start;
        
        PerformanceTracker.getInstance().addEntry({
            name,
            duration,
            timestamp: Date.now(),
            type: 'api'
        });
        
        return result;
    } catch (error) {
        const duration = performance.now() - start;
        console.error(`❌ [API] ${name} failed after ${duration.toFixed(2)}ms`, error);
        throw error;
    }
};

export const profileFunction = <T,>(name: string, fn: () => T): T => {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    PerformanceTracker.getInstance().addEntry({
        name,
        duration,
        timestamp: Date.now(),
        type: 'function'
    });
    
    return result;
};

export { PerformanceTracker };
