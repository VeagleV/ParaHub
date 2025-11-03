import axios from 'axios';
import type { Spot } from '../types/Spot';

const api = axios.create({ baseURL: '/api' });

export const getAllSpots = async (): Promise<Spot[]> =>
    (await api.get('/spots')).data;

export const createSpot = async (spot: Spot): Promise<Spot> =>
    (await api.post('/spots', spot)).data;

export const getSpotById = async (id: number): Promise<Spot> =>
    (await api.get(`/spots/${id}`)).data;
