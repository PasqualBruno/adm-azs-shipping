import type { IShippingCreateDTO } from "../interfaces/DTOs/DTOs";
import type {
  IMessageOnlyResponse,
  IPaginate,
  IPaginateOptions,
} from "../interfaces/interfaces";
import type { IShippingResponse } from "../interfaces/Responses/Responses";
import { BaseRepository } from "./BaseRepository";

class ShippingRepository extends BaseRepository {
  async create(data: Partial<IShippingCreateDTO>) {
    return await this.api.post(`/shipping`, data);
  }

  async fetchShipping({ page = 1, limit = 10, search = "" }: IPaginateOptions) {
    return await this.api.get<IPaginate<IShippingResponse>>(`/shipping`, {
      params: { page, limit, search },
    });
  }

  async update(id: string, data: Partial<IShippingCreateDTO>) {
    return await this.api.put<IShippingResponse>(`/shipping/${id}`, data);
  }

  async remove(id: string) {
    return await this.api.delete<IMessageOnlyResponse>(`/shipping/${id}`);
  }
}

export default new ShippingRepository();
