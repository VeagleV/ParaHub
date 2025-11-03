import type {TerrainPoint} from './TerrainPoint';

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

    terrainPoints?: TerrainPoint[];
}
