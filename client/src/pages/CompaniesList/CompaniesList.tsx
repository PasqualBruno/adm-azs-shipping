import { PlusIcon } from "@phosphor-icons/react";
import { Button, Table } from "antd";
import "./CompaniesList.css";
import useCompaniesListColumns from "./hooks/useCompaniesListColumns";
import { dataSource } from "./mockData";

const CompaniesList = () => {
  const { columns } = useCompaniesListColumns();

  return (
    <div className="companies-container">
      <div className="companies-header">
        <h1 className="companies-title">EMPRESAS</h1>
        <Button type="primary" className="add-company-button">
          <PlusIcon size={20} /> Adicionar Empresa
        </Button>
      </div>
      <Table
        scroll={{ x: 1000 }}
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};

export default CompaniesList;
