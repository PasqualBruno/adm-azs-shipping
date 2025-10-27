import { PencilSimpleLineIcon, TrashIcon } from "@phosphor-icons/react";
import { Button, Checkbox, Flex, Image, Modal, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { toast } from "react-toastify";
import { COLORS } from "../../../utils/colots";
import useCompanies from "./useCompanies";

const useCompaniesListColumns = () => {
  const { remove, update } = useCompanies();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRemoveCompany(id: string) {
    setLoading(true);
    try {
      await remove(id);
      toast.success("Empresa removida com sucesso!");
    } catch (err: any) {
      console.error("Erro ao remover empresa:", err);
      toast.error(err?.response?.data?.message || "Erro ao remover empresa.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  const columns: ColumnsType<any> = [
    {
      title: "Código",
      width: 80,
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (_: any, record: any) => (
        <div className="company-cell">
          <Image
            height={40}
            width={40}
            src={record.image}
            alt={record.name}
            className="company-logo"
            preview={false}
          />
          <span className="company-name-table">{record.name}</span>
        </div>
      ),
    },

    {
      title: "Peso",
      width: 70,
      dataIndex: "peso",
      key: "peso",
      render: (value: boolean) => <Checkbox checked={value} disabled />,
    },
    {
      title: "Volume",
      width: 70,
      dataIndex: "volume",
      key: "volume",
      render: (value: boolean) => <Checkbox checked={value} disabled />,
    },

    {
      title: "Origem",
      width: 70,
      dataIndex: "origem",
      key: "origem",
      render: (value: boolean) => <Checkbox checked={value} disabled />,
    },
    {
      title: "Destino",
      width: 70,
      dataIndex: "destino",
      key: "destino",
      render: (value: boolean) => <Checkbox checked={value} disabled />,
    },
    {
      title: "Distância",
      width: 80,
      dataIndex: "distancia",
      key: "distancia",
      render: (value: boolean) => <Checkbox checked={value} disabled />,
    },
    {
      title: "Tipo de Carga",
      width: 120,
      dataIndex: "tipoCarga",
      key: "tipoCarga",
      render: (value: boolean) => <Checkbox checked={value} disabled />,
    },
    {
      title: "Ações",
      width: 100,
      fixed: "right",
      key: "acoes",
      render: (_: any, record: any) => (
        <Flex>
          <Tooltip title="Editar">
            <Button type="text" className="companies-action-button">
              <PencilSimpleLineIcon color={COLORS.primary} size={16} />
            </Button>
          </Tooltip>
          <Tooltip title="Excluir">
            <Button
              type="text"
              className="companies-action-button"
              onClick={() => setOpen(true)}
            >
              <TrashIcon color={COLORS.primary} size={16} />
            </Button>
          </Tooltip>
          <Modal
            confirmLoading={loading}
            okText="Deletar"
            cancelText="Cancelar"
            open={open}
            title="Tem certeza"
            onOk={() => handleRemoveCompany(record.id)}
            onCancel={() => setOpen(false)}
            footer={(_, { OkBtn, CancelBtn }) => (
              <>
                <CancelBtn />
                <OkBtn />
              </>
            )}
          >
            <p>
              Você realmente deseja excluir a empresa{" "}
              <span className="company-name-modal">{record.name}</span> ?
            </p>
          </Modal>
        </Flex>
      ),
    },
  ];

  return { columns };
};

export default useCompaniesListColumns;
