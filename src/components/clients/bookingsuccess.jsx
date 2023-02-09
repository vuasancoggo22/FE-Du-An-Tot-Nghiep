import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
const Bookingsuccess = () => {
  const route = useNavigate();
  return (
    <div className="my-20">
      <Result
        status="success"
        title="Cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi!"
        subTitle="Đơn hàng của bạn đã được đặt thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất."
        extra={[
          <Button
            type="primary"
            key="console"
            onClick={() => {
              route("/");
            }}
          >
            Về trang chủ
          </Button>,
        ]}
      />
    </div>
  );
};

export default Bookingsuccess;
