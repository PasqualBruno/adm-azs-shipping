import { Avatar, Flex, Form, Input, Select, type FormInstance } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import type {
  ICompanyResponse,
  IShippingResponse,
} from "../../../../interfaces/Responses/Responses";

import type { IShippingCreateDTO } from "../../../../interfaces/DTOs/DTOs";
import { estadoFrete } from "../../../../interfaces/interfaces";
import { estadoColors } from "../../../../utils/colots";
import useCompanies from "../../../CompaniesList/hooks/useCompanies";
import "../../ShippingList.css";

type ShippingEditFormProps = {
  form: FormInstance;
  edit: (id: string, data: Partial<IShippingCreateDTO>) => Promise<any>;
  onSuccess: () => void;
  loading: boolean;
  selectedShipping: IShippingResponse;
};

const ShippingEditForm = ({
  form,
  onSuccess,
  edit,

  selectedShipping,
}: ShippingEditFormProps) => {
  const { companies, fetchCompanies } = useCompanies();

  const [selectedCompany, setSelectedCompany] = useState<
    ICompanyResponse | undefined
  >(companies.find((c) => c._id === selectedShipping.company._id));

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedShipping) {
      form.setFieldsValue({
        ...selectedShipping,
        company: selectedShipping.company._id,
      });
      setSelectedCompany(selectedShipping.company);
    }
  }, [selectedShipping, form]);

  async function handleSubmit(values: IShippingResponse) {
    const companyToUse =
      selectedCompany || companies.find((c) => c._id === values._id);

    if (!companyToUse) {
      toast.error("Empresa selecionada é inválida.");
      return;
    }

    const payload: Partial<IShippingCreateDTO> = {
      company: companyToUse._id,

      estado: values.estado || selectedShipping.estado,
    };

    if (companyToUse.peso) payload.peso = values.peso;
    if (companyToUse.volume) payload.volume = values.volume;
    if (companyToUse.origem) payload.origem = values.origem;
    if (companyToUse.destino) payload.destino = values.destino;
    if (companyToUse.distancia) payload.distancia = values.distancia;
    if (companyToUse.tipoCarga) payload.tipoCarga = values.tipoCarga;

    try {
      await edit(selectedShipping._id, payload);
      toast.success("Frete atualizado com sucesso!");
      onSuccess();
    } catch (err: any) {
      console.error("Erro ao atualizar frete:", err);
      toast.error(err?.response?.data?.message || "Erro ao atualizar frete.");
    }
  }

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

      <Form.Item
        name="estado"
        label="Estado"
        rules={[{ required: true, message: "Selecione o estado do frete" }]}
      >
        <Select placeholder="Selecione o estado">
          {Object.values(estadoFrete).map((estado) => {
            const colors = estadoColors[estado];
            return (
              <Select.Option key={estado} value={estado}>
                <span
                  className="select-state-tag"
                  style={{
                    color: colors.color,
                  }}
                >
                  {estado}
                </span>
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      {selectedCompany?.peso && (
        <Form.Item name="peso" label="Peso (kg)" required>
          <Input type="number" placeholder="Digite o peso" />
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
        <Form.Item name="distancia" label="Distância (km)" required>
          <Input type="number" placeholder="Digite a distância" />
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

export default ShippingEditForm;
