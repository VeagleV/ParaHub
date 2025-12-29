import axios from "axios";
import type {AuthResponse} from "../types/auth";

export const register = (payload: {username: string, email: string, password: string}) =>
    axios.post("/api/auth/register", payload);

export const verifyEmail = (email: string, code: string) =>
    axios.post("/api/auth/verify", { email, code });

export const loginRequest2FA = (email: string, password: string) =>
    axios.post("/api/auth/request-2fa", { email, password });

export const login2FA = (email: string, code: string) =>
    axios.post<AuthResponse>("/api/auth/login-2fa", { email, code });