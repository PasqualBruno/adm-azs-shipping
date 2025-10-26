import { LockIcon, UserIcon } from "@phosphor-icons/react";
import { Button, Flex, Form, Image, Input, Typography } from "antd";
import { useState } from "react";
import Logo from "../../assets/logoandtext.svg";
import { formMode } from "../../interfaces/interfaces";
import { COLORS } from "../../utils/colots";
import "./Login.css";

const RegisterForm = () => {
  <Form layout="vertical" className="login-form">
    <Flex className="login-logo" align="center" justify="center">
      <Image height={120} width={120} src={Logo} />
    </Flex>

    <Typography.Title level={1}>Cadastrar</Typography.Title>

    <Form.Item label="Usuario">
      <Input
        prefix={<UserIcon size={16} color={COLORS.formIcons} />}
        type="text"
        placeholder="Digite seu Usuario"
      />
    </Form.Item>
    <Form.Item label="Senha">
      <Input
        prefix={<LockIcon size={16} color={COLORS.formIcons} />}
        type="password"
        placeholder="Digite sua senha"
      />
    </Form.Item>
    <Button className="primary-button" type="primary">
      Cadastrar
    </Button>
  </Form>;
};

const LoginForm = () => {
  return (
    <Form layout="vertical" className="login-form ">
      <Flex className="login-logo" align="center" justify="center">
        <Image height={120} width={120} src={Logo} />
      </Flex>
      <Typography.Title level={1}>Entrar</Typography.Title>

      <Form.Item label="Usuario">
        <Input
          prefix={<UserIcon size={16} color={COLORS.formIcons} />}
          type="text"
          placeholder="Digite seu Usuario"
        />
      </Form.Item>
      <Form.Item label="Senha">
        <Input
          prefix={<LockIcon size={16} color={COLORS.formIcons} />}
          type="password"
          placeholder="Digite sua senha"
        />
      </Form.Item>
      <Button className="primary-button" type="primary">
        Entrar
      </Button>
      <p className=" text-center pt-2">
        Ainda não tem uma conta?{" "}
        <span className="text-[#ee2143] cursor-pointer">Cadastra-se</span>
      </p>
    </Form>
  );
};

const Login = () => {
  const [mode, setMode] = useState<formMode>(formMode.login);

  return (
    <div className="login-container">
      {mode === formMode.login && <LoginForm />}
      {mode === formMode.register && <RegisterForm />}
      <div className="login-image-container"></div>
    </div>
  );
};

export default Login;
