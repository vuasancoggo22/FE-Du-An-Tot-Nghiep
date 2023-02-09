import { Table, Image, Button, Select, Tag, message, Modal } from "antd";
import { Option } from "antd/lib/mentions";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useEmployee from "../../../hooks/use-employee";

// CommonJS

const ListEmployee = () => {
  const navigate = useNavigate();
  const { data, update, error } = useEmployee();
  const columns = [
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      render: (image) => <Image width={100} src={image} key={image} />,
    },
    {
      title: "Mã nhân viên",
      dataIndex: "idCard",
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },

    {
      title: "Tên nhân viên",
      dataIndex: "name",
    },

    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (item) => {
        if (item === 1) {
          return <Tag color="green">ĐANG LÀM VIỆC</Tag>;
        }
        if (item === 0) {
          return <Tag color="red">TẠM NGHỈ LÀM</Tag>;
        }
        if (item == 2) {
          return <Tag color="gray">ĐÃ NGHỈ VIỆC</Tag>;
        }
      },
    },
    {
      title: "Hành động",
      dataIndex: "_id",
      key: "action",
      colapse: 2,
      render: (_, item) => {
        return (
          <Select
            style={{ width: "170px", color: "blue", textAlign: "center" }}
            value="Hành động"
          >
            <Option>
              <Button
                onClick={() => navigate(`/admin/employee/${item._id}/edit`)}
                dataId={item._id}
                type="primary"
                style={{ border: "none", color: "white", width: "100%" }}
              >
                Sửa thông tin
              </Button>
            </Option>
            {item.status == 1 || item.status == 0 ? (
              <Option>
                <Button
                  onClick={() => {
                    onChangeStatus(item._id, 2);
                  }}
                  className="text-white bg-gray-500"
                  style={{ border: "none", color: "white", width: "100%" }}
                >
                  Xác nhận nghỉ việc
                </Button>
              </Option>
            ) : (
              ""
            )}
            {item.status == 1 ? (
              <Option>
                <Button
                  onClick={() => {
                    onChangeStatus(item._id, 0);
                  }}
                  type="danger"
                  style={{ border: "none", color: "white", width: "100%" }}
                >
                  Xác nhận tạm nghỉ
                </Button>
              </Option>
            ) : (
              ""
            )}
            {item.status == 0 || item.status == 2 ? (
              <Option>
                <Button
                  onClick={() => {
                    onChangeStatus(item._id, 1);
                  }}
                  className="text-white bg-green-500"
                  style={{ border: "none", color: "white", width: "100%" }}
                >
                  Xác nhận làm trở lại
                </Button>
              </Option>
            ) : (
              ""
            )}
          </Select>
        );
      },
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  const onChangeStatus = async (id, status) => {
    const data = {
      status,
    };
    try {
      Modal.confirm({
        title: "Bạn có chắc chắn muốn cập nhật trạng thái nhân viên không ?",
        onOk: async () => {
          update(id, data);
          message.success("Cập nhật trạng thái nhân viên thành công.", 5);
        },
      });
    } catch (error) {
      message.error(`${error.response.data.message}`, 4);
    }
  };
  if (!data) return <div>loading</div>;
  if (error) return <div>Failed loading</div>;
  return (
    <>
      <div className="w-full px-6 py-6 mx-auto">
        <div>
          <h1 className="w-[1200px] m-auto text-center mb-0 font-bold text-white capitalize pb-[20px] text-[40px]">
            <div>Danh sách nhân viên</div>
          </h1>
        </div>
        <Link to={"/admin/employee/add"}>
          <Button
            type="success"
            style={{
              border: "1px solid white",
              font: "bold",
            }}
          >
            + Thêm nhân viên
          </Button>
        </Link>
      </div>
      <div className="w-full px-6 py-6 mx-auto">
        <Table columns={columns} dataSource={data} onChange={onChange} />
      </div>
      ;
    </>
  );
};

export default ListEmployee;
