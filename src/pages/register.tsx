import { ChangeEvent, useState, useEffect } from "react";
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
  const [userError, setUserError] = useState("");
  const [registerInformation, setRegisterInformation] = useState({
    password: "",
    confirmPassword: "",
  });

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

  const handleRegister = () => {
    if (
      registerInformation.password.length == 0 ||
      registerInformation.confirmPassword.length == 0 ||
      regEmail.length == 0
    ) {
      setUserError("Please, fill the blanks");
    }
    if (regEmail.includes("@") == false) {
      setUserError("Please, write email correctly");
    } else if (
      registerInformation.password !== registerInformation.confirmPassword
    ) {
      setUserError("Please, confirm that passwords are the same");
    } else {
      createUserWithEmailAndPassword(
        auth,
        regEmail,
        registerInformation.password
      )
        .then(() => {
          navigate("/");
        })
        .catch(() => {
          console.log("User is already have");
          setUserError("User is already registered");
        });
    }
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
              // marginBottom: "20px",
            }}
          >
            <h1 style={{ color: "black" }}>Register</h1>
          </div>
          <Form
            name="basic"
            // labelCol={{ span: 0 }}
            // wrapperCol={{ span: 14 }}
            style={{ maxWidth: 600, width: "100%" }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 14 }}
              name="username"
              rules={[{ message: "Please input your email!" }]}
            >
              <Input
                // style={{ marginLeft: "75px" }}
                onChange={handleRegEmail}
                value={regEmail}
                placeholder="berdi@gmail.com"
                className="register_email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 14 }}
              rules={[{ message: "Please input your password!" }]}
            >
              <Input.Password
                // style={{ marginLeft: "50px" }}
                onChange={(e) =>
                  setRegisterInformation({
                    ...registerInformation,
                    password: e.target.value,
                  })
                }
                // ref={passwordRef}
                placeholder="password"
                className="register_password"
                type="password"
                value={registerInformation.password}
              />
            </Form.Item>
            <Form.Item
              label="Confirm password"
              name="password2"
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 13 }}
              rules={[{ message: "Please input your password!" }]}
            >
              <Input.Password
                // style={{ width: "97%" }}
                className="register_confirm"
                onChange={(e) =>
                  setRegisterInformation({
                    ...registerInformation,
                    confirmPassword: e.target.value,
                  })
                }
                // ref={passwordRef}
                placeholder="password"
                type="password"
                value={registerInformation.confirmPassword}
              />
            </Form.Item>
            {userError && (
              <div
                style={{
                  color: "red",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                {userError}
              </div>
            )}

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button onClick={handleRegister} type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
            <Link to="/">
              <p
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Link to login page
              </p>
            </Link>
          </Form>
        </Card>
      </div>
    </>
  );
}
