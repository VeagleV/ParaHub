import axios from "axios";
import type {User} from "../types/auth";

export const getMe = (token: string) =>
    axios.get<User>("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` }
    });