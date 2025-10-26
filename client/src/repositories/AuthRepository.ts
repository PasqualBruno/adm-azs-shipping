import axios from "axios";
import type { UserDTO } from "../interfaces/DTOs/DTOs";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  console.error(
    "Erro: VITE_API_BASE_URL não está definida no seu arquivo .env"
  );
}

const api = axios.create({ baseURL });

const AuthRepoitory = {
  async login(userName: string, password: string) {
    return api.post("/login", { userName, password });
  },

  async register(user: UserDTO) {
    return api.post("/register", user);
  },
  async logout() {},
  async isLogedIn() {},
  async getUser() {},
};

export default AuthRepoitory;
