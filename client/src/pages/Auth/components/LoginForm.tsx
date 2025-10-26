import { LockIcon, UserIcon } from "@phosphor-icons/react";
import { Button, Flex, Form, Image, Input, Typography } from "antd";
import { toast } from "react-toastify";
import type { IUserLoginDTO } from "../../../interfaces/DTOs/DTOs";
import { formMode } from "../../../interfaces/interfaces";
import { COLORS } from "../../../utils/colots";
import useAuth from "../hooks/useAuth";
import Logo from "/public/logoandtext.svg";

type LoginFormProps = {
  setMode: (formMode: formMode) => void;
};

const LoginForm = ({ setMode }: LoginFormProps) => {
  const { login, loading, isAuthenticated } = useAuth();
  const [form] = Form.useForm<IUserLoginDTO>();

  console.log(isAuthenticated);

  async function handleLoginSubmit(values: IUserLoginDTO) {
    console.log(values);

    try {
      await login(values.userName, values.password);
      form.resetFields();
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      toast.error(error.response?.data?.message || "Falha ao Entrar.");
    }
  }

  return (
    <Form
      onFinish={handleLoginSubmit}
      form={form}
      layout="vertical"
      className="login-form "
    >
      <Flex className="login-logo" align="center" justify="center">
        <Image height={120} width={120} src={Logo} />
      </Flex>
      <Typography.Title level={1}>Entrar</Typography.Title>

      <Form.Item label="Usuario" name="userName">
        <Input
          prefix={<UserIcon size={16} color={COLORS.formIcons} />}
          type="text"
          placeholder="Digite seu Usuario"
        />
      </Form.Item>
      <Form.Item label="Senha" name="password">
        <Input
          prefix={<LockIcon size={16} color={COLORS.formIcons} />}
          type="password"
          placeholder="Digite sua senha"
        />
      </Form.Item>
      <Button
        loading={loading}
        htmlType="submit"
        className="primary-button"
        type="primary"
      >
        Entrar
      </Button>
      <p className=" text-center pt-2">
        Ainda não tem uma conta?{" "}
        <span
          onClick={() => setMode(formMode.register)}
          className="text-[#ee2143] cursor-pointer"
        >
          Cadastra-se
        </span>
      </p>
    </Form>
  );
};

export default LoginForm;
