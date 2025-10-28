import { PlusIcon } from "@phosphor-icons/react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { ICompanyCreateDTO } from "../../interfaces/DTOs/DTOs";
import { formMode } from "../../interfaces/interfaces";
import type { ICompanyResponse } from "../../interfaces/Responses/Responses";
import "./CompaniesList.css";
import useCompanies from "./hooks/useCompanies";
import useCompaniesListColumns from "./hooks/useCompaniesListColumns";

const CompaniesList = () => {
  const [selectedCompany, setSelectedCompany] = useState<ICompanyResponse>();
  const { create, update, loading, companies, fetchCompanies } = useCompanies();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<formMode>(formMode.create);
  const [form] = Form.useForm<ICompanyCreateDTO>();

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function handleCancel() {
    form.resetFields();
    setOpen(false);
  }

  async function handleOk() {
    form.submit();
  }

  async function handleEditClick(company: ICompanyResponse) {
    setSelectedCompany(company);
    setMode(formMode.edit);
    setOpen(true);
    form.resetFields();
    form.setFieldsValue(company);
  }

  async function handleSubmit(values: ICompanyCreateDTO) {
    const normalizedValues = {
      ...values,
      peso: values.peso ?? false,
      volume: values.volume ?? false,
      origem: values.origem ?? false,
      destino: values.destino ?? false,
      distancia: values.distancia ?? false,
      tipoCarga: values.tipoCarga ?? false,
    };

    const { peso, volume, origem, destino, distancia, tipoCarga } =
      normalizedValues;

    const someSelected =
      peso || volume || origem || destino || distancia || tipoCarga;

    if (!someSelected) {
      toast.error("Selecione pelo menos um dado desejado para o frete.");
      return;
    }

    try {
      if (mode === formMode.create) {
        await create(normalizedValues);
        form.resetFields();
        setOpen(false);
        setMode(formMode.create);
        setSelectedCompany(undefined);
        toast.success("Empresa criada com sucesso!");
      } else {
        if (!selectedCompany?._id) return;
        await update(selectedCompany?._id, normalizedValues);
        form.resetFields();
        setOpen(false);
        setMode(formMode.create);
        setSelectedCompany(undefined);
        toast.success("Empresa editada com sucesso!");
      }
      await fetchCompanies();
    } catch (error: any) {
      console.error("Erro ao criar empresa:", error);
      toast.error(error?.response?.data?.message || "Erro ao criar empresa.");
    }
  }

  const { columns } = useCompaniesListColumns({
    handleEditClick,
    fetchCompanies,
  });

  return (
    <div className="companies-container">
      <div className="companies-header">
        <h1 className="companies-title">EMPRESAS</h1>
        <Button
          type="primary"
          className="add-company-button"
          onClick={() => {
            setMode(formMode.create);
            setOpen(true);
          }}
        >
          <PlusIcon size={20} /> Adicionar Empresa
        </Button>
      </div>

      <Table
        loading={loading}
        scroll={{ x: 1000 }}
        dataSource={companies}
        columns={columns}
        rowKey="_id"
        locale={{
          emptyText: (
            <div style={{ textAlign: "center", marginTop: 20, padding: 20 }}>
              <Image
                width={120}
                preview={false}
                src="/src/assets/no-data-table.svg"
              />
              <p>Nenhuma empresa cadastrada</p>
            </div>
          ),
        }}
      />

      <Modal
        confirmLoading={loading}
        title={mode === formMode.create ? "Criar Empresa" : "Editar Empresa"}
        okText={mode === formMode.create ? "Adicionar" : "Salvar"}
        cancelText="Cancelar"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Nome da Empresa"
            name="name"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input placeholder="Nome da Empresa" />
          </Form.Item>

          <Form.Item
            label="Imagem da empresa"
            name="image"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input placeholder="Cole a URL da imagem" />
          </Form.Item>

          <div>
            <p>Dados desejados para o frete</p>
            <Row>
              <Col xs={12} md={8} lg={8}>
                <Form.Item name="peso" valuePropName="checked">
                  <Checkbox>Peso</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={12} md={8} lg={8}>
                <Form.Item name="volume" valuePropName="checked">
                  <Checkbox>Volume</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={12} md={8} lg={8}>
                <Form.Item name="origem" valuePropName="checked">
                  <Checkbox>Origem</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={12} md={8} lg={8}>
                <Form.Item name="destino" valuePropName="checked">
                  <Checkbox>Destino</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={12} md={8} lg={8}>
                <Form.Item name="distancia" valuePropName="checked">
                  <Checkbox>Distância</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={12} md={8} lg={8}>
                <Form.Item name="tipoCarga" valuePropName="checked">
                  <Checkbox>Tipo de carga</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CompaniesList;
