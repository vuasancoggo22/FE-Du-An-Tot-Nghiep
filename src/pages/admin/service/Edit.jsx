import { Button, Form, Input, Upload, message, InputNumber } from "antd";
import React, { useEffect, useState } from "react";

import { httpGetOneService } from "../../../api/services";
import { Link, useNavigate, useParams } from "react-router-dom";
import { updateService } from "../../../api/service";

import { uploadCloudinary } from "../../../api/upload";
import ReactQuill from "react-quill";
import ImgCrop from "antd-img-crop";

const normFile = (e) => {
  console.log("Upload event:", e);

  if (Array.isArray(e)) {
    return e;
  }

  return e?.fileList;
};
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
    [{ align: [] }],
  ],
};

const EditService = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const { id } = useParams();
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [fileList, setFileList] = useState([]);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  useEffect(() => {
    const getSerVice = async () => {
      const dataService = await httpGetOneService(id);
      console.log("log service :", dataService);
      setUrl(dataService?.image);
      setContent(dataService?.content);
      setFileList([{ url: dataService.image }]);
      form.setFieldsValue({
        name: dataService?.name,
        price: dataService?.price,
        status: dataService?.status,
        image: dataService?.image,
        description: dataService?.description,
      });
    };

    getSerVice();
  }, []);

  const uploadImage = async (options) => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "my_upload");
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
  const onFinish = async (data) => {
    console.log(data);
    const a = { ...data, image: url, description: content };
    try {
      await updateService(id, a).then(() => {
        message.success("cap nhat thành công", 4);
        navigate("/admin/service");
      });
    } catch (error) {
      message.error(`${error.response.data.message}`, 4);
    }
  };

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
    listType: "picture",
    maxCount: 1,
    onDrop: true,
    defaultFileList: [{ url, name: "default image" }],
  };

  return (
    <>
      <div className="w-[1200px] px-6 py-6 m-auto">
        <div>
          <h1 className="w-full text-center mb-0 font-bold text-white capitalize pb-[20px] text-[40px]">
            <div>Cập nhật dịch vụ</div>
          </h1>
        </div>
      </div>

      <div className=" px-6 py-6 ml-[30px]  ">
        <div className="mt-[150px] my-[20px]">
          <Link to={"/admin/service"}>
            <Button type="primary">Quay lại</Button>
          </Link>
        </div>
        <Form
          className="m-auto text-center"
          name="basic"
          labelCol={{ span: 4, offset: 5 }}
          wrapperCol={{ span: 15, offset: 5 }}
          initialValues={{ status: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          form={form}
        >
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá tiền"
            rules={[
              { required: true, message: "Vui lòng nhập giá tiền dịch vụ!" },
            ]}
          >
            <InputNumber
              min={10000}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label="Ảnh dịch vụ">
            <ImgCrop>
              <Upload
                customRequest={uploadImage}
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                name="avatar"
              >
                {fileList.length < 1 && "+ Upload"}
              </Upload>
            </ImgCrop>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả dịch vụ"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả dịch vụ!" },
            ]}
          >
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              // formats={formats}
              className="h-screen mb-20"
            ></ReactQuill>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 10, span: 5 }}>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default EditService;
