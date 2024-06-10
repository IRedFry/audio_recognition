import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input } from "antd";

const Login = ({ user, setUser }) => {
  const [errorMessages, setErrorMessages] = useState([]);
  const navigate = useNavigate();

  const login = async (formValues) => {
    console.log("Success: ", formValues);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formValues.username,
        password: formValues.password,
        rememberme: formValues.remember,
      }),
    };

    return await fetch("/api/Account/Login", requestOptions)
      .then((response) => {
        response.status === 200 &&
          setUser({
            isAuthenticated: true,
            userName: "",
            userRole: "",
          });
        return response.json();
      })
      .then(
        (data) => {
          console.log("Data: ", data);
          if (
            typeof data != "undefined" &&
            typeof data.userName != "undefined"
          ) {
            setUser({
              isAuthenticated: true,
              userName: data.userName,
              userRole: data.userRole,
            });
            console.log(data.userName);
            navigate("/");
          }
          typeof data != "undefined" &&
            typeof data.error != "undefined" &&
            setErrorMessages(data.error);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  const renderErrorMessage = () => {
    errorMessages.map((index, error) => <div key={index}>{error}</div>);
  };

  const logOff = async () => {

    const requestOptions = {
      method: "POST",
    };
    return await fetch("/api/Account/Logoff", requestOptions).then(
      (response) => {
        response.status === 200 &&
          setUser({ isAuthenticated: false, userName: "" });
        response.status === 401 ? navigate("/Login") : navigate("/");
      }
    );
  };

  return (
    <>
      {user.isAuthenticated ? (
        <div className="logoutWrapper">
          <Button id="loginBtn" onClick={logOff} className="loginButton">
            {" "}
            Logout{" "}
          </Button>
        </div>
      ) : (
        <>
          <Form
            className="loginForm"
            onFinish={login}
            name="basic"
            initialValues={{ remember: true }}
            onFinishFailed={renderErrorMessage}
            autoComplete="off"
          >
            <Form.Item
              label="UserName"
              name="username"
              rules={[{ required: true, message: "Введите имя пользователя" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Введите пароль" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox id="remember">Remember me</Checkbox>
              {renderErrorMessage()}
            </Form.Item>
            <div>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button id="loginBtn" htmlType="submit" className="loginButton">
                  {" "}
                  Login{" "}
                </Button>
              </Form.Item>
            </div>
          </Form>
        </>
      )}
    </>
  );
};

export default Login;

/*

<form onSubmit={login}>
            <label> Пользователь </label>
            <input type="text" name="emailField" placeholder="Логин" />
            <br />
            <label> Пароль </label>
            <input type="text" name="passwordField" placeholder="Пароль" />
            <br />
            <button type="submit">Войти</button>
          </form>

*/
