import { Button, message, Select, Space, Table } from "antd";

import { Option } from "antd/lib/mentions";
import React, { useState } from "react";
import { useEffect } from "react";

import { Link } from "react-router-dom";
import { getPosts, removePost } from "../../../api/post";
const ListPost = () => {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const onRemove = async (id) => {
    const confirm = window.confirm("Bạn muốn xóa banner không ?");
    if (confirm) {
      console.log("sldas", id);
      await removePost(id);
      setPosts(posts.filter((item) => item._id !== id));
      console.log(posts);
      message.success("Xóa thành công");
    }
  };
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail) => {
        return (
          <img
            src={thumbnail}
            alt="thumbnail"
            style={{ width: "100px", height: "100px" }}
          />
        );
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Mô tả",
      dataIndex: "shortDescription",
      key: "shortDescription",
      render: (shortDescription) => {
        return <p>{shortDescription}</p>;
      },
    },

    {
      title: "Hành động",
      dataIndex: "_id",
      key: "action",
      colapse: 2,
      render: (_, item) => {
        // Thêm

        return (
          <div className="text-center">
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
                    <Link to={`/admin/post/${item.slug}/edit`}>Sửa</Link>
                  </Button>
                </Option>
                <Option>
                  {" "}
                  <Button
                    onClick={() => {
                      onRemove(item._id);
                    }}
                    type="danger"
                    style={{ border: "none", color: "white", width: "100%" }}
                  >
                    Xóa
                  </Button>{" "}
                </Option>
                <Option>
                  {" "}
                  <Button
                    onClick={showModal}
                    dataId={item.content}
                    type=""
                    style={{
                      border: "none",
                      color: "white",
                      width: "100%",

                      backgroundColor: "#f1c232",
                    }}
                  >
                    <Link to={`/admin/post/${item.slug}`}>Chi Tiết</Link>
                  </Button>
                </Option>
              </Select>
            </Space>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    const getPost = async () => {
      const res = await getPosts();
      setPosts(res);
    };
    getPost();
  }, [loading]);
  return (
    <>
      <div className="w-full px-6 py-6 mx-auto ">
        <div>
          <h1 className="w-[1200px] m-auto text-center mb-0 font-bold text-white capitalize pb-[20px] text-[40px] ">
            <div>Danh sách tin tức</div>
          </h1>
        </div>
        <div className="">
          <Link to={"/admin/post/add"}>
            <Button>+ Thêm tin tức</Button>
          </Link>
        </div>
      </div>

      <div className="w-full px-6 py-6 mx-auto  ">
        <Table columns={columns} dataSource={posts} />
      </div>
    </>
  );
};

export default ListPost;
