import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { httpGetAllService } from "../../api/services";
import SideBar from "./SideBar";

const PriceList = () => {
  const [listPrice, setListPrice] = useState([]);

  useEffect(() => {
    const getListPrice = async () => {
      const data = await httpGetAllService();
      setListPrice(data.filter((item) => item.status !== 0));
    };
    getListPrice();
  }, []);

  return (
    <section className="px-[20px] bg-white max-w-[1200px] mx-auto mb-8">
      <div className="flex flex-col md:flex-row mt-8 ">
        <div className="w-[100%] md:w-[75%] md:pr-10">
          <div className>
            <h2 className="text-[27px]">Bảng giá</h2>
            <p className="text-base">
              Xin chào bạn - độc giả của <strong>Tuyến Spa</strong>
            </p>
            <p className="pt-[23px] pb-[15px] text-base">
              Lời đầu tiên, cho phép <strong>Tuyến Spa</strong> được gửi tới quý
              khách, quý thân nhân và bạn bè lời chúc sức khỏe, thành đạt và
              hạnh phúc.
            </p>
            <p className="text-base">
              Cửa hàng được thành lập tháng 11/2016 dưới dạng Blog cá nhân, với
              mục đích ban đầu là nơi lưu trữ những hoặc những sản phẩm sáng tạo
              trong quá trình học tập, làm việc.
            </p>
            <p className="pt-[23px] pb-[15px] text-base">
              Sau một thời gian hoạt động, website đã có những bước tiến đáng kể
              cả về chất lượng và hình thức. Số lượng khách truy cập website trở
              thành khách hàng sử dụng dịch vụ thiết kế tăng lên đáng kể. Từ
              việc chăm chút nội dung cho website theo sở thích,{" "}
              <strong>Tuyến Spa</strong> đã dần chinh phục khách hàng với những
              dịch vụ thiết kế sáng tạo uy tín và chất lượng.
            </p>
            <p className="text-base">
              Tự tin với khả năng đáp ứng mọi yêu cầu thiết kế của khách hàng,{" "}
              <strong>Tuyến Spa</strong> chính thức đem lại dịch vụ Sự ủng hộ và
              tin tưởng của khách hàng sẽ trở thành nguồn cảm hứng lớn lao cho{" "}
              <strong>Tuyến Spa</strong> trong quá trình phác họa những ý tưởng
              thiết kế được trở thành hiện thực.
            </p>
            <p className="py-[15px] text-base">
              Xin cám ơn sự tin tưởng và ủng hộ của quý khách trong thời gian
              qua.
            </p>
            <p className="text-base">Trân trọng.</p>
          </div>
          <p className="ml-2 font-bold text-base">BẢNG GIÁ DỊCH VỤ</p>
          <div className="overflow-x-auto">
            <div className="flex ">
              <h3 className="w-[15%] sm:w-[10%] bg-[#008000] text-white mr-[1px] pl-2 py-1 text-base">
                STT
              </h3>
              <h3 className="w-[70%] bg-[#008000] text-white pl-2 py-1 text-base">
                Tên dịch vụ
              </h3>
              <h3 className=" w-[37%] sm:w-[20%] bg-[#008000] text-white ml-[1px] pl-2 py-1 text-base">
                Giá dv
              </h3>
            </div>
            <ul>
              {listPrice.map((item, index) => (
                <li
                  className="flex ml-2 my-2 border-b-[1px] border-[#ccc]"
                  key={index}
                >
                  <strong className="w-[15%] sm:w-[10%] pl-2 text-sm">
                    {index + 1}
                  </strong>
                  <Link
                    to={`/detail-booking/${item?.slug}`}
                    className="text-black w-[70%] text-base hover:text-[#036636] font-semibold"
                  >
                    {" "}
                    {item?.name}{" "}
                  </Link>
                  <strong className="w-[37%] sm:w-[20%] pl-2 text-base">
                    {item.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </strong>
                </li>
              ))}
            </ul>
          </div>
          <p className="mb-10 md:mb-0 mt-5 text-base">
            Quý khách có thể click vào từng dịch để xem chi tiết dịch vụ đó.
          </p>
        </div>

        <SideBar />
      </div>
    </section>
  );
};

export default PriceList;
