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
