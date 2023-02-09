import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  message,
  Tag,
  TimePicker,
  Modal,
} from "antd";
import moment from "moment";
import useEmployee from "../../hooks/use-employee";
import ServiceModal from "../../components/clients/ServiceModal";
import useBooking from "../../hooks/use-booking";
import { useNavigate } from "react-router-dom";
import { httpGetAllService, httpGetOneService } from "../../api/services";
import { isAuthenticate } from "../../utils/LocalStorage";
import { generateCaptcha } from "../../utils/GenerateCaptcha";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase/config";
import { httpAddBooking } from "../../api/booking";
import { socket } from "../../App";
import { SocketEvent } from "../../utils/SocketConstant";

import image from "../../../assets/img/image/1.jpg";
import image1 from "../../../assets/img/image/cham-soc-da-1.jpg";
import image2 from "../../../assets/img/image/GIAM-MO-BUNG.png";
import image3 from "../../../assets/img/image/nám.jpg";
import image4 from "../../../assets/img/image/tam trang.jpg";
import image5 from "../../../assets/img/image/xam may.jpg";
import image6 from "../../../assets/img/image/xoa xam.jpg";
import banner from "../../../assets/img/image/banner.jpg";
import SideBar from "./SideBar";

// ------------------------------------------------------------------------------------------------
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const validateMessages = {
  required: "${label} không được để trống!",
  types: {
    email: "${label} không đúng định dạng!",
    number: "${label} phải là chữ số!",
  },
  number: {
    range: "${label} từ ${min} đến ${max} tuổi",
  },
};
const format = "HH:00";

const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < moment().endOf("day");
};

// ------------------------------------------------------------------------------------------------

