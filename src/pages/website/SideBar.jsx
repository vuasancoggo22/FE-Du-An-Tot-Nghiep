import React, { useEffect, useState } from "react";
import banner from "../../../assets/img/image/banner.jpg";
import { httpGetAllService } from "../../api/services";
import { getPosts } from "../../api/post";
import { Link } from "react-router-dom";

const SideBar = () => {
  const [services, setServices] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const data = async () => {
      const res = await httpGetAllService();
      setServices(res.filter((item) => item.status !== 0));
    };
    data();
  }, []);

  useEffect(() => {
    const post = async () => {
      const fetch = await getPosts();
      setPosts(fetch);
    };
    post();
  }, []);

  return (
    <div className="w-[100%] md:w-[25%] ">
      <div className="border-2 border-[#00502B] border-t-transparent rounded-3xl text-center pb-4">
        <h2 className="bg-[#00502B] text-white text-[24px] font-bold text-center mb-0 rounded-tr-2xl rounded-tl-2xl py-2">
          Thời gian làm việc
        </h2>
        <h2 className="text-[#00502B] text-[28px] font-bold mt-2">
          7H00 - 19H00
        </h2>
        <p className="text-[22px]">
          Từ <strong>thứ 2</strong> đến <strong>Chủ nhật</strong>
        </p>
      </div>
      <div className="text-[#00502B] border-2 border-[#00502B] border-t-transparent rounded-3xl mt-5">
        <h2 className="bg-[#00502B] text-white text-[24px] font-bold text-center mb-4 rounded-tr-2xl rounded-tl-2xl py-2">
          Dịch vụ nổi bật
        </h2>
        <div className="px-4">
          {services?.map((item, index) => (
            <Link
              key={index}
              to={`/detail-booking/${item?.slug}`}
              className="text-[#036636] text-base hover:text-[#036636] font-bold block"
            >
              <div className="flex w-[100%]">
                <img
                  src={item.image}
                  width="50px"
                  height="50px"
                  alt=""
                  className="mr-2 mb-3 object-cover"
                />
                <p className="font-bold">{item?.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div>
        <img className="w-[100%] mt-4 mb-6" src={banner} alt />
      </div>
      <div className="border-2 border-[#00502B] border-t-transparent rounded-3xl mt-5">
        <h2 className="bg-[#00502B] text-white text-[24px] font-bold text-center mb-4 rounded-tr-2xl rounded-tl-2xl py-2">
          Có thể bạn quan tâm
        </h2>
        <div className="px-4">
          {posts?.map((item, index) => (
            <Link
              key={index}
              to={`/news/detail/${item?.slug}`}
              className="text-[#036636] text-base hover:text-[#036636] font-bold block"
            >
              <div className="flex w-[100%]">
                <img
                  src={item?.thumbnail}
                  style={{ width: "50px", height: "50px" }}
                  alt=""
                  className="mr-2 mb-3 object-cover"
                />
                <p className="truncate font-bold">{item?.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="border-2 border-[#00502B] border-t-transparent rounded-3xl mt-5">
        <h2 className="bg-[#00502B] text-white text-[28px] font-bold text-center mb-0 rounded-tr-2xl rounded-tl-2xl">
          Xem video
        </h2>
        <div className="relative">
          <div className="">
            {" "}
            <iframe
              width="auto"
              src="https://www.youtube.com/embed/BdLgWOpvGd4"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
      {/* <div className="border-2 border-[#00502B] border-t-transparent rounded-3xl mt-5 ">
        <h2 className="bg-[#00502B] text-white text-[28px] font-bold text-center mb-0 rounded-tr-2xl rounded-tl-2xl">
          Câu chuyện khác hàng
        </h2>
        <div className="px-4">
          <a
            className="flex text-[#036636] hover:text-[#008000] pb-3 pt-3 font-bold"
            href
          >
            <img className="mr-2 w-[44px] h-[44px]" src={image5} alt />
            Điêu khắc lông mày được bao lâu?
          </a>
          <a
            className="flex text-[#036636] hover:text-[#008000] pb-3 pt-3 font-bold"
            href
          >
            <img className="mr-2 w-[44px] h-[44px]" src={image6} alt />
            Điêu khắc lông mày hỏng có sửa được không?
          </a>
          <a
            className="flex text-[#036636] hover:text-[#008000] pb-3 pt-3 font-bold"
            href
          >
            <img className="mr-2 w-[44px] h-[44px]" src={image} alt />
            Có nên điêu khắc lông mày không?
          </a>
        </div>
      </div> */}
    </div>
  );
};

export default SideBar;
