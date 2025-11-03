import axios from "axios";
import type { TerrainPoint } from "../types/TerrainPoint";

const api = axios.create({ baseURL: "/api" });

export const getTerrainPointsBySpot = async (spotId: number): Promise<TerrainPoint[]> =>
    (await api.get(`/terrain_points/spotID/${spotId}`)).data;

export const createTerrainPoint = async (
    tp: TerrainPoint,
    spotId?: number
): Promise<TerrainPoint> => {
    if (spotId) {
        return (await api.post(`/terrain_points/spotID/${spotId}`, tp)).data;
    }
    return (await api.post(`/terrain_points`, tp)).data;
};
