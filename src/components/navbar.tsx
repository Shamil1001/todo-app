import * as React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <div className="nav_title">
        <Link to="/" style={{ textDecoration: "none" }}>
          <p className="todo_title">Todo List App</p>
        </Link>
      </div>
    </>
  );
}
