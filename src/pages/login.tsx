import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import { Card, Space } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import Navbar from "../components/navbar";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/todo");
      }
    });
  }, []);

  const emailRef = useRef();
  const passwordRef = useRef();

  const onFinish = (values: any) => {
    console.log("Success:", values);
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
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/todo");
        console.log("successssssssss");
      })
      .catch((err) => console.log(err));
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
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 14 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input onChange={handleLogEmail} value={email} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                onChange={handleLogPassword}
                // ref={passwordRef}
                type="password"
                value={password}
              />
            </Form.Item>
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
