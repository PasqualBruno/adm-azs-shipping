import {
  ArrowFatLeftIcon,
  ArrowFatRightIcon,
  BuildingIcon,
  ListIcon,
  SignOutIcon,
  TruckIcon,
} from "@phosphor-icons/react";
import { Button, Drawer, Layout, Menu } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../Auth/hooks/useAuth";
import "./FreteSystem.css";

const { Sider, Content } = Layout;

const FretesSystem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      key: "/sistema/empresas",
      icon: <BuildingIcon size={20} />,
      label: "Empresas",
    },
    { key: "/sistema/fretes", icon: <TruckIcon size={20} />, label: "Fretes" },
    {
      key: "logout",
      icon: <SignOutIcon size={20} />,
      label: "Sair",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
      if (window.innerWidth > 600) setDrawerVisible(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout className="fretes-layout">
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={220}
          className="fretes-sider"
          trigger={null}
        >
          <div className="fretes-sider-top">
            {
              <div className={`fretes-logo ${collapsed ? "opacity-0" : ""}`}>
                FRETES
              </div>
            }
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={(e) => {
                if (e.key === "logout") {
                  handleLogout();
                } else {
                  navigate(e.key);
                }
              }}
              items={menuItems}
              className="custom-menu"
            />
          </div>

          <div className="fretes-sider-bottom">
            <div className="logout-btn" onClick={handleLogout}>
              <SignOutIcon size={20} />
              {!collapsed && <span>Sair</span>}
            </div>
            <div
              className="collapse-btn"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ArrowFatRightIcon color="white" size={20} />
              ) : (
                <ArrowFatLeftIcon color="white" size={20} />
              )}
            </div>
          </div>
        </Sider>
      )}

      {/* Botão e Drawer mobile */}
      {isMobile && (
        <>
          <Button
            className="mobile-menu-button"
            icon={<ListIcon size={24} />}
            onClick={() => setDrawerVisible(true)}
          />
          <Drawer
            placement="left"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            bodyStyle={{ padding: 0, backgroundColor: "var(--bgMenu)" }}
            headerStyle={{ backgroundColor: "var(--bgMenu)", color: "white" }}
          >
            <div className="fretes-logo drawer-logo">FRETES</div>
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={(e) => {
                if (e.key === "logout") {
                  handleLogout();
                } else {
                  navigate(e.key);
                  setDrawerVisible(false);
                }
              }}
              items={menuItems}
              className="custom-menu"
            />
            <div className="logout-btn drawer-logout" onClick={handleLogout}>
              <SignOutIcon size={20} /> <span>Sair</span>
            </div>
          </Drawer>
        </>
      )}

      <Layout>
        <Content className={`fretes-content ${isMobile && "mobile-content"}`}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default FretesSystem;
