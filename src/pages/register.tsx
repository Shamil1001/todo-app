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
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input onChange={handleRegEmail} value={regEmail} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
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

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button onClick={handleRegister} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
            <Link to="/">
              <p>Go back</p>
            </Link>
          </Form>
        </Card>
      </div>
    </>
  );
}
