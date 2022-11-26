import { Button, Form, Input, Upload, Select, message, Row, Col } from "antd";
import React, { useState } from "react";
import { httpAddEmployees } from "../../../api/employee";
import { InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { uploadCloudinary } from "../../../api/upload";
const normFile = (e) => {
  console.log("Upload event:", e);

  if (Array.isArray(e)) {
    return e;
  }

  return e?.fileList;
};
const { Option } = Select;
const AddEmployee = () => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(data);
    var res = await httpAddEmployees(data);
    if (res._id !== undefined) {
      message.success("Update employee success", 4);
      navigate("/admin/employee");
    }
  };

  const uploadImage = async (options) => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_upload");
    try {
      const res = await uploadCloudinary(formData);
      onSuccess("Ok");
      message.success("Upload successfully !");
      setUrl(res.data.secure_url);
    } catch (err) {
      onError({ err });
    }
  };
  const onFinish = async (data) => {
    const dataPost = { ...data, avatar: url };
    await onSubmit(dataPost);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  // ------------------------------

  const setting = {
    name: "file",
    beforeUpload: (file) => {
      const accept = ["image/png", "image/jpeg", "image/jpg"];

      if (file.size > 1024 * 1024 * 2) {
        message.error(`file quá lớn`);
        return Upload.LIST_IGNORE;
      } else if (!accept.includes(file.type)) {
        message.error(`không đúng định dạng ảnh (png,jpeg,jpg)`);
        return Upload.LIST_IGNORE;
      }
    },
    onChange: (info) => {
      console.log(info);
      // setImageFile(info);
    },
    listType: "picture-card",
    maxCount: 1,
    onDrop: true,
  };
  return (
    <>
      <div className="w-[1200px] px-6 py-6 m-auto">
        <div>
          <h1 className="w-full text-center mb-0 font-bold text-white capitalize pb-[20px]  text-[50px]">
            <div>Thêm mới nhân viên</div>
          </h1>
        </div>
      </div>

      <div className=" px-6 py-6 ml-[30px]  ">
        <div className="mt-[150px] my-[20px]"></div>
        <Form
          className="m-auto text-center"
          name="basic"
          labelCol={{ span: 4, offset: 5 }}
          wrapperCol={{ span: 15, offset: 5 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          {/* name */}
          <Row gutter={[4, 4]}>
            <Col xxl={24} xl={24} sm={24} xs={24}>
              <Form.Item
                label="Tên tài khoản"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Tên tài khoản không được để trống !",
                  },
                ]}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
          </Row>
          {/* Number Phone */}
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              {
                required: true,
                message: "Số điện thoại không được để trống !",
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          {/* Id Card */}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Password không được để trống !",
              },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          {/* Id Card */}
          <Form.Item
            label="Card Id"
            name="idCard"
            rules={[
              { required: true, message: "Card Id không được để trống !" },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email không được để trống !" }]}
          >
            <Input type="text" />
          </Form.Item>
          {/* Gender */}
          <Form.Item
            name="gender"
            label="Giới tính"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Nhập giới tính !",
              },
            ]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value={0}>Nam</Option>
              <Option value={1}>Nữ</Option>
            </Select>
          </Form.Item>
          {/* Avater */}

          <Form.Item>
            <Form.Item
              name="avatar"
              label="avatar"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
            >
              <Upload.Dragger {...setting} customRequest={uploadImage}>
                <p className="ant-upload-drag-icon h-[15px]">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Nhấn hoặc kéo thả để tải ảnh lên
                </p>
              </Upload.Dragger>
            </Form.Item>
            <Form.Item
              wrapperCol={{ offset: 10, span: 5 }}
              style={{ marginTop: "20px" }}
            >
              <Button type="primary" htmlType="submit">
                Thêm mới
              </Button>
            </Form.Item>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
export default AddEmployee;
