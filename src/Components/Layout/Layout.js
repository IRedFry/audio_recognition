import React from "react";
import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Layout as LayoutAnt, Menu, Divider, Button } from "antd";
import logo from "../../Images/Logos/logo3.png";
import accIcon from "../../Images/Icons/accIcon.png";
const { Header, Content } = LayoutAnt;

const items = [
  {
    label: <Link to={"/Artists"}> Artists </Link>,
    key: "/Artists",
  },
  {
    label: <Divider type="vertical" />,
    key: "1|",
  },
  {
    label: <Link to={"/Songs"}> Songs </Link>,
    key: "/Songs",
  },
  {
    label: <Divider type="vertical" />,
    key: "2|",
  },
  {
    label: <Link to={"/Albums"}> Albums </Link>,
    key: "/Albums",
  },
];

const Layout = ({user}) => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Получаем путь текущей страницы
    const path = location.pathname;

    // Обновляем выбранный пункт меню на основе пути страницы
    setSelectedKeys([path]);
  }, [location]);

  return (
    <LayoutAnt>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          width: "100%",
          height: "5vh",
        }}
      >
        <div
          className="companyName"
          style={{
            height: "64px",
            color: "white",
            float: "left",
            padding: "0px 32px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div>
            <img
              src={logo}
              style={{
                width: "48px",
                height: "48px",
                padding: "5px",
                float: "left",
              }}
            ></img>
          </div>

          <Link to={"/"}>
            {" "}
            <h1 className="brandName">BOLT</h1>{" "}
          </Link>
        </div>
          <Menu
            theme="dark"
            mode="horizontal"
            items={items}
            selectedKeys={selectedKeys}
          />
          <Link to={"/Login"}>
            <div className="userName">
              {user.isAuthenticated ? <div >{user.userName}</div> : (<div>Guest</div>)}
              <Button className="accoutnButton"><img src={accIcon}></img></Button>
            </div>
          </Link>

      </Header>

      <Content className="site-layout">
        <Outlet />
      </Content>
    </LayoutAnt>
  );
};

export default Layout;
