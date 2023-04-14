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
import { Input, Button, Card, Space, Checkbox, Select } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import SecondPageNavbar from "../components/secondPageNav";
const { Option } = Select;

interface Todos {
  todo: string;
}

export default function Todo() {
  const navigate = useNavigate();
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<Todos[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [tempUid, setTempUid] = useState<string>("");
  const [todoNum, setTodoNum] = useState<number>(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string>();
  const [deleteTodo, setDeleteTodo] = useState<boolean>(false);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [userEmail, setUserEmail] = useState<any>("");

  function handleChange(value: string) {
    console.log(`selected ${value}`);
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUserEmail(user?.email);
      // console.log(user?.email);
      if (user) {
        onValue(ref(db, `/${auth.currentUser?.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            const todos = Object.values(data)
              .map((todo: any) => ({ ...todo, timestamp: todo.timestamp || 0 }))
              .sort((a: any, b: any) => b.timestamp - a.timestamp);
            setTodos(todos);
            // Object.values(data).forEach((todo) => {
            //   setTodos((prev: any) => [...prev, todo]);
            // });
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
    if (auth.currentUser && todo.length !== 0) {
      set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
        todo: todo,
        uid: uidd,
      });
      setTodoNum(todoNum + 1);
      setTodo("");
    }
  };

  const handleDelete = (uid: any) => {
    setDeleteConfirm(uid);
    setDeleteTodo(!deleteTodo);

    if (deleteTodo == true) {
      remove(ref(db, `/${auth.currentUser?.uid}/${uid}`));
    }
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
      setIsEdit(false);
      setTodo("");
    }
  };

  const onCheck = (todo: any) => {
    // console.log(todo);
  };

  return (
    <>
      <div className="todo_list_page">
        <SecondPageNavbar userEmail={userEmail} handleSignOut={handleSignOut} />
        <div className="todo_container">
          <div className="todo_input">
            <Input
              className="add_input_form"
              maxLength={40}
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
              <Card style={{ minWidth: "280px", maxWidth: "400px" }}>
                <div className="select-sort">
                  <Select
                    defaultValue="date"
                    style={{ width: 150, marginBottom: 20 }}
                    onChange={handleChange}
                  >
                    <Option value="date">Sort by date</Option>
                    <Option value="alphabet">Sort by alphabet</Option>
                  </Select>
                </div>
                {todos.map((todo: any, index) => (
                  <div className="todo_list_items" key={index}>
                    {/* <Checkbox onChange={() => onCheck(todo)}></Checkbox> */}
                    <h3>{index + 1}</h3>
                    {/* <h3>{todoNum}</h3> */}
                    <div className="list_element">
                      <h3>{todo.todo}</h3>
                    </div>
                    <div className="delete_edit">
                      <Button
                        danger
                        className="delete_btn"
                        type="primary"
                        onClick={() => handleDelete(todo.uid)}
                      >
                        {deleteConfirm == todo.uid ? (
                          "confirm"
                        ) : (
                          <MdOutlineDeleteOutline className="delete_icon" />
                        )}
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
