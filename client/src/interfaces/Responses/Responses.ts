import type { estadoFrete } from "../interfaces";

export interface ILoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
  };
}

export interface ICompanyResponse {
  _id: string;
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

export interface IShippingResponse {
  _id: string;
  company: ICompanyResponse;
  estado: estadoFrete;
  peso: number;
  volume: number;
  origem: string;
  destino: string;
  distancia: number;
  tipoCarga: string;
}
