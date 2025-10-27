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
}
