import React, { useState, useEffect } from "react";
import { Button, message, Select, Space, Table } from "antd";

import { Option } from "antd/lib/mentions";
import { Link } from "react-router-dom";
import { ListVouchers, DeleteVoucher } from "../../../api/voucher";
import moment from "moment";
const ListVoucher = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleRemove = async (id) => {
    const confirm = window.confirm("Bạn muốn xóa voucher này không?");
    if (confirm) {
      await DeleteVoucher(id);
      setVouchers(vouchers.filter((item) => item._id !== id));
      message.success("Xóa voucher thành công!");
    }
  };

  const columns = [
    {
      title: "Tên voucher",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Mã voucher",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Loại voucher",
      dataIndex: "type",
      key: "type",
      render: (item) => (
        <span>{item == "direct" ? "Giảm trực tiếp" : "Giảm phần trăm"}</span>
      ),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (item, vouchers) => (
        <div>
          {vouchers.type == "direct" ? (
            <span>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item)}
            </span>
          ) : (
            <span>{item + "%"}</span>
          )}
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },

    {
      title: "Dịch vụ",
      dataIndex: "service",
      key: "service",
      render: (item) => <span>{item.name}</span>,
    },

    {
      title: "Ngày hết hạn",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (item) => <span>{moment(item).format("DD/MM/YYYY")}</span>,
    },

    {
      title: "Hành động",
      dataIndex: "_id",
      key: "action",
      render: (_, item) => {
        // Thêm
        return (
          <div className="">
            <Space size="middle">
              <Select
                style={{ width: "170px", color: "blue", textAlign: "center" }}
                value="Hành động"
              >
                <Option>
                  {" "}
                  <Button
                    onClick={showModal}
                    dataId={item._id}
                    type="primary"
                    style={{ border: "none", color: "white", width: "100%" }}
                  >
                    <Link to={`/admin/voucher/update/${item._id}`}>Sửa</Link>
                  </Button>
                </Option>
                <Option>
                  {" "}
                  <Button
                    onClick={() => {
                      handleRemove(item._id);
                    }}
                    type="danger"
                    style={{ border: "none", color: "white", width: "100%" }}
                  >
                    Xóa
                  </Button>{" "}
                </Option>
              </Select>
            </Space>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const getVoucher = async () => {
      const res = await ListVouchers();
      setVouchers(res);
    };
    getVoucher();
  }, [loading]);
  return (
    <>
      <div className="w-full px-6 py-6 mx-auto ">
        <div>
          <h1 className="m-auto text-center mb-0 font-bold text-white capitalize pb-[20px] text-[40px] ">
            <div>Danh sách Voucher</div>
          </h1>
        </div>
        <div className="">
          <Link to={"/admin/voucher/add"}>
            <Button>+ Thêm Voucher</Button>
          </Link>
        </div>
      </div>

      <div className="w-full px-6 py-6 mx-auto  ">
        <Table columns={columns} dataSource={vouchers} />
      </div>
    </>
  );
};

export default ListVoucher;
