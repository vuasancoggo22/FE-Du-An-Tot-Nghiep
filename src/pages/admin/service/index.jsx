import { Table, Image, Button, Select, Tag, Modal, message } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React from "react";
import useService from "../../../hooks/use-service";
import Description from "../../../components/admin/detaiservice";
import { Link, useNavigate } from "react-router-dom";
import { Option } from "antd/lib/mentions";
import { formatPrice } from "../../../utils/formatCash";
import { updateService } from "../../../api/service";

const ListService = () => {
  const { data, error } = useService();
  const navigate = useNavigate();
  const columns = [
    {
      title: "Ảnh dịch vụ",
      dataIndex: "image",
      render: (image) => <Image width={100} src={image} key={image} />,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
        {
          text: "Jim",
          value: "Jim",
        },
        {
          text: "Submenu",
          value: "Submenu",
          children: [
            {
              text: "Green",
              value: "Green",
            },
            {
              text: "Black",
              value: "Black",
            },
          ],
        },
      ],
     
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },

    {
      title: "Giá",
      dataIndex: "price",
      render: (price) => <div className="">{formatPrice(price)}</div>,
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (item) => {
        if (item === 1) {
          return <Tag color="green">ĐANG KINH DOANH</Tag>;
        } else {
          return <Tag color="red">DỪNG KINH DOANH</Tag>;
        }
      },
    },
    {
      title: "Mô tả",

      render: (item) => {
        return (
          <div className="ml-8">
            <Description ondetail={item.description} />
          </div>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "_id",
      key: "action",
      colapse: 2,
      render: (_, item) => {
        console.log(item);

        return (
          <Select
            style={{ width: "170px", color: "blue", textAlign: "center" }}
            value="Hành động"
          >
            <Option>
              <Button
                onClick={() => navigate(`/admin/service/${item._id}/edit`)}
                dataId={item._id}
                type="primary"
                style={{ border: "none", color: "white", width: "100%" }}
              >
                Sửa dịch vụ
              </Button>
            </Option>
           {item.status == 1 ?  <Option>
              <Button
                onClick={() => {
                  onChangeStatus(item._id,0);
                }}
                type="danger"
                style={{ border: "none", color: "white", width: "100%" }}
              >
                  Ngừng kinh doanh
              </Button>
            </Option> : ""}
            {item.status == 0 ? <Option>
              <Button
                onClick={() => {
                  onChangeStatus(item._id,1);
                }}
                className="text-white bg-green-500"
                style={{ border: "none", color: "white", width: "100%" }}
              >
                Tiếp tục kinh doanh
              </Button>
            </Option> : ""}
          </Select>
        );
      },
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  const onChangeStatus = (id,status) => {
    const data = {
      status
    }
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn cập nhật trạng thái dịch vụ không ?',
      icon : <ExclamationCircleOutlined/>,
      async onOk() {
        try {
          await updateService(id,data)
          message.success('Cập nhật trạng thái dịch vụ thành công.',5)
        } catch (error) {
          message.error(`${error.response.data.message}`, 4)
        }
       
      },
      onCancel() {},
    });
         
          
            
        
     
     
  };
  if (!data) return <div>loading</div>;
  if (error) return <div>Failed loading</div>;
  return (
    <>
      <div className="w-full px-6 py-6 mx-auto">
        <div>
          <h1 className="w-[1200px] m-auto text-center mb-0 font-bold text-white capitalize pb-[20px] text-[40px]">
            <div>Danh sách dịch vụ</div>
          </h1>
        </div>
        <Link to={"/admin/service/add"}>
          <Button>+ Thêm dịch vụ</Button>
        </Link>
      </div>
      <div className="w-full px-6 py-6 mx-auto">
        <Table  columns={columns} dataSource={data} onChange={onChange} />
      </div>
      ;
    </>
  );
};

export default ListService;
