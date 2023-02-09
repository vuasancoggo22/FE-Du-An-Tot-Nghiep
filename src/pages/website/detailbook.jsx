import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, DatePicker, message, Modal } from "antd";
import useEmployee from "../../hooks/use-employee";
import { httpGetOne } from "../../api/employee";
import { httpAddBooking } from "../../api/booking";
import { useNavigate, useParams } from "react-router-dom";
import { getSerViceBySlug, httpGet } from "../../api/services";
import { TimePicker } from "antd";
import { isAuthenticate } from "../../utils/LocalStorage";
import Formcomment from "../../components/clients/comment";
import { generateCaptcha } from "../../utils/GenerateCaptcha";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase/config";
import { socket } from "../../App";
import { SocketEvent } from "../../utils/SocketConstant";
const Detaibooking = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: employees, error } = useEmployee();
  // const [employeeBooking, setEmployeeBooking] = useState();
  const [service, setService] = useState();
  const [formData, setFormData] = useState();
  const [titleModal, setTitleModal] = useState();
  // eslint-disable-next-line react/prop-types
  const [timeReload, setTimeReload] = useState(props.countDown);
  const [titleStatusConfirm, setTitleStatusConfirm] = useState(
    "Vui lòng chờ trong giây lát"
  );
  const [feedback, setFeedback] = useState();
  const format = "HH";
  const user = isAuthenticate();

  // eslint-disable-next-line react/prop-types
  const countDown = props.countDown;

  const getValueOtp = (data) => {
    const otp = data.otp;
    const confirmationResult = window.confirmationResult;
    confirmationResult
      .confirm(otp)
      .then(async (result) => {
        console.log(result._tokenResponse.idToken);
        const token = result._tokenResponse.idToken;
        const response = await httpAddBooking(
          token,
          {
            ...formData,
            services: { serviceId: service._id, price: service.price },
            bookingPrice: service.price,
            status: 0,
          },
          user?.id
        );
        const newNotification = {
          id: response._id,
          type: "admin",
          text: `Khách hàng ${response.name} đã đặt lịch,vui lòng xác nhận.`,
        };
        message.success("Đặt lịch thành công", 2);
        socket.emit(SocketEvent.NEWNOTIFICATION, newNotification);
        navigate("/");
      })
      .catch((error) => {
        setTitleStatusConfirm("Đặt lịch thất bại, mời thao tác lại sau");
        // eslint-disable-next-line react/prop-types
        props.handleSetCountDown();
        let timeDown = 60;
        message.error(`${error.message}`, 2);
        const timerId = setInterval(() => {
          setTimeReload(--timeDown);
          if (timeDown == 0) {
            clearInterval(timerId);
            setIsModalOpen(false);
            setTimeReload("");
          }
        }, 1000);

        message.error(`${error.message}`, 2);
      });
  };

  function formatCash(str) {
    const string = str.toString();
    return string
      .split("")
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + ",") + prev;
      });
  }

  const onSubmit = async (data) => {
    setTitleModal("Mã xác nhận sẽ được gửi về số " + data.phoneNumber);
    setTitleStatusConfirm("Vui lòng chờ trong giây lát");
    await setIsModalOpen(true);
    generateCaptcha();
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(
      auth,
      data.phoneNumber.replace("0", "+84"),
      appVerifier
    )
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        message.success("Gửi OTP thành công");
        setTitleStatusConfirm("Mã xác nhận đã gửi thành công");
        console.log("success");
      })
      .catch((error) => {
        // eslint-disable-next-line react/prop-types
        props.handleSetCountDown();
        setTitleStatusConfirm("Gửi mã xác thực thất bại, mời thao tác lại sau");
        let timeDown = 60;
        message.error(`${error.message}`, 2);
        const timerId = setInterval(() => {
          setTimeReload(--timeDown);
          if (timeDown == 0) {
            clearInterval(timerId);
            setIsModalOpen(false);
            setTimeReload("");
          }
        }, 1000);
      });
    setFormData(data);
  };
  const onChange = (time, timeString) => {
    console.log(time, timeString);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // console.log(user);
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
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const onOk = (value) => {
    console.log("onOk: ", value);
  };
  const onChange1 = (value) => {
    console.log("Selected Time: ", value);
  };

  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(false);
  const onChangeSelected = async (e) => {
    console.log(e);
    // await setEmployeeBooking(employees[e]);
    const employeesOne = await httpGetOne(e);
    console.log(employeesOne);
    // setEmployeeBooking(employeesOne);
    if (!employees) return <div>Loading...</div>;
    if (error) return <div>Failed to loading</div>;
  };
  const onHandleAdd = (value) => {
    console.log("cha:", value);
  };

  useEffect(() => {
    const getSerVice = async () => {
      const data = await getSerViceBySlug(id);
      const feedbackData = await httpGet("/feedback/service", data._id);
      setFeedback(feedbackData);
      setService(data);
    };
    getSerVice();
  }, [feedback]);

  useEffect(() => {
    if (countDown > 0) {
      let timeDown = countDown;
      const timerId = setInterval(() => {
        // eslint-disable-next-line react/prop-types
        setTimeReload(--timeDown);
        if (timeDown == 0) {
          clearInterval(timerId);
          setTimeReload("");
        }
      }, 1000);
    } else if (localStorage.getItem("countDown")) {
      let timeDown = localStorage.getItem("countDown");
      const timerId = setInterval(() => {
        // eslint-disable-next-line react/prop-types
        setTimeReload(--timeDown);
        if (timeDown == 0) {
          clearInterval(timerId);
          setTimeReload("");
          localStorage.removeItem("countDown");
        }
      }, 1000);
    }
  }, []);
  return (
    <>
      <div className="mb-10 bg-[url('https://beautyspa4.shostweb.com/wp-content/uploads/2021/11/cole-keister-8V1gfeaPP1Y-unsplash.jpg')] b-centerg bg-no-repeat bg-cover py-[100px] ">
        <section>
          <div className="text-center text-[#FFF]">
            <h2 className="text-[#FFF] text-[30px]">
              {" "}
              <span className="uppercase text-white font-medium">
                {service?.name}
              </span>
            </h2>
          </div>
        </section>
      </div>
      <div className="flex flex-col-reverse md:flex-row max-w-[1200px] gap-[20px] mx-auto px-[20px] lg:px-0">
        <div className="w-[100%] md:w-[50%] flex justify-center text-[16px]">
          {" "}
          <div dangerouslySetInnerHTML={{ __html: service?.description }}></div>
        </div>
        <div className="w-[100%] md:w-[50%]">
          <div className="border border-[#00502B] rounded-lg">
            <h3 className="text-2xl font-bold bg-[#00502B] text-white p-3 rounded-t-lg">
              Đặt lịch
            </h3>
            <div className="m-5">
              <div className="mx-5">
                <Form
                  onAdd={onHandleAdd}
                  {...layout}
                  name="nest-messages"
                  validateMessages={validateMessages}
                  initialValues={{
                    phoneNumber: user?.phoneNumber,
                    name: user?.name,
                    prefix: "+84",
                  }}
                  onFinish={onSubmit}
                >
                  {/* Tên */}
                  <Form.Item
                    name="name"
                    label="Tên "
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  {/* Tên */}

                  {/* SĐT */}
                  <Form.Item
                    name="phoneNumber"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        pattern: new RegExp(/((9|3|7|8|5)+([0-9]{8})\b)/g),
                        message: "Số điện thoại không đúng định dạng!",
                      },
                    ]}
                  >
                    <Input
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="service"
                    label="Dịch vụ "
                    rules={[
                      {
                        // eslint-disable-next-line no-undef
                      },
                    ]}
                  >
                    <Input
                      value={service?._id}
                      placeholder={service?.name}
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item
                    name="servicePrice"
                    label="Giá tiền"
                    rules={[
                      {
                        // eslint-disable-next-line no-undef
                      },
                    ]}
                  >
                    <Input
                      value={service?.price}
                      placeholder={
                        service?.price ? formatCash(service?.price) : ""
                      }
                      readOnly
                    />
                  </Form.Item>
                  {/* chọn nhân viên */}
                  {/* <Form.Item
                  label="Chọn dịch vụ"
                  name={["user", "employees"]}
                  rules={[
                    {
                      // required: true,
                    },
                  ]}
                >
                  <Select onChange={onChangeSelected}>
                    <Checkbox onChange={onChange}>Checkbox</Checkbox>
                  </Select>
                </Form.Item> */}
                  {/* Các dịch vụ */}

                  {/* Chọn ngày đặt lich */}
                  <Form.Item
                    name="date"
                    label="Chọn ngày"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <DatePicker
                      // disabledDate={disabledDate}
                      onChange={onChange1}
                      onOk={onOk}
                    />
                  </Form.Item>

                  {/* chọn nhân viên */}
                  <Form.Item label="Chọn nhân viên" name="employeeId">
                    <Select onChange={onChangeSelected}>
                      {employees?.map((item, index) => {
                        if (item.status == 1) {
                          return (
                            <Select.Option value={item._id} key={index}>
                              {item.name}
                              <div
                                className=""
                                // onClick={() => {
                                //   setOpen(true);
                                // }}
                              ></div>
                            </Select.Option>
                          );
                        } else {
                          return;
                        }
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Chọn giờ đến"
                    name="time"
                    // rules={[
                    //   {
                    //     required: true,
                    //   },
                    // ]}
                  >
                    {/* <Select onChange={onChangeSelected}>
                      {shift?.map((item, index) => {
                        let checkIs = true;

                        employeeBooking?.timeWork.map((itemStaff) => {
                          if (itemStaff.date === dateBooking) {
                            if (item._id === itemStaff.shiftId) checkIs = false;
                            return;
                          }
                        });
                        if (checkIs)
                          return (
                            <Select.Option value={item._id} key={index}>
                              {item.shiftName +
                                "(" +
                                item.timeStart +
                                "-" +
                                item.timeEnd +
                                ")"}
                              <div
                                className=""
                                // onClick={() => {
                                //   setOpen(true);
                                // }}
                              ></div>
                            </Select.Option>
                          );
                      })}
                    </Select> */}
                    <TimePicker onChange={onChange} format={format} />
                  </Form.Item>
                  {/* chọn ca  */}
                  <Form.Item name="note" label="Ghi chú">
                    <Input.TextArea rows={4} />
                  </Form.Item>
                  <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button
                      type="primary"
                      style={{ backgroundColor: "#00502b", border: "none" }}
                      htmlType="submit"
                      disabled={timeReload > 0 ? true : false}
                    >
                      Đặt lịch
                    </Button>
                    <span style={{ color: "red", marginLeft: "5px" }}>
                      {timeReload > 0 ? timeReload + "s" : ""}
                    </span>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="formcomment max-w-[1200px] m-auto">
        <div className="">
          <Formcomment serviceId={service?._id} feedbackData={feedback} />
        </div>
      </div>
      <Modal
        footer={false}
        title={titleModal}
        onCancel={handleCancel}
        open={isModalOpen}
      >
        <>
          <p
            style={{
              color:
                titleStatusConfirm == "Mã xác nhận đã gửi thành công"
                  ? "green"
                  : titleStatusConfirm == "Vui lòng chờ trong giây lát"
                  ? "black"
                  : "red",
            }}
          >
            * {titleStatusConfirm + " "}
            {timeReload != "" ? timeReload + "s" : ""}
          </p>
          <Form className="mt-10" onFinish={getValueOtp} name="otpvalue">
            <Form.Item
              name="otp"
              label="Mã xác nhận"
              rules={[
                {
                  required: "true",
                  message: "Bắt buộc nhập",
                },
              ]}
            >
              <Input style={{ width: "calc(100% - 200px)" }} />
            </Form.Item>
            {/* <Form.Item>
            <Button type="primary" onClick={onGetOtp}>Nhận mã</Button>
          </Form.Item> */}
            <Form.Item>
              <Button
                disabled={timeReload > 0 ? true : false}
                success
                htmlType="submit"
              >
                Xác thực
              </Button>
            </Form.Item>
          </Form>
          <div id="recaptcha"></div>
        </>
      </Modal>
    </>
  );
};

export default Detaibooking;
