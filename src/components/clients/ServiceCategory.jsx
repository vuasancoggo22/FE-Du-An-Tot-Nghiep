import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { httpGetAllService } from "../../api/services";

const ServiceCategory = () => {
  const [service, setService] = React.useState([]);

  useEffect(() => {
    const service = async () => {
      const res = await httpGetAllService();
      setService(res.filter((item) => item.status !== 0));
    };
    service();
  }, []);
  return (
    <>
      <div className="flex flex-wrap gap-5">
        {service?.map((item) => (
          <div className="w-[30%] " key={item?._id}>
            <Link to={`/detail-booking/${item?.slug}`}>
              <img
                src={item?.image}
                alt="Ảnh dịch vụ"
                className="m-auto object-cover"
                width="70%"
              />
              <div className="text-center py-[10px] font-semibold text-black hover:text-[#00502b] text-[15px]">
                <button>{item?.name}</button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default ServiceCategory;
