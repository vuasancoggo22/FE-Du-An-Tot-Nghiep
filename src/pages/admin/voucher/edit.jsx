import { Button, Form, Input, Select, message, Row, Col } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OneVoucher, updateVouche } from "../../../api/voucher";
import { httpGetAllService } from "../../../api/services";
import moment from "moment";

const EditVoucher = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  const onFinish = async (data) => {
    try {
      await updateVouche(id, data).then(() => {
        message.success("Cập nhật thành công !", 4);
        navigate("/admin/voucher");
      });
    } catch (error) {
      message.error(`${error.response.data.message}`, 4);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // Selec
  const { Option } = Select;
  function handleChange(value) {
    console.log(value);
  }
  const [datevoucher, setDatevoucher] = useState();
  useEffect(() => {
    const getoneSerVice = async () => {
      const datavocher = await OneVoucher(id);
      console.log(
        "log voucher :",
        moment(datavocher?.expirationDate).format("YYYY-MM-DD")
      );
      setDatevoucher(moment(datavocher?.expirationDate).format("YYYY-MM-DD"));
      form.setFieldsValue({
        name: datavocher?.name,
        code: datavocher?.code,
        disabled: datavocher?.disabled,
        discount: datavocher?.discount,
        service: datavocher?.service,
        quantity: datavocher?.quantity,
        type: datavocher?.type,
        expirationDate: moment(datavocher?.expirationDate).format("yyyy/mm/dd"),
        description: datavocher?.description,
      });
    };
    const getService = async () => {
      const res = await httpGetAllService();
      setServices(res);
    };
    getService();
    getoneSerVice();
  }, []);

  return (
    <div>
      <div className="w-[1200px] px-6 py-6 m-auto">
        <div>
          <h1 className="w-full text-center mb-0 font-bold text-white capitalize pb-[20px] text-[40px]">
            <div>Cập nhập Voucher</div>
          </h1>
        </div>
      </div>

      <div className=" px-6 py-6 ml-[30px]  ">
        <div className="mt-[150px] my-[20px]"></div>
        <Form
          className="m-auto"
          name="basic"
          labelCol={{ span: 4, offset: 5 }}
          wrapperCol={{ span: 15, offset: 5 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          form={form}
        >
          {/* Tên voucher */}
          <Row gutter={[4, 4]}>
            <Col xxl={24} xl={24} sm={24} xs={24}>
              <Form.Item
                label="Tên Voucher"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Tên voucher không được để trống !",
                  },
                ]}
              >
                <Input type="text" placeholder="Tên Voucher" />
              </Form.Item>
            </Col>
          </Row>

          {/* Mã voucher */}
          <Form.Item
            label="Mã voucher"
            name="code"
            rules={[
              {
                required: true,
                message: "Mã voucher không được để trống, ít nhất 4 kí tự !",
              },
            ]}
          >
            <Input type="text" placeholder="Mã Voucher" />
          </Form.Item>

          {/* Loại voucher */}
          <Form.Item
            label="Loại Voucher"
            name="type"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn mã Voucher!",
              },
            ]}
          >
            <Select
              // disabled={ishandle == 1 ? false : true}
              style={{ width: "100%" }}
              placeholder="Loại Voucher"
              options={[
                {
                  label: "Giảm tiền",
                  value: "direct",
                },
                {
                  label: "Giảm %",
                  value: "percentage",
                },
              ]}
            />
          </Form.Item>

          {/* Tiền giảm */}
          <Form.Item
            label="Giảm giá"
            name="discount"
            rules={[
              {
                required: true,
                message: "Giảm giá không được để trống !",
              },
            ]}
          >
            <Input type="number" placeholder="Giảm giá" />
          </Form.Item>

          {/* Số lượng */}
          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[
              { required: true, message: "Số lượng không được để trống !" },
            ]}
          >
            <Input type="number" placeholder="Số lượng" />
          </Form.Item>

          {/* Thời hạn voucher */}
          <Form.Item
            label="Thời hạn voucher"
            name="expirationDate"
            rules={[
              {
                required: true,
                message: "Thời hạn voucher không được để trống !",
              },
            ]}
          >
            <Input type="date" placeholder="Thời hạn" value={datevoucher} />
          </Form.Item>

          {/* Dịch vụ áp dụng voucher */}

          <Form.Item
            label="Dịch vụ áp dụng"
            name="service"
            onChange={handleChange}
            rules={[
              {
                required: true,
                message: "Nhập dịch vụ áp dụng voucher !",
              },
            ]}
          >
            <Select placeholder="Dịch vụ">
              {services.map((service, index) => (
                <Option key={index} value={service._id}>
                  <div className="">{service.name}</div>
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/*  */}

          <Form.Item>
            <Form.Item
              wrapperCol={{ offset: 10, span: 5 }}
              style={{ marginTop: "20px" }}
            >
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditVoucher;
