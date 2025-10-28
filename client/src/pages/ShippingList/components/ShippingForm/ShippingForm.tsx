import { Avatar, Flex, Form, Input, Select, type FormInstance } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { IShippingCreateDTO } from "../../../../interfaces/DTOs/DTOs";
import {
  estadoFrete,
  type formMode,
  type IShippingFormValues,
} from "../../../../interfaces/interfaces";
import type { ICompanyResponse } from "../../../../interfaces/Responses/Responses";
import useCompanies from "../../../CompaniesList/hooks/useCompanies";

type ShippingFormProps = {
  mode: formMode;
  form: FormInstance;
  create: (data: Partial<IShippingCreateDTO>) => Promise<any>;
  onSuccess: () => void;
};

const ShippingForm = ({ mode, form, onSuccess, create }: ShippingFormProps) => {
  const { companies, fetchCompanies } = useCompanies();

  const [selectedCompany, setSelectedCompany] = useState<ICompanyResponse>();

  console.log({ selectedCompany });

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function handleSubmit(values: IShippingFormValues) {
    if (!selectedCompany) return;

    const payload: Partial<IShippingCreateDTO> & { companyId: string } = {
      companyId: selectedCompany._id,
    };
    payload.company = selectedCompany._id;
    payload.estado = estadoFrete.PENDENTE;

    if (selectedCompany.peso) payload.peso = values.peso;
    if (selectedCompany.volume) payload.volume = values.volume;
    if (selectedCompany.origem) payload.origem = values.origem;
    if (selectedCompany.destino) payload.destino = values.destino;
    if (selectedCompany.distancia) payload.distancia = values.distancia;
    if (selectedCompany.tipoCarga) payload.tipoCarga = values.tipoCarga;

    try {
      await create(payload);
      form.resetFields();
      toast.success("Frete criado com sucesso!");
      onSuccess();
    } catch (err: any) {
      console.error("Erro ao criar frete:", err);
      toast.error(err?.response?.data?.message || "Erro ao criar frete.");
    }
  }

  console.log({ companies });

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="company"
        rules={[{ required: true, message: "Selecione uma empresa" }]}
        label="Empresa"
        required
      >
        <Select
          onChange={(e) =>
            setSelectedCompany(companies.find((company) => company._id === e))
          }
        >
          {companies.map((company) => (
            <Select.Option key={company._id} value={company._id}>
              <Flex align="center" gap={8}>
                <Avatar size={24} src={company.image} /> {company.name}
              </Flex>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {selectedCompany?.peso && (
        <Form.Item name="peso" label="Peso (kg)" required>
          <Input type="number" placeholder="Digite o pessoo" />
        </Form.Item>
      )}

      {selectedCompany?.volume && (
        <Form.Item name="volume" label="Volume (m3)" required>
          <Input type="number" placeholder="Digite o volume" />
        </Form.Item>
      )}

      {selectedCompany?.origem && (
        <Form.Item name="origem" label="Origem" required>
          <Input type="text" placeholder="Digite a origem" />
        </Form.Item>
      )}

      {selectedCompany?.destino && (
        <Form.Item name="destino" label="Destino" required>
          <Input type="text" placeholder=" Digite o destino" />
        </Form.Item>
      )}

      {selectedCompany?.distancia && (
        <Form.Item name="distancia" label="Distância (km)" required>
          <Input type="number" placeholder="Digite a distância" />
        </Form.Item>
      )}

      {selectedCompany?.tipoCarga && (
        <Form.Item name="tipoCarga" label="Tipo de carga" required>
          <Input type="text" placeholder="Digite o tipo de carga" />
        </Form.Item>
      )}
    </Form>
  );
};

export default ShippingForm;
