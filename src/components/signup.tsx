import * as React from "react";
import "./signup.css";
import signupImg from "../assets/undraw_join_re_w1lh.svg";
import { Card, Button } from "antd";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <>
      {/* <Navbar /> */}
      <div className="signup_page">
        <div className="signup_left">
          <img className="signup_left_svg" src={signupImg} />
        </div>
        <div className="signup_box">
          <Card className="signup_login_card">
            {/* <h1>Sign up</h1> */}
            <div className="card_buttons">
              <Link to="/register" className="signup_btn">
                <p>Sign Up</p>
              </Link>
              <Link to="/login" className="signup_btn">
                <p>Sign In</p>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
