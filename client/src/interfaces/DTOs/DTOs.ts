import type { estadoFrete } from "../interfaces";

export interface IUserRegisterDTO {
  userName: string;
  name: string;
  password: string;
}

export interface IUserLoginDTO {
  userName: string;
  password: string;
}

export interface ICompanyCreateDTO {
  name: string;
  image: string;
  peso: boolean;
  volume: boolean;
  tipoCarga: boolean;
  origem: boolean;
  destino: boolean;
  distancia: boolean;
  archived: boolean;
}

export interface IShippingCreateDTO {
  company: string;
  estado: estadoFrete;
  peso: number;
  volume: number;
  origem: string;
  destino: string;
  distancia: number;
  tipoCarga: string;
}
