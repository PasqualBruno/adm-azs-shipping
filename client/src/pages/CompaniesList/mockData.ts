import type { ICompanyResponse } from "../../interfaces/Responses/Responses";

export const dataSource: ICompanyResponse[] = [
  {
    id: "1",
    name: "Transportadora Rápida S.A.",
    image:
      "https://images-platform.99static.com/Zvf1VhmUTyJojG24r-J60ZGR1H4=/442x2929:922x3409/500x500/top/smart/99designs-contests-attachments/132/132865/attachment_132865641",
    peso: true,
    volume: true,
    tipoCarga: false,
    origem: true,
    destino: true,
    distancia: true,
    archived: false,
  },
  {
    id: "2",
    name: "Logística Veloz Ltda.",
    image:
      "https://img.freepik.com/vetores-gratis/logotipo-abstrato-em-forma-triangular_1043-1.jpg?semt=ais_hybrid&w=740&q=80",
    peso: true,
    volume: false,
    tipoCarga: true,
    origem: true,
    destino: true,
    distancia: false,
    archived: false,
  },
  {
    id: "3",
    name: "Cargas Brasil Express",
    image:
      "https://img.freepik.com/vetores-premium/vector-de-design-de-logotipo-criativo-e-elegante-abstrato-e-minimalista-para-qualquer-empresa-de-marca_1253202-137644.jpg?semt=ais_hybrid&w=740&q=80",
    peso: false,
    volume: true,
    tipoCarga: true,
    origem: true,
    destino: false,
    distancia: true,
    archived: false,
  },
];
