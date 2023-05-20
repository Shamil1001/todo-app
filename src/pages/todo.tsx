import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { set, ref, onValue, remove, update } from "firebase/database";
import "./todo.css";
import { Input, Button, Card, Space, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
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
  const [filterOption, setFilterOption] = useState("all");
  const [inputError, setInputError] = useState<boolean>(false);
  const [data, setData] = useState<Todos[]>([]);
  const [arrow, setArrow] = useState("descending");
  const [arrow2, setArrow2] = useState("descending");

  function handleArrow(value: string) {
    setArrow(value);

    const filtered = todos.filter(
      (todo: any) => todo.todoStatus == filterOption
    );
    if (filterOption !== "all") {
      if (value == "accending") {
        const sorted = filtered.sort((a, b) => {
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
        setData(sorted.reverse());
      } else {
        setData(data.reverse());
      }
    } else {
      if (value == "accending") {
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
        setData(sorted.reverse());
      } else {
        setData(data.reverse());
      }
    }
  }

  function handleArrow2(value: string) {
    setArrow2(value);
    const filtered = todos.filter(
      (todo: any) => todo.todoStatus == filterOption
    );
    if (filterOption !== "all") {
      if (value == "accending") {
        const sortedData = filtered.sort((taskA: any, taskB: any) =>
          taskA.date.localeCompare(taskB.date)
        );
        setData(sortedData.reverse());
      } else {
        setData(data.reverse());
      }
    } else {
      if (value == "accending") {
        const sortedData = todos.sort((taskA: any, taskB: any) =>
          taskA.date.localeCompare(taskB.date)
        );
        setData(sortedData.reverse());
      } else {
        setData(data.reverse());
      }
    }
  }
  function handleFilter(value: string) {
    console.log(value);
    setFilterOption(value);
    if (value !== "all") {
      const filtered = todos.filter((todo: any) => todo.todoStatus == value);
      setData(filtered);
    } else {
      setData(todos);
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
            console.log("obj", Object.values(data));
            Object.values(data).forEach((todo) => {
              setTodos((prev: any) => [...prev, todo]);
            });
            setData(Object.values(data));
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
    const todoStatus = "not started";
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
        setInputError(false);
      }
    } else {
      setInputError(true);

      setTodo("");
      return;
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      writeToDatabase();
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
          <div className="todo_input_err">
            <div className="todo_input">
              <Input
                className="add_input_form"
                placeholder="Write your tasks here..."
                onKeyDown={handleKeyDown}
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
                    Add task
                  </Button>
                </div>
              )}
            </div>

            {inputError && <p className="error">Please enter a valid input!</p>}
          </div>
          <div className="todo_list">
            <div className="cardd">
              <TodoTable
                todos={data}
                setFilterOption={setFilterOption}
                handleFilter={handleFilter}
                arrow={arrow}
                handleArrow={handleArrow}
                arrow2={arrow2}
                handleArrow2={handleArrow2}
                deleteConfirm={deleteConfirm}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
              />
            </div>
            {/* </Card> */}
          </div>
        </div>
      </div>
    </>
  );
}
