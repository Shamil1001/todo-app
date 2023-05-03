import { Dropdown, Menu, message, Space, Button } from "antd";
import { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { auth, db } from "../firebase";
import { set, ref, onValue, remove, update } from "firebase/database";
import type { TableProps } from "antd";
import { Table } from "antd";
import type {
  ColumnsType,
  FilterValue,
  SorterResult,
} from "antd/es/table/interface";

type TProps = {
  todos: any[];
  deleteConfirm: any;
  handleDelete: (todo: any) => void;
  handleUpdate: (todo: any) => void;
};

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const handleOptionClick = (element: string, option: any) => {
  console.log(option.key);
  if (auth.currentUser) {
    update(ref(db, `/${auth.currentUser.uid}/${element}`), {
      todoStatus: option.key,
    });
  }
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
}: TProps) {
  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});

  const handleChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<DataType>);
  };

  const formatDate = (date: string) => {
    const dateObj = new Date(date);

    const formattedDate = `${dateObj.getDate()}/${
      dateObj.getMonth() + 1
    }/${dateObj.getFullYear()}`;

    return formattedDate;
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const setAgeSort = () => {
    setSortedInfo({
      order: "descend",
      columnKey: "age",
    });
  };

  console.log(todos);
  return (
    <>
      {/* <Table columns={columns} dataSource={data} onChange={onChange} />; */}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Task Name</th>
            <th>Added date</th>
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
              <td>{formatDate(todo.date)}</td>
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
                      <p>{todo.todoStatus}</p>
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </td>
              <td className="btns">
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
              <td className="btns_e">
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
    </>
  );
}
