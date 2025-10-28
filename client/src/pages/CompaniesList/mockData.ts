import { estadoFrete } from "../../interfaces/interfaces";
import type { IShippingResponse } from "../../interfaces/Responses/Responses";

export const mockData: IShippingResponse[] = [
  {
    _id: "67f89ab123cde456",
    company: {
      _id: "comp1",
      name: "Transportadora Rápida",
      image:
        "https://img.freepik.com/vetores-gratis/modelo-de-logotipo-colorido-da-empresa-com-slogan_23-2148802643.jpg?semt=ais_hybrid&w=740&q=80",
      // ...outros campos de company
      peso: true,
      volume: true,
      tipoCarga: true,
      origem: true,
      destino: true,
      distancia: true,
      archived: false,
    },
    estado: estadoFrete.ENVIADO,
    peso: 1500,
    volume: 12.5,
    origem: "Rua das Flores, 123, São Paulo - SP",
    destino: "Av. das Nações, 456, Rio de Janeiro - RJ",
    distancia: 450,
    tipoCarga: "Frágil",
  },
  {
    _id: "a9b87cd654efg321",
    company: {
      _id: "comp2",
      name: "Logística Total",
      image:
        "https://marketplace.canva.com/EAFtCLwiJmY/1/0/1600w/canva-amarelo-e-preto-minimalista-seguran%C3%A7a-residencial-logo-sxDdso97-hk.jpg",
      // ...outros campos de company
      peso: true,
      volume: true,
      tipoCarga: true,
      origem: true,
      destino: true,
      distancia: true,
      archived: false,
    },
    estado: estadoFrete.APROVADO,
    peso: 5000,
    volume: 30.0,
    origem: "Praça da Sé, 789, São Paulo - SP",
    destino: "Setor Industrial, 101, Brasília - DF",
    distancia: 1020,
    tipoCarga: "Eletrônicos",
  },
];
