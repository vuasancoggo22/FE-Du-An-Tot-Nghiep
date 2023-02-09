import React, { useEffect, useState } from "react";
import { Button, Col, Descriptions, Modal, Radio, Row } from "antd";
import { Checkbox } from "antd";
const ServiceModal = (props) => {
  //  Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    ChildServiceID(dataUptoForm);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // ----------------------------
  const [service, setService] = useState();
  let options = [];
  service?.map((item) => options.push({ value: item._id, label: item.name }));

  const [dataUptoForm, setdataUptoForm] = useState({});
  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
    setdataUptoForm(checkedValues);
  };

  const ChildServiceID = (e) => {
    props.ParentServiceId(e);
  };
  useEffect(() => {
    fetch(`http://localhost:5000/api/service`)
      .then((response) => response.json())
      .then((data) => setService(data.filter((item) => item.status !== 2)));
  }, []);
  return (
    <>
      <Button
        type="primary"
        style={{ backgroundColor: "#00502b", border: "none" }}
        onClick={showModal}
      >
        Danh sách dịch vụ
      </Button>
      <Modal
        title="Danh sách dịch vụ"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <Checkbox.Group style={{ width: "100%" }} onChange={onChange}>
          {service?.map((item) => {
            return (
              <Descriptions bordered title=" " size={"small"} key={item._id}>
                <Descriptions.Item
                  label={<Checkbox value={item._id}></Checkbox>}
                >
                  <span className="name">{item.name}</span>
                </Descriptions.Item>
                <Descriptions.Item className="price" label="Giá tiền">
                  <span className="ml-1 price">
                    {item.price.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            );
          })}
        </Checkbox.Group>
        {/* <Radio.Group
          options={options}
          onChange={onChange}
          buttonStyle="solid"
        /> */}
      </Modal>
    </>
  );
};

export default ServiceModal;
