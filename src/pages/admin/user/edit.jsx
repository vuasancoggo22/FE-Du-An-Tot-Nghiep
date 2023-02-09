import {
  Button,
  Form,
  Input,
  Upload,
  Select,
  message,
  InputNumber,
} from "antd";
import { Option } from "antd/lib/mentions";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { httpGetOneUser, httpUpdateOneUser } from "../../../api/user";
import { isAuthenticate } from "../../../utils/LocalStorage";
import { uploadCloudinary } from "../../../api/upload";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const UserEdit = () => {
  const user = isAuthenticate();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const { id } = useParams();
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState();

  const uploadImage = async (options) => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "vanv1ob1");
    try {
      const res = await uploadCloudinary(formData);
      onSuccess("Ok");
      message.success("Upload successfully !");
      console.log("server res: ", res);
      setUrl(res.data.secure_url);
    } catch (err) {
      onError({ err });
    }
  };
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.log("setFileList", newFileList[0].originFileObj);
    getBase64(newFileList[0].originFileObj, (url) => {
      setUrl(url);
      console.log(url);
    });
  };
  const onFinish = async (data) => {
    const avatar = { ...data, avatar: url != "" ? url : fileList[0].url };
    try {
      await httpUpdateOneUser(user.token, id, avatar).then(() => {
        message.success("cập nhật thành công", 4);
        navigate("/admin/user");
      });
    } catch (error) {
      message.error(`${error.response.data.message}`, 4);
    }
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  useEffect(() => {
    const getListUser = async () => {
      const res = await httpGetOneUser(user.token, id);
      form.setFieldsValue({
        name: res?.name,
        avatar: res?.avatar,
        phone: res?.phoneNumber,
        address: res?.address,
        role: res?.role,
        status: res?.status,
      });
      setFileList([{ url: res?.avatar }]);
    };
    getListUser();
  }, []);

  return (
    <>
      <div className="w-[1200px] px-6 py-6 m-auto">
        <div>
          <h1 className="w-full text-center mb-0 font-bold text-white capitalize pb-[20px]  text-[50px]">
            <div>Cập nhật tài khoản</div>
          </h1>
        </div>
      </div>

      <div className=" px-6 py-6 ml-[30px]  ">
        <div className="mt-[150px] my-[20px]">
          <Link to={"/admin/user"} className="ml-[275px]">
            <Button type="primary">Quay lại</Button>
          </Link>
        </div>
        <div className="w-[1000px] m-auto">
          <Form
            name="basic"
            initialValues={{ status: true }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            form={form}
          >
            <Form.Item
              name="name"
              label="Họ tên"
              // rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: "Please input your number" }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item label="Ảnh đại diện">
              <Form.Item name="avatar">
                <Upload
                  listType="picture-card"
                  onChange={onChange}
                  customRequest={uploadImage}
                  fileList={fileList}
                >
                  {fileList?.length < 1 && uploadButton}
                </Upload>
              </Form.Item>
            </Form.Item>
            <Form.Item
              name="address"
              label="Địa chỉ"
              // rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="age" label="Tuổi" type="number">
              <InputNumber />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Giới tính"
              // rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Select placeholder="Chọn giới tính">
                <Option value={0}>Nữ</Option>
                <Option value={1}>Nam</Option>
              </Select>
            </Form.Item>
            {/* <Form.Item
              name="role"
              label="Vai trò"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please select your role",
                },
              ]}
            >
              <Select>
                <Option value={0}>Khách hàng</Option>
                <Option value={1}>Nhân viên</Option>
                <Option value={2}>Admin</Option>
              </Select>
            </Form.Item> */}
            <Form.Item
              name="status"
              label="Trạng thái"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Không để trống trạng thái !",
                },
              ]}
            >
              <Select>
                <Option value={0}>Chưa kích hoạt</Option>
                <Option value={1}>Đã kích hoạt</Option>
                <Option value={2}>Đã khóa</Option>
              </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 5 }}>
              <Button type="primary" htmlType="submit">
                Cập nhật tài khoản
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UserEdit;
