import axios from "axios";
import { User } from "../types/auth";

export const getMe = (token: string) =>
    axios.get<User>("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` }
    });