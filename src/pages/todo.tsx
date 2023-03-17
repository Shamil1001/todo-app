import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
// import useState from 'react';

export default function Todo() {
  const navigate = useNavigate();
  const [todo, setTodo] = useState<string>("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
      }
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => alert(err.message));
  };
  return (
    <>
      <div className="todo_list_page">
        <div className="todo_nav">
          <span onClick={handleSignOut}>
            <FaSignOutAlt />
          </span>
        </div>
        <div className="todo_container">
          <input
            type="text"
            onChange={(e) => setTodo(e.target.value)}
            value={todo}
          />
          <button>Add</button>
        </div>

        <div></div>
      </div>
    </>
  );
}
