import type { ICompanyCreateDTO } from "../interfaces/DTOs/DTOs";
import type { ICompany, IMessageOnlyResponse } from "../interfaces/interfaces";
import type { ICompanyResponse } from "../interfaces/Responses/Responses";
import { BaseRepository } from "./BaseRepository";

class CompaniesRepository extends BaseRepository {
  async getCompanies(archived: boolean = false) {
    return await this.api.get<ICompanyResponse[]>("/companies", {
      params: { archived },
    });
  }

  async deleteCompany(id: string) {
    return await this.api.delete<IMessageOnlyResponse>(`/companies/${id}`);
  }

  async updateCompany(id: string, data: Partial<ICompanyResponse>) {
    return await this.api.put<ICompany>(`/companies/${id}`, data);
  }

  async create(data: ICompanyCreateDTO) {
    return await this.api.post<IMessageOnlyResponse>("/companies", data);
  }

  async archiveCompany(id: string) {
    return await this.api.put<IMessageOnlyResponse>(`/companies/${id}/archive`);
  }
}

export default new CompaniesRepository();
