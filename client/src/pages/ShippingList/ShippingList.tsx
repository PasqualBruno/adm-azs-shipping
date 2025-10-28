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
  type TableProps,
} from "antd";
import { useEffect, useState } from "react";

import type { IShippingCreateDTO } from "../../interfaces/DTOs/DTOs";
import type { IShippingResponse } from "../../interfaces/Responses/Responses";

import ShippingEditForm from "./components/ShippingEditForm/ShippingEditForm";
import ShippingForm from "./components/ShippingForm/ShippingForm";
import useShipping from "./hooks/useShipping";
import useShippingColumns from "./hooks/useShippingColumns";

const ShippingList = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [selectedShipping, setSelectedShipping] =
    useState<IShippingResponse | null>(null);

  const [createForm] = Form.useForm<IShippingCreateDTO>();
  const [editForm] = Form.useForm<IShippingCreateDTO>();

  const {
    shippings,
    fetchShipping,
    loadingFetch,
    create,
    edit,
    loadingAction,
    remove,
  } = useShipping();

  const handleEditClick = (record: IShippingResponse) => {
    setSelectedShipping(record);
    setIsEditModalOpen(true);
  };

  const { columns, confirmationModal } = useShippingColumns({
    remove,
    loadingAction,
    onEditClick: handleEditClick,
  });

  useEffect(() => {
    fetchShipping({ search: searchText, page: 1 });
  }, [searchText, fetchShipping]);

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    editForm.resetFields();
    setSelectedShipping(null);
  };

  const handleTableChange: TableProps<IShippingResponse>["onChange"] = (
    pagination
  ) => {
    fetchShipping({
      page: pagination.current,
      limit: pagination.pageSize,
      search: searchText,
    });
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
          form={createForm as FormInstance}
          onSuccess={handleCloseCreateModal}
          create={create}
          loading={loadingAction}
        />
      </Modal>

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
        destroyOnClose
      >
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

      <Table
        loading={loadingFetch}
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={shippings.data}
        onChange={handleTableChange}
        pagination={{
          current: shippings.page,
          pageSize: shippings.limit,
          total: shippings.total,
        }}
        locale={{
          emptyText: (
            <div>
              <Image width={300} preview={false} src="/src/assets/truck.svg" />
              <p>Nenhum frete cadastrado</p>
            </div>
          ),
        }}
      />

      {confirmationModal}
    </div>
  );
};

export default ShippingList;
