import { PlusIcon } from "@phosphor-icons/react";
import {
  Button,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Table,
  type FormInstance,
} from "antd";
import { useEffect, useState } from "react";
// Importações de Tipos
import type { IShippingCreateDTO } from "../../interfaces/DTOs/DTOs";
import type { IShippingResponse } from "../../interfaces/Responses/Responses";
// Importações de Componentes e Hooks

import ShippingEditForm from "./components/ShippingEditForm/ShippingEditForm";
import ShippingForm from "./components/ShippingForm/ShippingForm";
import useShipping from "./hooks/useShipping";
import useShippingColumns from "./hooks/useShippingColumns";

const ShippingList = () => {
  // Estados para os modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [selectedShipping, setSelectedShipping] =
    useState<IShippingResponse | null>(null);

  // Instâncias de formulário separadas
  const [createForm] = Form.useForm<IShippingCreateDTO>();
  const [editForm] = Form.useForm<IShippingCreateDTO>();

  // Hook principal com as ações (assumindo que 'edit' espera Partial<IShippingCreateDTO>)
  const {
    shippings,
    fetchShipping,
    loadingFetch,
    create,
    edit,
    loadingAction,
    remove,
  } = useShipping();

  // Função de callback para o botão de editar (passada para as colunas)
  const handleEditClick = (record: IShippingResponse) => {
    setSelectedShipping(record);
    setIsEditModalOpen(true);
  };

  // Passa as ações para o hook de colunas
  const { columns, confirmationModal } = useShippingColumns({
    remove,
    loadingAction,
    onEditClick: handleEditClick,
  });

  useEffect(() => {
    fetchShipping();
  }, [fetchShipping]);

  // Funções para fechar e limpar cada modal
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    editForm.resetFields();
    setSelectedShipping(null);
  };

  return (
    <div>
      <Flex vertical className="">
        <h1 className="page-title">FRETES</h1>

        <Flex
          className="table-header"
          justify="space-between"
          align="center"
          style={{ marginBottom: 16 }}
        >
          <Input.Search
            placeholder="Pesquisar frete..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />

          <Button
            type="primary"
            className="add-company-button"
            onClick={() => {
              setIsCreateModalOpen(true);
            }}
          >
            <PlusIcon size={20} /> Adicionar Frete
          </Button>
        </Flex>
      </Flex>

      {/* --- Modal de CRIAÇÃO --- */}
      <Modal
        title="Adicionar Frete"
        onCancel={handleCloseCreateModal}
        open={isCreateModalOpen}
        okText="Adicionar"
        cancelText="Cancelar"
        confirmLoading={loadingAction}
        onOk={() => {
          createForm.submit();
        }}
      >
        <ShippingForm
          form={createForm as FormInstance} // Cast para FormInstance genérico se necessário
          onSuccess={handleCloseCreateModal}
          create={create}
          loading={loadingAction}
        />
      </Modal>

      {/* --- Modal de EDIÇÃO --- */}
      <Modal
        title="Atualizar Frete"
        onCancel={handleCloseEditModal}
        open={isEditModalOpen}
        okText="Salvar"
        cancelText="Cancelar"
        confirmLoading={loadingAction}
        onOk={() => {
          editForm.submit();
        }}
        destroyOnClose // Garante que o estado do form é resetado
      >
        {/* Só renderiza o formulário de edição se houver um frete selecionado */}
        {selectedShipping && (
          <ShippingEditForm
            form={editForm as FormInstance}
            onSuccess={handleCloseEditModal}
            edit={edit}
            loading={loadingAction}
            selectedShipping={selectedShipping}
          />
        )}
      </Modal>

      {/* --- Tabela --- */}
      <Table
        loading={loadingFetch}
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={shippings.data}
        locale={{
          emptyText: (
            <div>
              <Image width={300} preview={false} src="/src/assets/truck.svg" />
              <p>Nenhum frete cadastrado</p>
            </div>
          ),
        }}
      />

      {/* --- Modal de Exclusão --- */}
      {confirmationModal}
    </div>
  );
};

export default ShippingList;
