import { LockIcon, UserIcon } from "@phosphor-icons/react";
import { Button, Flex, Form, Image, Input, Typography } from "antd";
import Logo from "../../assets/logoandtext.svg";
import { COLORS } from "../../utils/colots";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-container">
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
          <span className="text-[#ee2143]">Cadastra-se</span>
        </p>
      </Form>
      <div className="login-image-container"></div>
    </div>
  );
};

export default Login;
