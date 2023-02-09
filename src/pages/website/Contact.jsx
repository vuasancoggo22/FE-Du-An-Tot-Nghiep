import React from "react";
import { Button, Form, Input, Row, Col, message } from "antd";
import { httpAddContact } from "../../api/contact";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/lib/input/TextArea";
import styles from "../../../assets/css/style.module.css";
// import { useRecoilValue } from "recoil";
// import { notificationState } from "../../recoil/notificationState";

function Contact() {
  // const count = useRecoilValue(notificationState);
  // console.log(count);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    var res = await httpAddContact(data);
    if (res._id !== undefined) {
      message.success("Cám ơn ban đã để lại lời nhắn !");
    }
    navigate("/contact");
  };
  const onFinish = async (data) => {
    const dataPost = { ...data };
    await onSubmit(dataPost);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <div>
        <div className="bg-[#f4f4f4] m-auto">
          <div className={styles.sectiondart}>
            <section className="py-[120px] ">
              <div className="text-center text-[#FFF]">
                <h2 className="text-[#FFF] text-[30px] ">
                  Để lại lời nhắn cho Tuyến Spa
                </h2>
                <p className="text-base">
                  Tuyến Spa luôn lắng nghe, luôn luôn thấu hiểu
                </p>
              </div>
            </section>
          </div>
          <div className="container m-auto " style={{ maxWidth: "1313px" }}>
            <div className="container m-auto lg:px-24">
              <section className="grid sm:grid-cols-1 md:grid-cols-2 m-auto gap-[20px]">
                <div className="bg-white text-center py-[40px] px-[100px] mt-[-60px] h-[350px] mb-[20px] col-span-1">
                  <button className="rounded-full bg-black px-[12px] py-[12px] ">
                    <i className="fa-solid fa-phone fa-2x text-white"></i>
                  </button>
                  <h2 className="text-lg font-bold leading-7 text-center text-[#01321f] mt-4">
                    Tư vấn{" "}
                  </h2>
                  <p className="mt-4 text-base">
                    Tư vấn về các dịch vụ làm đẹp tại Tuyến Spa
                  </p>
                  <div className="">
                    <div>
                      <button className="bg-[#00502b] px-[8px] py-[8px] text-white hover:bg-[#01321f] mt-4 text-lg font-semibold">
                        {" "}
                        <i className="fa-solid fa-comments fa-1x text-white px-[10px]"></i>{" "}
                        <a
                          className="text-white hover:text-white"
                          href="tel:+84 844557788"
                        >
                          (028) 4455 7788
                        </a>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-white text-center py-[40px] px-[100px] mt-[-60px] h-[350px] mb-[20px] col-span-1 ">
                  <button className="rounded-full bg-black px-[10px] py-[13px]">
                    <i className="fa-solid fa-comments fa-2x text-white"></i>
                  </button>
                  <h2 className="text-lg font-bold leading-7 text-center text-[#01321f] mt-4">
                    Chăm sóc{" "}
                  </h2>
                  <p className="mt-4 text-base">
                    Lắng nghe, thay đổi để phát triển
                  </p>
                  <div className="">
                    <div>
                      <button className="bg-[#00502b] px-[8px] py-[8px] text-white hover:bg-[#01321f] mt-4 text-lg font-semibold">
                        {" "}
                        <i className="fa-solid fa-comments fa-1x text-white px-[10px]"></i>{" "}
                        <a
                          className="text-white hover:text-white"
                          href="tel:+84 866824564"
                        >
                          0866 824 564
                        </a>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div className="container mx-auto lg:px-24 mb-4">
              <div className="bg-white w-full shadow rounded p-8 sm:p-12 ">
                <p className="text-2xl text-green-700 font-bold leading-7 text-center ">
                  Để lại lời nhắn cho Tuyến Spa
                </p>
                <div className="register-right -mt-7">
                  <div className="form-wrapper block bg-white mt-12">
                    <Form
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                      autoComplete="off"
                      layout="vertical"
                    >
                      <Row className="w-2/3 block mx-auto">
                        <Col className="w-full">
                          <Row>
                            <Col className="w-full">
                              <Form.Item
                                label="Họ tên"
                                name="name"
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập họ tên của bạn !",
                                  },
                                ]}
                                style={{ marginRight: "10px" }}
                              >
                                <Input placeholder="Họ và tên" />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="w-full">
                              <Form.Item
                                label="Địa chỉ"
                                name="address"
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập địa chỉ của bạn !",
                                  },
                                ]}
                                style={{ marginRight: "10px" }}
                              >
                                <Input placeholder="Địa chỉ" />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="w-full">
                              <Form.Item
                                label="Số điện thoại"
                                name="phoneNumber"
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      "Vui lòng nhập số điện thoại của bạn !",
                                  },
                                ]}
                                style={{ marginRight: "10px" }}
                              >
                                <Input placeholder="Số điện thoại" />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="w-full">
                              <Form.Item
                                label="Nội dung"
                                name="content"
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập nội dung của bạn !",
                                  },
                                ]}
                                style={{ marginRight: "10px" }}
                              >
                                <TextArea
                                  placeholder="Nội dung"
                                  className="form-input"
                                  type=""
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Form.Item>
                        <Button
                          htmlType="submit"
                          className="w-[15%] block m-12 ml-[16.5%]"
                          style={{
                            backgroundColor:
                              "rgb(20 80 45 / var(--tw-bg-opacity))",
                            fontSize: "15px",
                            fontWeight: "bold",
                            color: "white",
                          }}
                        >
                          Gửi
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
            <div className="map container mx-auto lg:px-24 mb-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14896.602629703322!2d105.7703402!3d21.026657000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455c2ee01a76b%3A0xb118ceaa0cb97f16!2zU8OibiBiw7NuZyBN4bu5IMSQw6xuaCAy!5e0!3m2!1sen!2s!4v1663950191361!5m2!1sen!2s"
                width="100%"
                height="450"
                allowfullscreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
