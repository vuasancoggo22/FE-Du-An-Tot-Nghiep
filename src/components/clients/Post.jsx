import React, { useEffect, useState } from "react";
import instance from "../../api/instance";
const Post = () => {
  const [fistPost, setFistPost] = useState([]);
  const [nextPost, setNextPost] = useState([]);
  useEffect(() => {
    const data = async () => {
      const fetch1 = await instance.get(`/blogs?limit=1&page=1`);
      const fetch2 = await instance.get(`/blogs-latest?start=2&limit=4`);
      setFistPost(fetch1);
      setNextPost(fetch2);
      //   console.log("data", fetch2);
    };
    data();
  }, []);
  return (
    <div className="w-[1200px] grid grid-cols-[800px_1fr] gap-[10px] m-auto py-[30px]">
      <div>
        <h4 className="text-center text-[#00502b] py-[20px] text-lg">
          TIN TỨC NỔI BẬT
        </h4>
        <div className="grid grid-cols-[360px_1fr] gap-[10px]">
          {fistPost?.map((item, index) => (
            <div key={index}>
              <a href={`news/detail/${item.slug}`}>
                <img src={item?.thumbnail} alt="" width="359px" />
                <h5 className=" text-[#00502b] py-[10px] text-base">
                  {item.title}
                </h5>
              </a>
              <p className="text-base">{item.shortDescription}</p>
            </div>
          ))}

          <div>
            {nextPost?.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[100px_1fr] gap-[10px] pb-[10px]"
              >
                <div>
                  <a href={`news/detail/${item.slug}`}>
                    <img src={item?.thumbnail} alt="" width="100px" />
                  </a>
                </div>
                <div>
                  <a href={`news/detail/${item.slug}`}>
                    <h6 className="text-[#00502b] text-base">{item.title}</h6>
                  </a>
                  <p>{item.shortDescription}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-center text-[#00502b] text-lg py-[20px]">
          HỎI ĐÁP MỸ PHẨM
        </h4>
        <p className="">
          {" "}
          <button className="w-[100%] rounded-t-lg bg-[#dbe2df] text-[#287538] text-base px-[55px] py-[5px] mb-[10px]">
            Trị sẹo lồi bằng laser bao nhiêu tiền?
          </button>
        </p>
        <p className="">
          {" "}
          <button className="w-[100%] rounded-t-lg bg-[#dbe2df] text-[#287538] text-base px-[55px] py-[5px] mb-[10px]">
            Thời gian một liệu trình trị nám?
          </button>
        </p>
        <p className="">
          {" "}
          <button className="w-[100%] rounded-t-lg bg-[#dbe2df] text-[#287538] text-base px-[55px] py-[5px] mb-[10px]">
            Spa có chế độ bảo hành ra sao?
          </button>
        </p>
        <p className="">
          {" "}
          <button className="w-[100%] rounded-t-lg bg-[#dbe2df] text-[#287538] text-base px-[55px] py-[5px] mb-[10px]">
            Dịch vụ của Spa được đào tạo từ đâu?
          </button>
        </p>
      </div>
    </div>
  );
};

export default Post;
