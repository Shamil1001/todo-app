import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { uid } from "uid";
import { v4 as uuidv4 } from "uuid";
import { set, ref } from "firebase/database";

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

  const writeToDatabase = () => {
    const uidd = uuidv4();
    set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      todo: todo,
      uid: uidd,
    });
    setTodo("");
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
          <button onClick={writeToDatabase}>Add</button>
        </div>

        <div></div>
      </div>
    </>
  );
}
