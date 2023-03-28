import { ChangeEvent, useState } from "react";
import "../components/signup";
import Navbar from "../components/navbar";
import "./register.css";
import { Card } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Register() {
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleRegEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setRegEmail(event.target.value);
  };

  const handleRegPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setRegPassword(event.target.value);
  };

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, regEmail, regPassword)
      .then(() => {
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Navbar />
      <div className="register_main">
        <Card className="register_form">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <h1 style={{ color: "black" }}>Register</h1>
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
              labelCol={{ span: 0 }}
              // wrapperCol={{ span: 14 }}
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                style={{ marginLeft: "25px" }}
                onChange={handleRegEmail}
                value={regEmail}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              labelCol={{ span: 0 }}
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                onChange={handleRegPassword}
                // ref={passwordRef}
                type="password"
                value={regPassword}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
              <Button onClick={handleRegister} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
            <Link to="/">
              <p
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Already have account
              </p>
            </Link>
          </Form>
        </Card>
      </div>
    </>
  );
}
