export interface TerrainPoint {
    id?: number;
    name: string;
    type: string; // e.g. TAKEOFF, LANDING_ZONE, BEACON, OBSTACLE
    latitude: number;
    longitude: number;
    elevation: number;
    description?: string;
}
