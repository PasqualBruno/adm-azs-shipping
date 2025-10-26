export interface ILoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
  };
}
