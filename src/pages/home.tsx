import { useState } from "react";
import Navbar from "../components/navbar";
import Signup from "../components/signup";
import signupImg from "../assets/undraw_join_re_w1lh.svg";
import Login from "./login";

function Main() {
  return (
    <div className="App">
      <Navbar />
      <div className="home_page">
        <div className="signup_left">
          <img className="signup_left_svg" src={signupImg} />
        </div>
        <div className="home_login">
          <Login />
        </div>
      </div>
      {/* <Signup /> */}
    </div>
  );
}

export default Main;
