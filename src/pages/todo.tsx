import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { set, ref, onValue, remove, update } from "firebase/database";
import { uid } from "uid";
import "./todo.css";
import { Input, Button, Card, Space, Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";

interface Todos {
  todo: string;
}

export default function Todo() {
  const navigate = useNavigate();
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<Todos[]>([]);
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
              setTodos((prev: any) => [...prev, todo]);
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

  const onCheck = (todo: any) => {
    console.log(todo);
  };

  return (
    <>
      <div className="todo_list_page">
        <div className="todo_nav">
          <span className="logout_icon" onClick={handleSignOut}>
            <AiOutlineLogout />
          </span>
          <label>Log out</label>
        </div>
        <div className="todo_container">
          <div className="todo_input">
            <Input
              className="add_input_form"
              type="text"
              onChange={(e) => setTodo(e.target.value)}
              value={todo}
            />
            {isEdit ? (
              <div>
                <Button type="primary" onClick={handleEditComfirm}>
                  Confirm
                </Button>
              </div>
            ) : (
              <div>
                <Button type="primary" onClick={writeToDatabase}>
                  Add
                </Button>
              </div>
            )}
          </div>

          <div className="todo_list">
            <Space>
              <Card>
                {todos.map((todo: any, index) => (
                  <div className="todo_list_items" key={index}>
                    {/* <Checkbox onChange={() => onCheck(todo)}></Checkbox> */}
                    <h3>{todo.todo}</h3>
                    <div className="delete_edit">
                      <Button
                        danger
                        type="primary"
                        onClick={() => handleDelete(todo.uid)}
                      >
                        <MdOutlineDeleteOutline className="delete_icon" />
                        {/* <span>Delete</span> */}
                      </Button>
                      <Button
                        type="ghost"
                        className="edit_btn"
                        onClick={() => handleUpdate(todo)}
                      >
                        <FaEdit className="edit_icon" />
                        {/* Edit */}
                      </Button>
                    </div>
                  </div>
                ))}
              </Card>
            </Space>
          </div>
        </div>
      </div>
    </>
  );
}
