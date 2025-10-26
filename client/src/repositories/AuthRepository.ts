import axios from "axios";
import type { IUserRegisterDTO } from "../interfaces/DTOs/DTOs";
import type { ILoginResponse } from "../interfaces/Responses/Responses";
import { getToken } from "../utils/tokenStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  console.error(
    "Erro: VITE_API_BASE_URL não está definida no seu arquivo .env"
  );
}

const api = axios.create({ baseURL });

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AuthRepository = {
  async login(userName: string, password: string) {
    return await api.post<ILoginResponse>("/login", { userName, password });
  },

  async register(user: IUserRegisterDTO) {
    return await api.post<{ message: string }>("/register", user);
  },

  async logout() {
    return await api.post("/logout");
  },

  async getUser() {
    return await api.get("/user");
  },
};

export default AuthRepository; // Renomeado para seguir convenção
