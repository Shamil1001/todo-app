import { useState } from "react";
import Navbar from "../components/navbar";
import Signup from "../components/signup";

function Main() {
  return (
    <div className="App">
      <Navbar />
      <Signup />
    </div>
  );
}

export default Main;
