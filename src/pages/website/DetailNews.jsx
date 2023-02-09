import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOnePost } from "../../api/post";
import { getPosts } from "../../api/post";
import SideBar from "./SideBar";

const News = () => {
  const { id } = useParams();
  const [post, setPost] = useState();
  const [posts, setPosts] = useState([]);
  console.log(posts);

  useEffect(() => {
    const data = async () => {
      const res = await getOnePost(id);
      setPost(res);
    };
    data();
  }, []);

  useEffect(() => {
    const data = async () => {
      const res = await getPosts(id);
      setPosts(res);
    };
    data();
  }, []);

  return (
    <section className="flex flex-col md:flex-row bg-white max-w-[1200px] mx-auto mb-8 mt-8 px-10 xl:px-0">
      <div className="w-[100%] md:w-[75%] pr-0 md:pr-10">
        <div>
          <h1 className="text-[#00502b] text-center font-medium">Tin tức</h1>
          <h2 className="text-[#00502b] text-center text-3xl">{post?.title}</h2>

          <div className="centerimage">
            <div
              className="text-base mt-10"
              dangerouslySetInnerHTML={{ __html: post?.content }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between mt-10 border-t-2 border-black"></div>
        <div className="w-[100%]">
          <h3 className="text-xl text-[#00502b] mt-6">Tin liên quan</h3>
          <div className="flex justify-between">
            {posts?.map((item, index) => (
              <Link to={`/news/detail/${item?.slug}`} key={index}>
                <img
                  className="w-[90%] h-[200px] object-cover hover:opacity-80 px-3"
                  src={item.thumbnail}
                  alt=""
                />
                <p className="w-[85%] m-auto font-semibold text-[#00502b] hover:text-[#0e844d]">
                  {item.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
        {/* <div>
          <h3 className="text-xl text-[#00502b] mt-10">Trả lời </h3>
          <p className="text-base mt-2">
            Email của bạn sẽ không được hiển thị công khai. Các trường bắt buộc
            được đánh dấu *
          </p>
          <p className="text-base mt-2 font-semibold">Bình luận *</p>
          <textarea
            className="border-2 border-[#e7e3e3] p-5 outline-[#ccc] text-lg w-[100%]"
            name=""
            id=""
            cols="80"
            rows="5"
          ></textarea>
          <div className="flex justify-between">
            <div className="flex flex-col w-[30%]">
              <label className="text-base mt-2 font-semibold">Tên *</label>
              <input
                className="border-2 border-[#e7e3e3] p-1 outline-[#ccc] text-lg"
                type="text"
                name=""
                id=""
              />
            </div>
            <div className="flex flex-col w-[30%]">
              <label className="text-base mt-2 font-semibold">Email *</label>
              <input
                className="border-2 border-[#e7e3e3] p-1 outline-[#ccc] text-lg"
                type="text"
                name=""
                id=""
              />
            </div>
            <div className="flex flex-col w-[30%]">
              <label className="text-base mt-2 font-semibold">Trang web</label>
              <input
                className="border-2 border-[#e7e3e3] p-1 outline-[#ccc] text-lg"
                type="text"
                name=""
                id=""
              />
            </div>
          </div>
          <input className="mr-2 mt-8" type="checkbox" name="" id="" />
          <strong>
            Lưu tên của tôi, email, và trang web trong trình duyệt này cho lần
            bình luận kế tiếp của tôi.
          </strong>{" "}
          <br />
          <button className="bg-[#00502b] hover:bg-[#0c452b] text-xl font-semibold pt-2 pb-2 pl-4 pr-4 text-white mt-8 mb-20">
            PHẢN HỒI
          </button>
        </div> */}
      </div>
      <SideBar />
    </section>
  );
};

export default News;
