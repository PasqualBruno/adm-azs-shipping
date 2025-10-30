import { estadoFrete } from "../interfaces/interfaces";

export const COLORS = {
  primary: "#ee2143",
  formIcons: "#9c9c9c",
  bgMenu: "#130021",
};

export const estadoColors: Record<estadoFrete, { bg: string; color: string }> =
  {
    [estadoFrete.PENDENTE]: { bg: "#FFF7E6", color: "#FAAD14" },
    [estadoFrete.CANCELADO]: { bg: "#FFF1F0", color: "#FF4D4F" },
    [estadoFrete.ENVIADO]: { bg: "#E6FFFB", color: "#13C2C2" },
    [estadoFrete.ENTREGUE]: { bg: "#F6FFED", color: "#52C41A" },
  };
