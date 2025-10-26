import { useState } from "react";
import { formMode } from "../../interfaces/interfaces";
import "./Auth.css";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

const Auth = () => {
  const [mode, setMode] = useState<formMode>(formMode.login);

  return (
    <div className="login-container">
      {mode === formMode.login && <LoginForm setMode={setMode} />}
      {mode === formMode.register && <RegisterForm setMode={setMode} />}
      <div className="login-image-container"></div>
    </div>
  );
};

export default Auth;
