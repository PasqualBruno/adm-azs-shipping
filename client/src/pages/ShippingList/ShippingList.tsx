import { PlusIcon } from "@phosphor-icons/react";
import { Button, Flex, Form, Image, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { formMode } from "../../interfaces/interfaces";
import ShippingForm from "./components/ShippingForm/ShippingForm";
import useShipping from "./hooks/useShipping";
import useShippingColumns from "./hooks/useShippingColumns";

const ShippingList = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<formMode>(formMode.create);
  const [searchText, setSearchText] = useState("");

  const {
    shippings,
    fetchShipping,
    loadingFetch,
    create,
    loadingAction,
    remove,
  } = useShipping();

  const { columns, confirmationModal } = useShippingColumns({
    remove,
    loadingAction,
  });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchShipping();
  }, [fetchShipping]);

  const handleCloseModal = () => {
    setOpen(false);
    form.resetFields();
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
              setMode(formMode.create);
              setOpen(true);
            }}
          >
            <PlusIcon size={20} /> Adicionar Frete
          </Button>
        </Flex>
      </Flex>

      <Modal
        title={mode === formMode.create ? "Adicionar Frete" : "Atualizar frete"}
        onCancel={handleCloseModal}
        open={open}
        okText="Adicionar"
        cancelText="Cancelar"
        confirmLoading={loadingAction}
        onOk={() => {
          form.submit();
        }}
      >
        <ShippingForm
          mode={mode}
          form={form}
          onSuccess={handleCloseModal}
          create={create}
        />
      </Modal>

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

      {confirmationModal}
    </div>
  );
};

export default ShippingList;
