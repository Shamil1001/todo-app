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

  // auth.onAuthStateChanged((user) => {
  //   if (user) {
  //     console.log("userrrrrrrrr");
  //     // navigate("/todo");
  //   }
  // });

  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       console.log("userrrrrrrrr");
  //       // navigate("/todo");
  //     }
  //   });
  // }, []);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleRegEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setRegEmail(event.target.value);
  };

  const handleRegister = () => {
    if (registerInformation.password !== registerInformation.confirmPassword) {
      alert("Please, confirm that password  are the same");
    } else {
      createUserWithEmailAndPassword(
        auth,
        regEmail,
        registerInformation.password
      )
        .then(() => {
          navigate("/todo");
        })
        .catch(() => {
          console.log("User is already have");
          setUserError("User is already registered");
        });
    }
    // else {
    //   auth.onAuthStateChanged((user) => {
    //     if (user) {
    //       // User is already authenticated, do something
    //       console.log(`User ${user.uid} is logged in`);
    //     } else {
    //       // User is not authenticated, do something
    //       console.log('User is not logged in');
    //     }
    //   });
    // }
  };
  // else {
  //   createUserWithEmailAndPassword(
  //     auth,
  //     regEmail,
  //     registerInformation.password
  //   )
  //     .then(() => {
  //       navigate("/");
  //     })
  //     .catch((err) => console.log(err));
  // }

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
              wrapperCol={{ span: 14 }}
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                style={{ marginLeft: "30px" }}
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
                style={{ marginLeft: "7px" }}
                onChange={(e) =>
                  setRegisterInformation({
                    ...registerInformation,
                    password: e.target.value,
                  })
                }
                // ref={passwordRef}
                type="password"
                value={registerInformation.password}
              />
            </Form.Item>
            <Form.Item
              label="Password2"
              name="password2"
              labelCol={{ span: 0 }}
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                onChange={(e) =>
                  setRegisterInformation({
                    ...registerInformation,
                    confirmPassword: e.target.value,
                  })
                }
                // ref={passwordRef}
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

            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
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
