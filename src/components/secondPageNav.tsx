import { Link } from "react-router-dom";
import "./navbar.css";

interface NavbarProps {
  handleSignOut: () => void;
}

export default function SecondPageNavbar({ handleSignOut }: NavbarProps) {
  return (
    <>
      <div className="nav_title">
        {/* <Link to="/" style={{ textDecoration: "none" }}> */}
        <p className="todo_title">Todo List App</p>
        <p onClick={handleSignOut} className="sign_out">
          Sign out
        </p>
      </div>
    </>
  );
}
