import axios, { type AxiosInstance } from "axios";
import { getToken } from "../utils/tokenStorage";

export class BaseRepository {
  protected api: AxiosInstance;

  constructor() {
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    if (!baseURL) {
      console.error(
        "Erro: VITE_API_BASE_URL não está definida no arquivo .env"
      );
    }

    this.api = axios.create({ baseURL });

    this.api.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }
}
