import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { uid } from "uid";
import { v4 as uuidv4 } from "uuid";
import { set, ref, onValue } from "firebase/database";

export default function Todo() {
  const navigate = useNavigate();
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(ref(db, `/${auth.currentUser?.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((todo) => {
              setTodos((prev) => [...prev, todo]);
            });
          }
        });
      } else if (!user) {
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
    if (auth.currentUser) {
      set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
        todo: todo,
        uid: uidd,
      });
      setTodo("");
    }
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

        <div className="ttodo">
          {todos.map((todo, index) => (
            <h3 key={index}>{todo.todo}</h3>
          ))}
        </div>
      </div>
    </>
  );
}
