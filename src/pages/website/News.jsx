import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../../api/post";
import SideBar from "./SideBar";

const DetailNews = () => {
  const [posts, setPosts] = React.useState([]);
  useEffect(() => {
    const getPost = async () => {
      const res = await getPosts();
      setPosts(res);
    };
    getPost();
  });

  return (
    <section className="bg-white max-w-[1200px] mx-auto mb-8 mt-8 px-10 xl:px-0">
      <div className="flex justify-center md:justify-start items-center ml-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
          color="#014b29"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
        <h2 className="text-2xl text-[#014b29] mb-0 ml-3">Tin tức</h2>
      </div>
      <div className="flex flex-wrap">
        <div className="w-[100%] md:w-[75%] mx-auto pr-0 md:pr-10">
          <div className="flex flex-wrap">
            {/* <div>
              <Link to={`/detail-booking/${item?.slug}`}>
                <a>
                  <img
                    src="https://beautyspa4.shostweb.com/wp-content/uploads/2021/11/f2-small-dv1.jpg"
                    alt=""
                  />
                  <div className="text-center py-[10px]">
                    <button>{item?.name}</button>
                  </div>
                </a>
              </Link>
            </div> */}

            {posts?.map((item) => (
              <Link
                key={item?._id}
                to={`/news/detail/${item?.slug}`}
                className="w-[100%] lg:w-[46%] xl:w-[30%] border-2 border-[#f3dd82] rounded-xl mx-3 my-5"
              >
                <img
                  className="rounded-t-[10px] w-[100%] h-[260px] object-cover"
                  src={item?.thumbnail}
                  alt=""
                />
                <h2 className="text-center text-lg font-semibold mx-3 text-[#00502b]">
                  {item?.title}
                </h2>
                <div className="w-8 h-[2px] bg-[#ccc] mx-auto"></div>
                <p className="text-center font-semibold mt-3 text-[14px] text-[#32394c] px-4">
                  {item?.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <SideBar />
      </div>
    </section>
  );
};

export default DetailNews;
