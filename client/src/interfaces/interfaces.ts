export enum formMode {
  login = "login",
  register = "register",
}

export enum formMode {
  create = "create",
  edit = "edit",
}

export interface IUSerBasic {
  id: number;
  name: string;
}

export enum statusEntrega {
  PREPARACAO = "PREPARACAO",
  EM_TRANSITO = "EM_TRANSITO",
  ATRASADA = "ATRASADA",
  CANCELADA = "CANCELADA",
  ENTREGUE = "ENTREGUE",
}

export interface ICompany {
  id: number;
  name: string;
  image: string;
  peso: boolean;
  volume: boolean;
  tipoCarga: boolean;
  origem: boolean;
  destino: boolean;
  distancia: boolean;
}

export interface IMessageOnlyResponse {
  message: string;
}

export enum estadoFrete {
  PENDENTE = "Pendente",
  CANCELADO = "Cancelado",
  ENVIADO = "Enviado",
  ENTREGUE = "Entregue",
  APROVADO = "Aprovado",
  REPROVADO = "Reprovado",
}

export interface IPaginate<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IPaginateOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IShippingFormValues {
  peso?: number;
  volume?: number;
  origem?: string;
  destino?: string;
  distancia?: number;
  tipoCarga?: string;
}
