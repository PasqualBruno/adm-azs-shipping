import { PencilSimpleLineIcon, TrashIcon } from "@phosphor-icons/react";
import { Avatar, Button, Flex, Modal, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { toast } from "react-toastify";
import { estadoFrete } from "../../../interfaces/interfaces";
import type {
  ICompanyResponse,
  IShippingResponse,
} from "../../../interfaces/Responses/Responses";
import { COLORS, estadoColors } from "../../../utils/colots";

type UseShippingColumnsProps = {
  remove: (id: string) => Promise<void>;
  loadingAction: boolean;
  onEditClick: (record: IShippingResponse) => void;
};

const useShippingColumns = ({
  remove,
  loadingAction,
  onEditClick,
}: UseShippingColumnsProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShipping, setSelectedShipping] =
    useState<IShippingResponse | null>(null);

  const handleOpenModal = (record: IShippingResponse) => {
    setSelectedShipping(record);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedShipping(null);
    setModalOpen(false);
  };

  async function handleRemove() {
    if (!selectedShipping) return;

    try {
      await remove(selectedShipping._id);
      handleCloseModal();
      toast.success("Frete removido com sucesso!");
    } catch (error: any) {
      console.error("Erro ao remover frete:", error);
      toast.error(error.response?.data?.message || "Erro ao remover frete.");
    }
  }

  const columns: ColumnsType<IShippingResponse> = [
    {
      title: "Código",
      dataIndex: "_id",
      key: "_id",
      width: 130,
      render: (id: string, record) =>
        renderValue(
          <Tag style={{ fontWeight: 500 }}>
            {id
              ? `COD-${record._id ? `${record._id.substring(0, 8)}` : null}`
              : null}
          </Tag>
        ),
    },
    {
      title: "Empresa",
      dataIndex: "company",
      key: "company",
      width: 300,
      ellipsis: true,
      render: (company: ICompanyResponse) =>
        company ? (
          <Flex align="center" gap={16}>
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
      render: (_, record: IShippingResponse) => (
        <Flex justify="center" gap={4}>
          <Tooltip title="Editar">
            <Button type="text" onClick={() => onEditClick(record)}>
              <PencilSimpleLineIcon size={20} color={COLORS.primary} />
            </Button>
          </Tooltip>
          <Tooltip title="Remover">
            <Button type="text" onClick={() => handleOpenModal(record)}>
              <TrashIcon size={20} color={COLORS.primary} />
            </Button>
          </Tooltip>
        </Flex>
      ),
    },
  ];

  const confirmationModal = (
    <Modal
      confirmLoading={loadingAction}
      onCancel={handleCloseModal}
      open={modalOpen}
      title="Tem certeza?"
      okText="Remover"
      cancelText="Cancelar"
      onOk={handleRemove}
    >
      {selectedShipping && (
        <Flex vertical>
          <span>
            Deseja remover o frete de código{" "}
            <span className="modal-identifier-text">
              {`COD${selectedShipping._id
                .substring(selectedShipping._id.length - 3)
                .toUpperCase()}`}
            </span>
            ?
          </span>
          <span className=" opacity-50">
            Essa ação irá remover permanentemente o frete.
          </span>
        </Flex>
      )}
    </Modal>
  );

  return { columns, confirmationModal };
};

export default useShippingColumns;

export const renderValue = (
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
