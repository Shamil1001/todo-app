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
        <p onClick={handleSignOut} className="todo_title">
          Todo List App
        </p>
        {/* </Link> */}
        {/* <h2 className="">Log out</h2> */}
      </div>
    </>
  );
}