const BookingPage = () => {
  const onGetOtp = () => {
    generateCaptcha();
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        message.success("Gửi OTP thành công");
      })
      .catch((error) => {
        message.error(`${error.message}`, 2);
      });
    // time disabled
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[0] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[0] = false;
        return newLoadings;
      });
    }, 30000);

    // ---- time count down
  };

  const user = isAuthenticate();
  console.log(user);

  const getValueOtp = async (data) => {
    console.log("formsubmit", {
      ...formValues,
      services: servicePicked,
      bookingPrice,
    });
    try {
      const otp = data.otp;
      const confirmationResult = window.confirmationResult;
      const result = await confirmationResult.confirm(otp);
      const token = result._tokenResponse.idToken;
      console.log(token);
      const response = await httpAddBooking(
        token,
        {
          ...formValues,
          services: servicePicked,
          bookingPrice,
        },
        user?.id
      );
      const newNotification = {
        id: response._id,
        type: "admin",
        text: `Khách hàng ${response.name} đã đặt lịch,vui lòng xác nhận.`,
      };
      socket.emit(SocketEvent.NEWNOTIFICATION, newNotification);
      // message.success("Đặt lịch thành công", 2);

      // navigate("/");
      window.location.href = "/booked-success";
    } catch (error) {
      console.log("formsubmit", {
        ...formValues,
        services: servicePicked,
        bookingPrice,
      });
      console.log(error);
    }
  };
  const [form2] = Form.useForm();
  const { data: employees, error } = useEmployee();

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [servicePicked, setServicePicked] = useState([]);
  const [loadings, setLoadings] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formValues, setFormValues] = useState({});
  const [serviceDetail, setServiceDetail] = useState();
  const [serviceId, setServiceId] = useState([]);
  const [bookingPrice, setBookingPrice] = useState(0);

  const ParentServiceID = (id) => {
    setServiceId(id);
    getServiceName(id);
  };

  let total = 0;
  const getServiceName = async (id) => {
    try {
      if (id) {
        const data = await httpGetAllService();
        const fildata = data.filter((item) => {
          return (
            item._id === id[0] ||
            item._id === id[1] ||
            item._id === id[2] ||
            item._id === id[3] ||
            item._id === id[4] ||
            item._id === id[5] ||
            item._id === id[6] ||
            item._id === id[7] ||
            item._id === id[8] ||
            item._id === id[9] ||
            item._id === id[10] ||
            item._id === id[11] ||
            item._id === id[12] ||
            item._id === id[13] ||
            item._id === id[14] ||
            item._id === id[15] ||
            item._id === id[16] ||
            item._id === id[17] ||
            item._id === id[18] ||
            item._id === id[19] ||
            item._id === id[20]
          );
        });
        setServiceDetail([...fildata]);

        for (let i = 0; i < fildata.length; i++) {
          total += fildata[i].price;
        }
        setBookingPrice(total);
        console.log("total", total);
        const fill = fildata.map((item) => ({
          serviceId: item._id,
          price: item.price,
        }));
        setServicePicked(fill);

        console.log(servicePicked);
        console.log("data list service", fildata);
      }

      // serviceDetail.push(fildata);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    const phone = data.user.phoneNumber.replace("0", "+84");
    const dataValues = data.user;
    setFormValues(dataValues);
    setPhoneNumber(phone);
    setIsModalOpen(true);
  };

  const onRemoveService = (id) => {
    const newTags = serviceDetail.filter((item) => item._id !== id);
    setServiceDetail(newTags);

    for (let i = 0; i < newTags.length; i++) {
      total += newTags[i].price;
    }

    setBookingPrice(total);
    // setServiceId([]);
  };

  // ------------------------------------------------------------------------------------------------

  if (!employees) return <div>Loading...</div>;
  if (error) return <div>Failed to loading</div>;
  return (
    <>
      <div className="bg-[#01321f] py-[100px] ">
        <section>
          <div className="text-center text-[#FFF]">
            <h2 className="text-[#FFF] text-[50px]"> Đặt lịch</h2>
          </div>
        </section>
      </div>
      <div className="flex flex-col sm:flex-row max-w-[1200px] mx-auto gap-[20px] mt-10 px-[20px] lg:px-0">
        <div className="w-[100%] xxl:w-[75%]">
          <div className="border border-[#00502B] rounded-lg  ">
            <h3 className="text-2xl font-bold bg-[#00502B] text-white p-3 rounded-t-lg">
              Đặt lịch cùng Tuyến Spa
            </h3>
            <div className="mx-5 my-6 pr-16">
              <Form
                {...layout}
                name="nest-messages"
                validateMessages={validateMessages}
                initialValues={{
                  prefix: "84",
                }}
                onFinish={onSubmit}
              >
                {/* Tên */}
                <Form.Item
                  name={["user", "name"]}
                  label="Tên "
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder="Vui lòng nhập tên" />
                </Form.Item>
                {/* Tuổi */}
                <Form.Item
                  name={["user", "age"]}
                  label="Tuổi"
                  rules={[
                    {
                      type: "number",
                      min: 0,
                      max: 99,
                    },
                  ]}
                >
                  <InputNumber />
                </Form.Item>
                {/* SĐT */}
                <Form.Item
                  name={["user", "phoneNumber"]}
                  label="Số điện thoại"
                  rules={[
                    {
                      required: true,
                      pattern: new RegExp(/((9|3|7|8|5)+([0-9]{8})\b)/g),
                      message: "Số điện thoại không đúng định dạng!",
                    },
                  ]}
                >
                  <Input placeholder="Vui lòng điền số điện thoại" />
                </Form.Item>
                {/* Các dịch vụ */}
                <Form.Item label="Lựa chọn dịch vụ">
                  <ServiceModal ParentServiceId={ParentServiceID} />
                </Form.Item>
                {/* Chọn ngày đặt lich */}
                {serviceDetail ? (
                  <Form.Item label="Dịch vụ đã chọn">
                    <div className="border p-1">
                      <div className="">
                        {serviceDetail?.map((item) => (
                          <>
                            <Tag
                              closable
                              onClose={() => onRemoveService(item._id)}
                              key={item._id}
                            >
                              {item.name}
                            </Tag>
                          </>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <span>Tạm tính: </span>{" "}
                        <span className="font-semibold">
                          {bookingPrice?.toLocaleString("vi", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </div>
                    </div>
                  </Form.Item>
                ) : (
                  ""
                )}
                <Form.Item
                  name={["user", "date"]}
                  label="Chọn ngày"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD "
                    disabledDate={disabledDate}
                    size="large"
                  />
                </Form.Item>
                {/* chọn nhân viên */}
                <Form.Item
                  label="Chọn nhân viên"
                  name={["user", "employeeId"]}
                  rules={[
                    {
                      // required: true,
                    },
                  ]}
                >
                  <Select defaultValue="default">
                    <Select.Option disabled value="default">
                      Chọn nhân viên
                    </Select.Option>
                    {employees
                      ?.filter((item) => item.status === 1)
                      .map((item, index) => (
                        <Select.Option value={item._id} key={index}>
                          <div className="">{item.name}</div>
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                {/* chọn ca  */}
                <Form.Item label="Chọn giờ đến" name={["user", "time"]}>
                  <TimePicker format={format} />
                </Form.Item>
                {/* Ghi chú */}
                <Form.Item name={["user", "note"]} label="Ghi chú">
                  <Input.TextArea rows={4} placeholder="Để lại lời nhắn" />
                </Form.Item>
                {/* button */}
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                  <Button
                    type="primary"
                    style={{ backgroundColor: "#00502b", border: "none" }}
                    htmlType="submit"
                  >
                    Đặt lịch
                  </Button>
                </Form.Item>

                <Modal
                  title="Xác nhận số điện thoại"
                  onCancel={handleCancel}
                  open={isModalOpen}
                  footer={null}
                >
                  <>
                    {" "}
                    <Form form={form2} onFinish={getValueOtp} name="otpvalue">
                      <Form.Item name="otp" label="Mã xác nhận">
                        <Input style={{ width: "calc(100% - 200px)" }} />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          loading={loadings[0]}
                          onClick={onGetOtp}
                          type="primary"
                        >
                          Nhận mã
                        </Button>
                        <span id="seconds" className="text-red-600 ml-3"></span>
                      </Form.Item>
                      <Form.Item>
                        <Button success htmlType="submit">
                          Xác thực
                        </Button>
                      </Form.Item>
                    </Form>
                    <div id="recaptcha"></div>
                  </>
                </Modal>
              </Form>
            </div>
          </div>
        </div>
        <SideBar />
      </div>
    </>
  );
};

export default BookingPage;
