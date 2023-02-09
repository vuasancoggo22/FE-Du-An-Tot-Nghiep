import React, { useState } from "react";
import ReactQuill from "react-quill";
import * as medthod from "../../../api/post";
import { Button, message, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Upload from "antd/lib/upload/Upload";
import TextArea from "antd/lib/input/TextArea";
import { useNavigate } from "react-router-dom";

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

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/jpg";
  if (!isJpgOrPng) {
    message.error("Chỉ chọn được ảnh JPG/PNG/JPG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Kích thước ảnh lớn hơn 2MB!");
  }
  return isJpgOrPng && isLt2M;
};
const AddPost = () => {
  const [content, setContent] = useState("");

  const [imageUrl, setImageUrl] = useState();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    if (values) {
      const data = {
        ...values,

        content: content,
        thumbnail: imageUrl,
      };
      try {
        await medthod.createPost(data);
        message.success("Thêm bài viết thành công");
        navigate("/admin/post");
      } catch (error) {
        message.error("Thêm bài viết thất bại");
      }
    }
    console.log(content);
  };

  const handleChange = async (info) => {
    // base64
    if (info.file.status === "uploading") {
      getBase64(info.file.originFileObj, (url) => {
        setImageUrl(url);
      });
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

  return (
    <>
      <div className="w-full px-6 py-6 mx-auto ">
        <div>
          <h1 className="w-[1200px] m-auto text-center mb-0 font-bold text-white capitalize pb-[20px]  text-[50px] ">
            <div>Thêm tin tức</div>
          </h1>
        </div>
      </div>

      <div className="w-full px-6 py-6 mx-auto bg-white ">
        <Form
          autoComplete="off"
          initialValues={{
            remember: true,
          }}
          layout="vertical"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item>
            <Button
              type="primary"
              size="large"
              className="mb-3"
              htmlType="submit"
            >
              Đăng bài viết
            </Button>
          </Form.Item>
          <Form.Item>
            <Input.Group>
              <Form.Item
                label="Tiêu đề bài viết"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Tối thiểu 16 kí tự và không để trống !",
                    min: 16,
                  },
                ]}
                wrapperCol={{ span: 5 }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Mô tả ngắn"
                name="shortDescription"
                wrapperCol={{ span: 10 }}
                rules={[
                  {
                    required: true,
                    message: "Mô tả không được để trống !",
                  },
                ]}
              >
                <TextArea
                  showCount
                  maxLength={100}
                  style={{
                    height: 60,
                    resize: "none",
                  }}
                  placeholder="disable resize"
                />
              </Form.Item>
              <Form.Item
                label="Ảnh"
                name="thumbnail"
                rules={[
                  {
                    required: true,
                    message: "Ảnh không được để trống !",
                  },
                ]}
              >
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{
                        width: "100%",
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="content"
            rules={[
              {
                required: true,
                message: "Nội dung không được để trống, ít nhất 32 kí tự !",
              },
            ]}
          >
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              // formats={formats}
              className="h-80 mb-20"
            ></ReactQuill>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddPost;
