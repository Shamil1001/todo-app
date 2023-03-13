import * as React from "react";
// import "../components/signup.css";
// import signupImg from "../assets/undraw_join_re_w1lh.svg";
import { Card, Button } from "antd";

const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

export default function Login() {
  return (
    <>
      <div className="signup_page">
        <div className="signup_left">{/* <img src={signupImg} /> */}</div>
        <div className="signup_box">
          <Card className="signup_login_card">
            {/* <h1>Sign up</h1> */}
            <div className="card_buttons">
              <button className="signup_btn">Sign Up</button>
              <button className="signup_btn">Sign In</button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
