import { Descriptions, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userHistory } from "../../../api/booking";
import { isAuthenticate } from "../../../utils/LocalStorage";
import moment from "moment";
const UserHistory = () => {
  const user = isAuthenticate();
  const id = user?.id;
  const [history, setHistory] = useState([]);
  const [unconfirmBooking, setUnconfirmBooking] = useState([]);
  const [confirmBooking, setConfirmBooking] = useState([]);
  const [cancelBooking, setCancelBooking] = useState([]);
  const [successBooking, setSuccessBooking] = useState([]);
  useEffect(() => {
    const getUserHistory = async () => {
      try {
        const data = await userHistory(id);
        console.log(data);
        setHistory(data);
        setUnconfirmBooking(data.filter((item) => item.status == 0));
        setConfirmBooking(data.filter((item) => item.status == 1));
        setCancelBooking(data.filter((item) => item.status == 2));
        setSuccessBooking(data.filter((item) => item.status == 4));
      } catch (error) {
        console.log(error);
      }
    };
    getUserHistory();
  }, [id]);
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      <div className="border border-[#00502b] rounded-md ">
        <h1 className="text-2xl py-2 px-10 bg-[#00502b] text-white rounded-t-md">
          Lịch sử đặt lịch
        </h1>
        <div className="px-10 pb-5  ">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane
              tab="Chờ xác nhận"
              key="1"
              className="overflow-auto max-h-screen"
            >
              {unconfirmBooking.map((item) => {
                return (
                  <Descriptions
                    key={item._id}
                    bordered
                    title="Chờ xác nhận"
                    size="middle"
                  >
                    <div>
                      <div className="mb-2">
                        Tên khách hàng :{" "}
                        <span className="font-semibold">{item.name}</span>{" "}
                      </div>
                      <div>
                        Tên nhân viên :{" "}
                        <span className="font-semibold">
                          {item.employeeId?.name}
                        </span>{" "}
                      </div>
                    </div>
                    <div>
                      Số điện thoại :{" "}
                      <span className="font-semibold">{item.phoneNumber}</span>
                    </div>
                    <div className="">
                         <div className="mb-2">
                      Ngày đặt :{" "}
                      <span className="font-semibold">
                        {formatDate(item.date)}
                      </span>{" "}
                      </div>
                      <div>
                      Giờ đặt :{" "}
                      <span className="font-semibold">
                        {moment(item.time).format("HH:mm")}
                      </span>{" "}
                      </div>
                    </div>

                    <div>
                      Ghi chú :{" "}
                      <p>
                        {item.note || (
                          <span className="font-semibold">
                            Không có ghi chú
                          </span>
                        )}
                      </p>{" "}
                    </div>
                    <div>
                      {item.services.map((service) => {
                        return (
                          <div key={service._id} className="mb-4">
                            <div className="mb-2">
                              Tên dịch vụ :{" "}
                              <span className="font-semibold">
                                {service.serviceId?.name}
                              </span>
                            </div>
                            <div className="mb-2">
                              Giá :{" "}
                              <span className="font-semibold">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(service.price)}
                              </span>{" "}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      <span>Tổng giá : {item.bookingPrice}</span>
                    </div>
                    <div>
                      Tổng giá :{" "}
                      <span className="font-semibold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.bookingPrice)}
                      </span>{" "}
                    </div>
                  </Descriptions>
                );
              })}
            </Tabs.TabPane>
            <Tabs.TabPane
              tab="Đã xác nhận"
              key="2"
              className="overflow-auto max-h-screen"
            >
              {confirmBooking.map((item) => {
                return (
                  <Descriptions
                    key={item._id}
                    bordered
                    title="Đã xác nhận"
                    size="middle"
                  >
                    <div>
                      <div className="mb-2">
                        Tên khách hàng :{" "}
                        <span className="font-semibold">{item.name}</span>{" "}
                      </div>
                      <div>
                        Tên nhân viên :{" "}
                        <span className="font-semibold">
                          {item.employeeId?.name}
                        </span>{" "}
                      </div>
                    </div>
                    <div>
                      Số điện thoại :{" "}
                      <span className="font-semibold">{item.phoneNumber}</span>
                    </div>
                    <div className="">
                         <div className="mb-2">
                      Ngày đặt :{" "}
                      <span className="font-semibold">
                        {formatDate(item.date)}
                      </span>{" "}
                      </div>
                      <div>
                      Giờ đặt :{" "}
                      <span className="font-semibold">
                        {moment(item.time).format("HH:mm")}
                      </span>{" "}
                      </div>
                    </div>

                    <div>
                      Ghi chú :{" "}
                      <p>
                        {item.note || (
                          <span className="font-semibold">
                            Không có ghi chú
                          </span>
                        )}
                      </p>{" "}
                    </div>
                    <div>
                      {item.services.map((service) => {
                        return (
                          <div key={service._id} className="mb-4">
                            <div className="mb-2">
                              Tên dịch vụ :{" "}
                              <span className="font-semibold">
                                {service.serviceId?.name}
                              </span>
                            </div>
                            <div className="mb-2">
                              Giá :{" "}
                              <span className="font-semibold">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(service.price)}
                              </span>{" "}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      Tổng giá :{" "}
                      <span className="font-semibold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.bookingPrice)}
                      </span>{" "}
                    </div>
                  </Descriptions>
                );
              })}
            </Tabs.TabPane>
            <Tabs.TabPane
              tab="Đã huỷ"
              key="3"
              className="overflow-auto max-h-screen"
            >
              {cancelBooking.map((item) => {
                return (
                  <Descriptions
                    key={item._id}
                    bordered
                    title="Đã huỷ"
                    size="middle"
                  >
                    <div>
                      <div className="mb-2">
                        Tên khách hàng :{" "}
                        <span className="font-semibold">{item.name}</span>{" "}
                      </div>
                      <div>
                        Tên nhân viên :{" "}
                        <span className="font-semibold">
                          {item.employeeId?.name}
                        </span>{" "}
                      </div>
                    </div>
                    <div>
                      Số điện thoại :{" "}
                      <span className="font-semibold">{item.phoneNumber}</span>
                    </div>
                    <div className="">
                         <div className="mb-2">
                      Ngày đặt :{" "}
                      <span className="font-semibold">
                        {formatDate(item.date)}
                      </span>{" "}
                      </div>
                      <div>
                      Giờ đặt :{" "}
                      <span className="font-semibold">
                        {moment(item.time).format("HH:mm")}
                      </span>{" "}
                      </div>
                    </div>

                    <div>
                      Ghi chú :{" "}
                      <p>
                        {item.note || (
                          <span className="font-semibold">
                            Không có ghi chú
                          </span>
                        )}
                      </p>{" "}
                    </div>
                    <div>
                      {item.services.map((service) => {
                        return (
                          <div key={service._id} className="mb-4">
                            <div className="mb-2">
                              Tên dịch vụ :{" "}
                              <span className="font-semibold">
                                {service.serviceId?.name}
                              </span>
                            </div>
                            <div className="mb-2">
                              Giá :{" "}
                              <span className="font-semibold">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(service.price)}
                              </span>{" "}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      Tổng giá :{" "}
                      <span className="font-semibold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.bookingPrice)}
                      </span>{" "}
                    </div>
                  </Descriptions>
                );
              })}
            </Tabs.TabPane>
            <Tabs.TabPane
              tab="Đã hoàn thành"
              key="4"
              className="overflow-auto max-h-screen"
            >
              {successBooking.map((item) => {
                return (
                  <Descriptions
                    key={item._id}
                    bordered
                    title="Đã hoàn thành"
                    size="middle"
                  >
                    <div>
                      <div className="mb-2">
                        Tên khách hàng :{" "}
                        <span className="font-semibold">{item.name}</span>{" "}
                      </div>
                      <div>
                        Tên nhân viên :{" "}
                        <span className="font-semibold">
                          {item.employeeId?.name}
                        </span>{" "}
                      </div>
                    </div>
                    <div>
                      Số điện thoại :{" "}
                      <span className="font-semibold">{item.phoneNumber}</span>
                    </div>
                    <div className="">
                      <div className="mb-2">
                      Ngày đặt :{" "}
                      <span className="font-semibold">
                        {formatDate(item.date)}
                      </span>{" "}
                      </div>
                      <div>
                      Giờ đặt :{" "}
                      <span className="font-semibold">
                        {moment(item.time).format("HH:mm")}
                      </span>{" "}
                      </div>
                    </div>

                    <div>
                      Ghi chú :{" "}
                      <p>
                        {item.note || (
                          <span className="font-semibold">
                            Không có ghi chú
                          </span>
                        )}
                      </p>{" "}
                    </div>
                    <div>
                      {item?.services.map((service) => {
                        return (
                          <div key={service._id} className="mb-4">
                            <div className="mb-2">
                              Tên dịch vụ :{" "}
                              <Link
                                to={`/detail-booking/${service.serviceId.slug}`}
                                className="font-semibold"
                              >
                                {service.serviceId?.name}
                              </Link>
                            </div>
                            <div className="mb-2">
                              Giá :{" "}
                              <span className="font-semibold">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(service.price)}
                              </span>{" "}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      Tổng giá :{" "}
                      <span className="font-semibold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.bookingPrice)}
                      </span>{" "}
                    </div>
                  </Descriptions>
                );
              })}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default UserHistory;
