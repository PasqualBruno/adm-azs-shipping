import { LockIcon, UserIcon } from "@phosphor-icons/react";
import { Button, Flex, Form, Image, Input, Typography } from "antd";
import { formMode } from "../../../interfaces/interfaces";
import { COLORS } from "../../../utils/colots";
import Logo from "/public/logoandtext.svg";

type LoginFormProps = {
  setMode: (formMode: formMode) => void;
};

const LoginForm = ({ setMode }: LoginFormProps) => {
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
