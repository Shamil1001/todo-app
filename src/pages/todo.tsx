import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./todo.css";
import {
  Input,
  Button,
  Card,
  Space,
  Select,
  Dropdown,
  Typography,
  message,
} from "antd";
import SecondPageNavbar from "../components/secondPageNav";
const { Option } = Select;
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

interface Todos {
  todo: string;
}
const onClick: MenuProps["onClick"] = ({ key }) => {
  message.info(`Click on item ${key}`);
};

const items: MenuProps["items"] = [
  {
    key: "1",
    label: "Doing",
  },
  {
    key: "2",
    label: "Done",
  },
  {
    key: "3",
    label: "Not started",
  },
];

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
  const [selectedOption, setSelectedOption] = useState("");
  const [sortedData, setSortedData] = useState<Todos[]>([]);

  function handleChange(value: string) {
    console.log(`selected ${value}`);
    setSelectedOption(value);
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
      const sortedData = todos.sort((taskA: any, taskB: any) =>
        taskA.date.localeCompare(taskB.date)
      );
      setTodos(sortedData);
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
              // setSortedData(todos);
            });
            // console.log("data", todos);
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
    const date = new Date().toString();
    // console.log(sortedData);
    if (todo.trim() !== "") {
      if (auth.currentUser && todo.length !== 0) {
        set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
          todo: todo,
          uid: uidd,
          date: date,
        });

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
              <Card style={{ minWidth: "350px", maxWidth: "550px" }}>
                <div className="select-sort">
                  <Select
                    // defaultValue="date"
                    value={selectedOption}
                    style={{ width: 150, marginBottom: 20 }}
                    onChange={handleChange}
                  >
                    <Option value="">Select option</Option>
                    <Option value="date">Sort by date</Option>
                    <Option value="alphabet">Sort by alphabet</Option>
                  </Select>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Task Name</th>
                      <th>Status</th>
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
                          <Dropdown menu={{ items, onClick }}>
                            <a onClick={(e) => e.preventDefault()}>
                              <Space>
                                Hover me
                                <DownOutlined />
                              </Space>
                            </a>
                          </Dropdown>
                        </td>
                        <td>
                          <button
                            className={
                              deleteConfirm == todo.uid
                                ? "delete_b btn"
                                : "delete_btn btn"
                            }
                            onClick={() => handleDelete(todo.uid)}
                          >
                            {deleteConfirm == todo.uid ? (
                              <p>delete</p>
                            ) : (
                              <MdOutlineDeleteOutline className="delete_icon" />
                            )}
                          </button>
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
