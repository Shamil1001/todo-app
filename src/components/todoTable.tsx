import { Dropdown, Menu, message, Space, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { auth, db } from "../firebase";
import { set, ref, onValue, remove, update } from "firebase/database";

type TableProps = {
  todos: any[];
  deleteConfirm: any;
  handleDelete: (todo: any) => void;
  handleUpdate: (todo: any) => void;
};
const handleOptionClick = (element: string, option: any) => {
  console.log(auth.currentUser);
  if (auth.currentUser) {
    set(ref(db, `/${auth.currentUser.uid}/${element}`), {
      todoStatus: option.key,
    });
  }
  //   console.log(todos)
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

export default function TodoTable({
  todos,
  deleteConfirm,
  handleDelete,
  handleUpdate,
}: TableProps) {
  return (
    <>
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
        {/* <tbody>
          {todos.map((todo: any, index: number) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{todo.todo}</td>
              <td>
                <Dropdown
                  overlay={
                    <Menu
                      onClick={(option) => handleOptionClick(todo.uid, option)}
                    >
                      <Menu.Item key="doing">doing</Menu.Item>
                      <Menu.Item key="done">done</Menu.Item>
                      <Menu.Item key="not started">not started</Menu.Item>
                    </Menu>
                  }
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      {todo.todoStatus}
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
        </tbody> */}
      </table>
    </>
  );
}
