import {
  ArchiveIcon,
  PencilSimpleLineIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import {
  Image as AntdImage,
  Button,
  Checkbox,
  Flex,
  Modal,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { AxiosResponse } from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import type { ICompanyResponse } from "../../../interfaces/Responses/Responses";
import { COLORS } from "../../../utils/colots";
import useCompanies from "./useCompanies";

type useCompaniesListColumnsProps = {
  handleEditClick: (Company: ICompanyResponse) => void;
  fetchCompanies(): Promise<AxiosResponse<ICompanyResponse[], any, {}>>;
};

const useCompaniesListColumns = ({
  handleEditClick,
  fetchCompanies,
}: useCompaniesListColumnsProps) => {
  const { remove, update } = useCompanies();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMode, setModalMode] = useState<"remove" | "archive">("remove");
  const [modalText, setModalText] = useState<React.ReactNode>();

  async function handleArchiveCompany(id: string) {
    setLoading(true);
    try {
      await update(id, { archived: true });
      await fetchCompanies();
      toast.success("Empresa arquivada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao arquivar empresa:", err);
      toast.error(err?.response?.data?.message || "Erro ao arquivar empresa.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  async function handleRemoveCompany(id: string) {
    setLoading(true);
    try {
      await remove(id);
      await fetchCompanies();
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
      render: (_: any, record: ICompanyResponse) => {
        return (
          <div className="company-cell">
            {record.image && (
              <AntdImage
                height={40}
                width={40}
                fallback={"https://linkconsolidai.com.br/assets/imgs/empty.jpg"}
                src={record.image}
                alt={"Imagem da empresa " + record.name}
                className="company-logo"
                preview={false}
              />
            )}
            <span className="company-name-table">{record.name}</span>
          </div>
        );
      },
    },

    {
      title: "Peso",
      width: 80,
      dataIndex: "peso",
      key: "peso",
      render: (value: boolean) => <Checkbox checked={value} disabled />,
    },
    {
      title: "Volume",
      width: 80,
      dataIndex: "volume",
      key: "volume",
      render: (value: boolean) => <Checkbox checked={value} disabled />,
    },

    {
      title: "Origem",
      width: 80,
      dataIndex: "origem",
      key: "origem",
      render: (value: boolean) => <Checkbox checked={value} disabled />,
    },
    {
      title: "Destino",
      width: 80,
      dataIndex: "destino",
      key: "destino",
      render: (value: boolean) => <Checkbox checked={value} disabled />,
    },
    {
      title: "Distância",
      width: 90,
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
      width: 130,
      fixed: "right",
      key: "acoes",
      render: (_: any, record: ICompanyResponse) => (
        <Flex>
          <Tooltip title="Editar">
            <Button
              type="text"
              className="companies-action-button"
              onClick={() => handleEditClick(record)}
            >
              <PencilSimpleLineIcon color={COLORS.primary} size={20} />
            </Button>
          </Tooltip>
          <Tooltip title="Arquivar">
            <Button
              type="text"
              className="companies-action-button"
              onClick={() => {
                setModalMode("archive");
                setModalText(
                  <Flex vertical>
                    <span>
                      Deseja arquivar a empresa{" "}
                      <span className="company-name-modal">
                        {record.name} ?{" "}
                      </span>
                    </span>
                    <span className=" opacity-50">
                      Essa ação irá desativar a empresa e a mesma não poderá ser
                      utilizada em fretes.
                    </span>
                  </Flex>
                );
                setOpen(true);
              }}
            >
              <ArchiveIcon color={COLORS.primary} size={20} />
            </Button>
          </Tooltip>
          <Tooltip title="Excluir">
            <Button
              type="text"
              className="companies-action-button"
              onClick={() => {
                setModalMode("remove");
                setModalText(
                  <Flex vertical>
                    <span>
                      Deseja remover a empresa{" "}
                      <span className="company-name-modal">
                        {record.name} ?{" "}
                      </span>
                    </span>
                    <span className=" opacity-50">
                      Essa ação apenas poderá ser feita se não houver fretes
                      cadastrados para ela.
                    </span>
                  </Flex>
                );
                setOpen(true);
              }}
            >
              <TrashIcon color={COLORS.primary} size={20} />
            </Button>
          </Tooltip>
          <Modal
            confirmLoading={loading}
            okText={modalMode === "archive" ? "Arquivar" : "Remover"}
            cancelText="Cancelar"
            open={open}
            title="Tem certeza"
            onOk={() => {
              if (modalMode === "archive") handleArchiveCompany(record._id!);
              else if (modalMode === "remove") handleRemoveCompany(record._id!);
            }}
            onCancel={() => setOpen(false)}
            footer={(_, { OkBtn, CancelBtn }) => (
              <>
                <CancelBtn />
                <OkBtn />
              </>
            )}
          >
            {modalText}
          </Modal>
        </Flex>
      ),
    },
  ];

  return { columns };
};

export default useCompaniesListColumns;
