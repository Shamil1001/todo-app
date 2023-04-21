import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./todo.css";
import { Input, Button, Card, Space, Select } from "antd";
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
  const [userEmail, setUserEmail] = useState<any>("");

  function handleChange(value: string) {
    console.log(`selected ${value}`);
    if (value == "alphabet") {
      const sorted = todos.sort((a, b) => {
        let titleA = a.todo.toUpperCase();
        let titleB = b.todo.toUpperCase();
        if (titleA < titleB) {
          return -1;
        }
        if (titleA > titleB) {
          return 1;
        }
        return 0;
      });
      setTodos(sorted);
      // console.log(sorted);
    } else if (value == "date") {
      // const sortedData = todos.sort((a: any, b: any) => b.date - a.date);
      // const sortedData = todos.sort((taskA: any, taskB: any) =>
      //   taskA.date.localeCompare(taskB.date)
      // );
      // setTodos(sortedData);
      // console.log(sortedData);
    }
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUserEmail(user?.email);

      if (user) {
        onValue(ref(db, `/${auth.currentUser?.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();

          if (data !== null) {
            // const todos = Object.values(data).map((todo: any) => ({
            //   ...todo,
            // }));
            // setTodos(todos);
            Object.values(data).forEach((todo) => {
              setTodos((prev: any) => [...prev, todo]);
            });
          }
          // console.log("data", Object.v alues(data));
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
    const date = new Date().toString();
    if (todo.trim() !== "") {
      if (auth.currentUser && todo.length !== 0) {
        set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
          todo: todo,
          uid: uidd,
          date: date,
        });
        console.log(todos);
        setTodoNum(todoNum + 1);
        setTodo("");
      }
    } else {
      alert("Please enter a valid input!");
      setTodo("");
      return;
    }
  };

  const handleDelete = (uid: any) => {
    setDeleteConfirm(uid);
    console.log(todos);
    setDeleteTodo(!deleteTodo);
    if (deleteConfirm == uid) {
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

  return (
    <>
      <div className="todo_list_page">
        <SecondPageNavbar userEmail={userEmail} handleSignOut={handleSignOut} />
        <div className="todo_container">
          <div className="todo_input">
            <Input
              className="add_input_form"
              maxLength={20}
              minLength={5}
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
              <Card style={{ minWidth: "280px", maxWidth: "500px" }}>
                <div className="select-sort">
                  <Select
                    defaultValue="sort"
                    style={{ width: 150, marginBottom: 20 }}
                    onChange={handleChange}
                  >
                    <Option value="sort">Sort option</Option>
                    <Option value="date">Sort by date</Option>
                    <Option value="alphabet">Sort by alphabet</Option>
                  </Select>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Task Name</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todos.map((todo: any, index: number) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{todo.todo}</td>
                        <td>
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
                        </td>
                        <td>
                          <Button
                            type="ghost"
                            className="edit_btn"
                            onClick={() => handleUpdate(todo)}
                          >
                            <FaEdit className="edit_icon" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </Space>
          </div>
        </div>
      </div>
    </>
  );
}
