import type { IUserRegisterDTO } from "../interfaces/DTOs/DTOs";
import type { ILoginResponse } from "../interfaces/Responses/Responses";
import { BaseRepository } from "./BaseRepository";

class AuthRepository extends BaseRepository {
  async login(userName: string, password: string) {
    return await this.api.post<ILoginResponse>("/login", {
      userName,
      password,
    });
  }

  async register(user: IUserRegisterDTO) {
    return await this.api.post<{ message: string }>("/register", user);
  }

  async logout() {
    return await this.api.post("/logout");
  }

  async getUser() {
    return await this.api.get("/user");
  }
}

export default new AuthRepository();
