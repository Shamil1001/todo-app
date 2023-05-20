import { Dropdown, Menu, message, Space, Button, Tag, Typography } from "antd";
import { useState } from "react";
import type { MenuProps } from "antd";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { auth, db } from "../firebase";
import { set, ref, onValue, remove, update } from "firebase/database";
import type { TableProps } from "antd";
import { Table } from "antd";
import {
  DownOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  FilterOutlined,
} from "@ant-design/icons";
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
  arrow: string;
  handleArrow: any;
  arrow2: string;
  handleArrow2: any;
  setFilterOption: any;
  handleFilter: any;
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

export default function TodoTable({
  todos,
  deleteConfirm,
  handleDelete,
  handleUpdate,
  arrow,
  handleArrow,
  arrow2,
  handleArrow2,
  setFilterOption,
  handleFilter,
}: TProps) {
  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});

  const onClick: MenuProps["onClick"] = ({ key }) => {
    // message.info(`Click on item ${key}`);
    if (key == "0") {
      handleFilter("all");
    } else if (key == "1") {
      handleFilter("doing");
    } else if (key == "2") {
      handleFilter("done");
    } else {
      handleFilter("not started");
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "0",
      label: "All",
    },
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
      <table id="myTable">
        <thead>
          <tr>
            <th>#</th>

            <th className="task_name">
              <p
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                Task Name{" "}
                {arrow == "descending" ? (
                  <CaretDownOutlined
                    onClick={() => handleArrow("accending")}
                    className="arrow"
                  />
                ) : (
                  <CaretUpOutlined
                    onClick={() => handleArrow("descending")}
                    className="arrow"
                  />
                )}
              </p>
            </th>
            <th className="added_date">
              <p
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                Added date{" "}
                {arrow2 == "descending" ? (
                  <CaretDownOutlined
                    onClick={() => handleArrow2("accending")}
                    className="arrow"
                  />
                ) : (
                  <CaretUpOutlined
                    onClick={() => handleArrow2("descending")}
                    className="arrow"
                  />
                )}
              </p>
            </th> 

            <th>
              <p
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                Status
                {
                  <Dropdown
                    menu={{
                      items,
                      selectable: true,
                      defaultSelectedKeys: ["3"],
                      onClick,
                    }}
                  >
                    <Typography.Link onClick={(e) => e.preventDefault()}>
                      <Space>
                        <FilterOutlined />
                      </Space>
                    </Typography.Link>
                  </Dropdown>
                }
              </p>
            </th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo: any, index: number) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td style={{ fontWeight: "bolder", color: "#3a3939" }}>
                {todo.todo}
              </td>
              <td>{formatDate(todo.date)}</td>
              <td>
                <Dropdown
                  overlay={
                    <Menu
                      onClick={(option) => handleOptionClick(todo.uid, option)}
                    >
                      <Menu.Item key="doing">
                        <Tag color="blue">doing</Tag>
                      </Menu.Item>
                      <Menu.Item key="done">
                        <Tag color="green">done</Tag>
                      </Menu.Item>
                      <Menu.Item key="not started">
                        <Tag color="red">not started</Tag>
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space className="status_dropdown ">
                      <Tag
                        color={
                          todo.todoStatus == "done"
                            ? "green"
                            : todo.todoStatus == "doing"
                            ? "blue"
                            : "red"
                        }
                      >
                        {todo.todoStatus}
                        <DownOutlined />
                      </Tag>
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
