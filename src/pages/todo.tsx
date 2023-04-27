import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./todo.css";
import { Input, Button, Card, Space, Select } from "antd";
import SecondPageNavbar from "../components/secondPageNav";
const { Option } = Select;
import TodoTable from "../components/todoTable";

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
  const [selectedOption, setSelectedOption] = useState("");

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
    const date = new Date().toString();
    const todoStatus = "doing";
    if (todo.trim() !== "") {
      if (auth.currentUser && todo.length !== 0) {
        set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
          todo: todo,
          uid: uidd,
          date: date,
          todoStatus: todoStatus,
        });

        setTodoNum(todoNum + 1);
        console.log(todos);
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
                <TodoTable
                  todos={todos}
                  deleteConfirm={deleteConfirm}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                />
              </Card>
            </Space>
          </div>
        </div>
      </div>
    </>
  );
}
