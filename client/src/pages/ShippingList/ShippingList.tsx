import { PlusIcon } from "@phosphor-icons/react";
import { Button, Flex, Image, Input, Modal, Table } from "antd";
import { useState } from "react";
import { formMode } from "../../interfaces/interfaces";
import { mockData } from "../CompaniesList/mockData";
import useShippingColumns from "./hooks/useShippingColumns";

const ShippingList = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<formMode>(formMode.create);
  const [searchText, setSearchText] = useState("");
  const { columns } = useShippingColumns();

  const filteredData = mockData.filter((item) =>
    item.company.name.toLowerCase().includes(searchText.toLowerCase())
  );

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
        title="Adicionar Frete"
        onCancel={() => setOpen(false)}
        open={open}
      ></Modal>

      <Table
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={filteredData}
        locale={{
          emptyText: (
            <div>
              <Image width={300} preview={false} src="/src/assets/truck.svg" />
              <p>Nenhum frete cadastrado</p>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default ShippingList;
