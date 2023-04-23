import { Link } from "react-router-dom";
import "./navbar.css";

interface NavbarProps {
  handleSignOut: () => void;
  userEmail: string;
}

export default function SecondPageNavbar({
  handleSignOut,
  userEmail,
}: NavbarProps) {
  return (
    <>
      <div className="nav_title">
        {/* <Link to="/" style={{ textDecoration: "none" }}> */}
        <p className="todo_title">Todo List App</p>
        <p className="userEmail">{userEmail}</p>
        <p onClick={handleSignOut} className="sign_out">
          Sign out
        </p>
      </div>
    </>
  );
}
