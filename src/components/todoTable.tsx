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

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
  },
];

const onChange: TableProps<DataType>["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log("params", pagination, filters, sorter, extra);
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

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filters: [
        { text: "Joe", value: "Joe" },
        { text: "Jim", value: "Jim" },
      ],
      // filteredValue: filteredInfo.name || null,
      // onFilter: (value: string, record) => record.name.includes(value),
      // sorter: (a, b) => a.name.length - b.name.length,
      // sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      // ellipsis: true,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === "age" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      filters: [
        { text: "London", value: "London" },
        { text: "New York", value: "New York" },
      ],
      // filteredValue: filteredInfo.address || null,
      // onFilter: (value: string, record) => record.address.includes(value),
      // sorter: (a, b) => a.address.length - b.address.length,
      // sortOrder: sortedInfo.columnKey === "address" ? sortedInfo.order : null,
      // ellipsis: true,
    },
  ];

  console.log(todos);
  return (
    <>
      {/* <Table columns={columns} dataSource={data} onChange={onChange} />; */}
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
          {/* <tr>
            <td>shamil</td>
            <td>shamil</td>
            <td>shamil</td>
            <td>shamil</td>
            <td>shamil</td>
          </tr> */}
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
                      {todo.todoStatus.toString()}
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
