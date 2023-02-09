import { Button, Form, Input, message } from "antd";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { updatePass } from "../../api/user";
import { isAuthenticate } from "../../utils/LocalStorage";
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: "${label} không được bỏ trống!",
 
  types: {
    number: "${label} is not a valid number!",
    phone: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
    min : "${label} phải lớn hơn 8 kí tự.",
  },
};
/* eslint-enable no-template-curly-in-string */

const ChangePass = () => {
  const isUser = isAuthenticate();
  const [form] = Form.useForm();
  useEffect(() => {}, []);
  const onSubmit = async (data) => {
    await updatePass(isUser.token, data);
    localStorage.removeItem('user')
    
  };
  const onFinish = async (data) => {
    console.log(data);
    const dataPost = { ...data };
    try {
      await onSubmit(dataPost).then(() => {
        message.success("Cập nhật mật khẩu thành công.", 4);
      });
      // eslint-disable-next-line react/prop-types
    } catch (error) {
      message.error(`${error.response.data.message}`, 4);
    }
  };

  return (
    <>
      <div className="border border-[#00502b] rounded-md ">
        <h1 className="text-2xl py-2 px-10 bg-[#00502b] text-white rounded-t-md">
          Đổi mật khẩu
        </h1>
        <div className="py-[20px] pb-5">
          <Form
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
            validateMessages={validateMessages}
            form={form}
          >
            <Form.Item
              {...layout}
              name="currentPassword"
              label="Mật khẩu hiện tại"
            
              rules={[
                {
                  required: true,
                },

              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              {...layout}
              name="newPassword"
              label="Mật khẩu mới"
             
              rules={[
                {
                  required: true,
        
                },
                
                  {
                    min: 8,
                    message: `Mật khẩu mới phải lớn hơn 8 kí tự.`
                  }
              ]}
            >
              <Input.Password/>
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['newPassword']}
              label="Xác nhận mật khẩu "
              rules={[
                {
                  required: true,
                },
                {
                  min: 8,
                  message: `Mật khẩu xác nhận phải lớn hơn 8 kí tự.`
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không giống mật khẩu mới.'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
            
              wrapperCol={{
                ...layout.wrapperCol,
                offset: 4,
              }}
            >
              <Button className="mt-2 py-1 bg-[#0c8747] text-white" type="default"  htmlType="submit">
                Cập nhật mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ChangePass;
