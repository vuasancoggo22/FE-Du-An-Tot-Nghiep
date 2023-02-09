import { Button, Modal, Tooltip, Space } from "antd";
import React, { useState } from "react";

const Description = (props) => {
  // eslint-disable-next-line react/prop-types
  const data = props.ondetail;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // chi tiết
  let BtWaitCursor;
  let BtWaitColor = "green";

  return (
    <>
      <Space>
        <Tooltip title="Chi tiết">
          <Button
            style={{
              border: "none",
              cursor: BtWaitCursor,
              color: BtWaitColor,
            }}
            shape="circle"
            onClick={showModal}
          >
            <i
              style={{ fontSize: "25px" }}
              data="0"
              className="fas fa-info-circle"
            ></i>
          </Button>
        </Tooltip>
      </Space>
      <Modal
        title="Chi tiết dịch vụ"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        className="modal-service"
      >
        <p>
          {" "}
          <div dangerouslySetInnerHTML={{ __html: data }}></div>
        </p>
      </Modal>
    </>
  );
};

export default Description;
