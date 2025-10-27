import type { ICompanyCreateDTO } from "../interfaces/DTOs/DTOs";
import type { ICompany, IMessageOnlyResponse } from "../interfaces/interfaces";
import { BaseRepository } from "./BaseRepository";

class CompaniesRepository extends BaseRepository {
  async getCompanies() {
    return await this.api.get<ICompany[]>("/companies");
  }

  async deleteCompany(id: string) {
    return await this.api.delete<IMessageOnlyResponse>(`/companies/${id}`);
  }

  async updateCompany(id: string, data: any) {
    return await this.api.put<ICompany>(`/companies/${id}`, data);
  }

  async create(data: ICompanyCreateDTO) {
    return await this.api.post<IMessageOnlyResponse>("/companies", data);
  }
}

export default new CompaniesRepository();
