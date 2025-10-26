import { LockIcon, UserIcon } from "@phosphor-icons/react";
import { Button, Flex, Form, Image, Input, Typography } from "antd";
import { formMode } from "../../../interfaces/interfaces";
import { COLORS } from "../../../utils/colots";
import Logo from "/public/logoandtext.svg";

type RegisterFormProps = {
  setMode: (formMode: formMode) => void;
};

const RegisterForm = ({ setMode }: RegisterFormProps) => {
  const handleRegisterSubmit = (values: any) => {
    console.log("Validação passou! Dados do formulário:", values);
  };

  return (
    <Form
      layout="vertical"
      className="login-form"
      onFinish={handleRegisterSubmit}
      autoComplete="off"
    >
      <Flex className="login-logo" align="center" justify="center">
        <Image height={120} width={120} src={Logo} />
      </Flex>

      <Typography.Title level={1}>Cadastrar</Typography.Title>

      <Form.Item
        label="Usuario"
        name="username"
        rules={[{ required: true, message: "O campo Usuario é obrigatorio" }]}
      >
        <Input
          prefix={<UserIcon size={16} color={COLORS.formIcons} />}
          type="text"
          placeholder="Digite seu Usuario"
        />
      </Form.Item>

      <Form.Item
        label="Senha"
        name="password"
        rules={[
          { required: true, message: "A senha é obrigatória!" },
          { min: 6, message: "A senha deve ter no mínimo 6 caracteres!" },
        ]}
      >
        <Input.Password
          prefix={<LockIcon size={16} color={COLORS.formIcons} />}
          placeholder="Digite sua senha"
        />
      </Form.Item>

      <Form.Item
        label="Confirmar Senha"
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Confirme sua senha!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("As senhas não coincidem!"));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockIcon size={16} color={COLORS.formIcons} />}
          placeholder="Confirme sua senha"
        />
      </Form.Item>

      <Button className="primary-button" type="primary" htmlType="submit">
        Cadastrar
      </Button>

      <p className=" text-center pt-2">
        Já possui uma conta?{" "}
        <span
          onClick={() => setMode(formMode.login)}
          className="text-[#ee2143] cursor-pointer"
        >
          Entrar
        </span>
      </p>
    </Form>
  );
};

export default RegisterForm;
