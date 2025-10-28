export enum formMode {
  login = "login",
  register = "register",
}

export enum companyFormMode {
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
