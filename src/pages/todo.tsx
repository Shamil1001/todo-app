import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { set, ref, onValue, remove, update } from "firebase/database";
import { uid } from "uid";

export default function Todo() {
  const navigate = useNavigate();
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [tempUid, setTempUid] = useState<string>("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(ref(db, `/${auth.currentUser?.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).forEach((todo) => {
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
  };

  const handleDelete = (uid: any) => {
    remove(ref(db, `/${auth.currentUser?.uid}/${uid}`));
  };

  const handleUpdate = (todo: any) => {
    setIsEdit(true);
    if (todo) {
      setTodo(todo.todo);
      setTempUid(todo.uid);
    }
  };

  const handleEditComfirm = () => {
    if (todo) {
      update(ref(db, `/${auth.currentUser?.uid}/${tempUid}`), {
        todo: todo,
        uid: tempUid,
      });
      // setIsEdit(false);
      setTodo("");
    }
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
          {isEdit ? (
            <div>
              <button onClick={handleEditComfirm}>Confirm</button>
            </div>
          ) : (
            <div>
              <button onClick={writeToDatabase}>Add</button>
            </div>
          )}
        </div>

        <div className="ttodo">
          {todos.map((todo: any, index) => (
            <div key={index}>
              <h3>{todo.todo}</h3>
              <button onClick={() => handleDelete(todo.uid)}>Delete</button>
              <button onClick={() => handleUpdate(todo)}>Edit</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
