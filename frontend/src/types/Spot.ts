import type {TerrainPoint} from './TerrainPoint';

export interface Wind {
    id?: number;
    direction: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
    minSpeed: number;
    maxSpeed: number;
}

export interface Spot {
    id?: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    description?: string;

    suitableWinds?: string;
    xcDifficulty?: number;
    learningDifficulty?: number;
    accessibility?: string;
    popularity?: string;

    winds?: Wind[];
    terrainPoints?: TerrainPoint[];
}
