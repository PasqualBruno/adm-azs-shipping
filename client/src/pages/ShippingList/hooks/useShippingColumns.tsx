import { PencilSimpleLineIcon, TrashIcon } from "@phosphor-icons/react";
import { Avatar, Button, Flex, Modal, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";

import { estadoFrete } from "../../../interfaces/interfaces";
import type {
  ICompanyResponse,
  IShippingResponse,
} from "../../../interfaces/Responses/Responses";
import { COLORS } from "../../../utils/colots";

const useShippingColumns = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const estadoColors: Record<estadoFrete, { bg: string; color: string }> = {
    [estadoFrete.PENDENTE]: { bg: "#FFF7E6", color: "#FAAD14" },
    [estadoFrete.CANCELADO]: { bg: "#FFF1F0", color: "#FF4D4F" },
    [estadoFrete.ENVIADO]: { bg: "#E6FFFB", color: "#13C2C2" },
    [estadoFrete.ENTREGUE]: { bg: "#F6FFED", color: "#52C41A" },
    [estadoFrete.APROVADO]: { bg: "#E6F7FF", color: "#1890FF" },
    [estadoFrete.REPROVADO]: { bg: "#FFF1F0", color: "#FF4D4F" },
  };

  const renderValue = (
    value: any,
    unit?: string,
    isNumber: boolean = false
  ) => {
    if (value === null || value === undefined || value === false) {
      return <div style={{ textAlign: "center" }}>-</div>;
    }
    if (isNumber) {
      return (
        <div style={{ textAlign: "center" }}>
          {value.toLocaleString("pt-BR")}
          {unit}
        </div>
      );
    }
    return (
      <div style={{ textAlign: "center" }}>
        {value}
        {unit}
      </div>
    );
  };

  const columns: ColumnsType<IShippingResponse> = [
    {
      title: "Código",
      dataIndex: "_id",
      key: "_id",
      width: 100,
      render: (id: string) =>
        renderValue(
          id ? `COD${id.substring(id.length - 3).toUpperCase()}` : null
        ),
    },
    {
      title: "Empresa",
      dataIndex: "company",
      key: "company",
      width: 300,
      render: (company: ICompanyResponse) =>
        company ? (
          <Flex align="center" gap={4}>
            <Avatar src={company.image} />
            <span>{company.name}</span>
          </Flex>
        ) : (
          renderValue(null)
        ),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      width: 150,
      render: (estado: estadoFrete) => {
        if (!estado) return renderValue(null);
        const colors = estadoColors[estado];
        return (
          <Tag
            style={{
              backgroundColor: colors.bg,
              color: colors.color,
              width: 120,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            {estado}
          </Tag>
        );
      },
    },
    {
      title: "Peso",
      dataIndex: "peso",
      key: "peso",
      width: 130,
      render: (peso: number) => renderValue(peso, " kg", true),
    },
    {
      title: "Volume",
      dataIndex: "volume",
      key: "volume",
      width: 130,
      render: (volume: number) => renderValue(volume, " m³", true),
    },
    {
      title: "Distância",
      dataIndex: "distancia",
      key: "distancia",
      width: 130,
      render: (distancia: number) => renderValue(distancia, " km", true),
    },
    {
      title: "Tipo de Carga",
      dataIndex: "tipoCarga",
      key: "tipoCarga",
      width: 180,
      ellipsis: true,
      render: (value: string) => renderValue(value),
    },
    {
      title: "Origem",
      dataIndex: "origem",
      key: "origem",
      width: 280,
      ellipsis: true,
      render: (value: string) => renderValue(value),
    },
    {
      title: "Destino",
      dataIndex: "destino",
      key: "destino",
      width: 280,
      ellipsis: true,
      render: (value: string) => renderValue(value),
    },
    {
      title: "Ações",
      width: 140,
      fixed: "right",
      key: "acoes",
      render: () => (
        <Flex justify="center" gap={4}>
          <Tooltip title="Editar">
            <Button type="text">
              <PencilSimpleLineIcon size={20} color={COLORS.primary} />
            </Button>
          </Tooltip>
          <Tooltip title="Remover">
            <Button type="text">
              <TrashIcon size={20} color={COLORS.primary} />
            </Button>
          </Tooltip>
          <Modal open={modalOpen} title="Tem certeza"></Modal>
        </Flex>
      ),
    },
  ];

  return { columns };
};

export default useShippingColumns;
