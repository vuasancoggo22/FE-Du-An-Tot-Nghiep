import { Table, Button } from "antd";
import React from "react";

import useContact from "../../../hooks/use-contact";
import { httpDeleteContact } from "../../../api/contact";
import "antd/dist/antd.css";

const columns = [
  {
    title: "STT",
    dataIndex: "_id",
    render: (text, object, index) => {
      return index + 1;
    },
  },
  {
    title: "Tên",
    dataIndex: "name",
    className: "ant-descriptions-title",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
  },
  {
    title: "Nội dung",
    dataIndex: "content",
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
  },
  {
    title: "Hành động",
    dataIndex: "_id",
    key: "action",
    colapse: 1,
    render: (item) => {
      return (
        <div className="text-center">
          <Button
            type="danger"
            className="font-bold w-full h-full "
            onClick={() => onRemove(item)}
          >
            Xóa
          </Button>
        </div>
      );
    },
  },
];
const onRemove = async (id) => {
  console.log(id);
  const confirm = window.confirm("Bạn muốn xóa liên hệ ?");
  if (confirm) {
    await httpDeleteContact(id);
  }
};
const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};
const ContactList = () => {
  const { data, error } = useContact();
  if (!data) return <div>loading</div>;
  if (error) return <div>Failed loading</div>;
  return (
    <>
      <div className="w-full px-6 py-6 mx-auto">
        <div>
          <h1 className="w-[1200px] m-auto text-center mb-0 font-bold text-white capitalize pb-[20px] text-[40px]">
            <div>Danh sách liên hệ</div>
          </h1>
        </div>
      </div>
      <div className="w-full px-6 py-6 mx-auto">
        <Table
          bordered
          className="bold"
          rowClassName={(record, index) =>
            index % 2 === 0 ? "ant-tag-blue" : "ant-tag-green"
          }
          columns={columns}
          dataSource={data}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default ContactList;
