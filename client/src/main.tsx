import { App as AntdApp, ConfigProvider } from "antd";
import "antd/dist/reset.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";

const theme = {
  token: {
    controlHeight: 40,
    color: "#1d1d1d",
    colorPrimary: "#ee2143",
    Component: {
      colorBgTextHover: "#ee2143",
    },
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>
);
