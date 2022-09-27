import React, { useState } from "react";
import EmployeeModal from "../../components/clients/EmployeeModal";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  DatePicker,
} from "antd";
import moment from "moment";
import useEmployee from "../../hooks/use-employee";
import { useEffect } from "react";
// ------------------------------------------------------------------------------------------------
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const { Option } = Select;
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
const options = [
  {
    label: "dich vu 1",
    value: "1",
  },
  {
    label: "dich vu 2",
    value: "2",
  },
  {
    label: "dich vu 3",
    value: "3",
  },
];
const onChange = (checkedValues) => {
  console.log("checked = ", checkedValues);
};
const onOk = (value) => {
  console.log("onOk: ", value);
};
const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < moment().endOf("day");
};

// const { RangePicker } = DatePicker;

// const range = (start, end) => {
//   const result = [];

//   for (let i = start; i < end; i++) {
//     result.push(i);
//   }

//   return result;
// };

const prefixSelector = (
  <Form.Item name="prefix" noStyle>
    <Select
      style={{
        width: 70,
      }}
    >
      <Option value="84">+84</Option>
      <Option value="87">+87</Option>
    </Select>
  </Form.Item>
);
// ------------------------------------------------------------------------------------------------

const BookingPage = () => {
  const { data: employees, error, create } = useEmployee();
  console.log(employees);
  const onSubmit = (data) => {
    console.log("submit", data.user.name);
  };
  const onChange1 = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
    // console.log(moment(dateString).format("X"));
    // const query = moment(dateString).format("X");
    // console.log(a);
    // const a = getEmployeeByBookingDays(1063040400);
    // setShift(a);
  };
  // console.log(shift);
  // ------------------------------------------------------------------------------------------------
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const onChangeSelected = (value) => {
    setId(value);
  };
  const onHandleAdd = (value) => {
    console.log("cha:", value);
  };
  // ------------------------------------------------------------------------------------------------
  // useEffect(() => {
  //   create({
  //     name: "test api",
  //     idCard: "071092429",
  //     email: "test@gmail.com",
  //     phoneNumber: "0384765294",
  //     status: 1,
  //     gender: 1,
  //     timeWork: [
  //       {
  //         date: 1664064000,
  //         shiftId: "6329f25081117054d459f8d4",
  //         status: 1,
  //         _id: "632e8eac33bb1bbd4bb1cf61",
  //       },
  //       {
  //         date: 1664064000,
  //         shiftId: "632a8c6a38f01fd54692a984",
  //         status: 1,
  //         _id: "632e8eca33bb1bbd4bb1cf6a",
  //       },
  //       {
  //         date: 166199040,
  //         shiftId: "6329f29881117054d459f8d6",
  //         status: 1,
  //         _id: "632e903922d4ffb59e132fd7",
  //       },
  //     ],
  //   });
  // }, []);
  if (!employees) return <div>Loading...</div>;
  if (error) return <div>Failed to loading</div>;
  return (
    <div className="my-10 ">
      <div className="w-[700px] m-auto">
        <div className="border border-[#00502B] rounded-lg  ">
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
                  prefix: "+84",
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
                  <Input />
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

                {/* Email */}
                <Form.Item
                  name={["user", "email"]}
                  label="Email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                {/* SĐT */}
                <Form.Item
                  name={["user", "phone"]}
                  label="Số điện thoại"
                  rules={[
                    {
                      required: true,
                      // type: "phone",
                      // message: "Please input your phone number!",
                    },
                  ]}
                >
                  <Input
                    addonBefore={prefixSelector}
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>

                {/* Các dịch vụ */}
                <Form.Item
                  name={["user", "oders"]}
                  label="Lựa chọn dịch vụ"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Checkbox.Group options={options} onChange={onChange} />
                </Form.Item>

                {/* Chọn ngày đặt lich */}
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
                    disabledDate={disabledDate}
                    onChange={onChange1}
                    onOk={onOk}
                  />
                </Form.Item>

                {/* chọn nhân viên */}
                <Form.Item
                  label="Chọn nhân viên"
                  name={["user", "employees"]}
                  rules={[
                    {
                      // required: true,
                    },
                  ]}
                >
                  <Select onChange={onChangeSelected}>
                    {employees?.map((item, index) => (
                      <Select.Option value={item._id} key={index}>
                        {item.name}
                        <div
                          className=""
                          onClick={() => {
                            setOpen(true);
                          }}
                        >
                          {item.name}
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* chọn ca  */}
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                  <EmployeeModal id={id} open={open} />
                </Form.Item>
                {/* Ghi chú */}
                <Form.Item name={["user", "note"]} label="Ghi chú">
                  <Input.TextArea />
                </Form.Item>

                {/* button */}
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                  <Button type="primary" htmlType="submit">
                    Đặt lịch
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
