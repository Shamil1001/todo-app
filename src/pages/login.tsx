import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import { Card, Space } from "antd";
import { Button, Checkbox, Form, Input, message } from "antd";
import Navbar from "../components/navbar";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const emailRef = useRef();
  const passwordRef = useRef();

  const onFinish = (values: any) => {
    // console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleLogEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleLogPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    console.log(email, password);
    if (email.length == 0 || password.length == 0) {
      setError("Please, fill the blanks");
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          message.success("You have been successfully logged in.", 2, () => {
            navigate("/todo");
          });
        })
        .catch((error) => {
          setError("Email or password error");
        });
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="login_main">
        <Card className="login_form">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <h1 style={{ color: "black" }}>Login</h1>
          </div>

          <Form
            name="basic"
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 14 }}
            style={{ maxWidth: 600, width: "100%" }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 18 }}
              rules={[{ message: "Please input your username!" }]}
            >
              <Input
                // style={{ marginLeft: "25px" }}
                onChange={handleLogEmail}
                placeholder="berdi@gmail.com"
                value={email}
                className="login_email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 18 }}
              rules={[{ message: "Please input your password!" }]}
            >
              <Input.Password
                onChange={handleLogPassword}
                // ref={passwordRef}
                type="password"
                placeholder="password"
                value={password}
                className="login_password"
              />
            </Form.Item>
            {error && (
              <div
                style={{
                  color: "red",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                {error}
              </div>
            )}
            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
              <Button onClick={handleLogin} type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
            className="create_account"
          >
            <Link to="/register">
              <p style={{ cursor: "pointer" }}>Create account</p>
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
