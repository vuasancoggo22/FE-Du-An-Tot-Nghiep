import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Upload,
  Modal
} from "antd";
import { useLocalStorage } from "react-use";
import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/user";
import { isAuthenticate } from "../../utils/LocalStorage";
import ImgCrop from "antd-img-crop";
import { uploadCloudinary } from "../../api/upload";

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
  required: "${label} is required!",
  types: {
    number: "${label} is not a valid number!",
    phone: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};
/* eslint-enable no-template-curly-in-string */

const Userinformation = (props) => {
  const [isUpdateImg,setIsUpdateImg] = useState(true)
  const [header, setHeader, remove] = useLocalStorage('userHeader');
  const user = isAuthenticate();
  const [form] = Form.useForm();
  const [url, setUrl] = useState("");
  useEffect(() => {
    const getProfiles = async () => {
      const datauser = await getProfile(user.token);
      console.log("log profile :", datauser);
      setFileList([{ url: datauser.avatar }]);
      form.setFieldsValue({
        name: datauser?.name,
        address: datauser?.address,
        age: datauser?.age,
        gender: datauser?.gender,
        avatar: datauser?.avatar,
      });
    };

    getProfiles();
  }, []);


  const [fileList, setFileList] = useState([]);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = async (data) => {
    const dataPost = { ...data, avatar: url };
    try {
      Modal.confirm({
        title: 'Bạn có chắc chắn muốn cập nhật thông tin tài khoản không ?',
        onOk: async () => {
          updateProfile(user.token, dataPost).then((data) => {
            message.success("Cập nhật thông tin tài khoản thành công.", 4);
            const userHeader = {
              name :data.name,
              avatar :data.avatar
            }
            setHeader(userHeader)
          })
          .catch(error =>{
            message.error("Không thể cập nhật tài khoản", 4)
          })
         
          // eslint-disable-next-line react/prop-types
          props.updateSuccess()
        }
      })
   
    } catch (error) {
      message.error(`${error.response.data.message}`, 4);
    }
  };

  const uploadImage = async (options) => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "my_upload");
    try {
      setIsUpdateImg(false)
      const res = await uploadCloudinary(formData);
      onSuccess("Ok");
      message.success("Tải lên ảnh đại diện thành công !");
      setIsUpdateImg(true)
      setUrl(res.data.secure_url);
    } catch (err) {
      onError({ err });
    }
  };
 

  return (
    <>
      <div className="border border-[#00502b] rounded-md ">
        <h1 className="text-2xl py-2 px-10 bg-[#00502b] text-white rounded-t-md">
          Thông tin tài khoản
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
              name="name"
              label="Tên người dùng"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="age"
              label="Tuổi"
              rules={[
                {
                  type: "number",
                  min: 1,
                  max: 99,
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item label="Giới tính" name="gender">
              <Select>
                <Select.Option value={0}>Nam</Select.Option>
                <Select.Option value={1}>Nữ</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ">
              <Input />
            </Form.Item>
            <Form.Item label="Ảnh đại diện">
              <ImgCrop>
                <Upload
                  customRequest={uploadImage}
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  name="avatar"
                >
                  {fileList.length < 1 && "+ Upload"}
                </Upload>
              </ImgCrop>
            </Form.Item>

           <div className="mr-[500px]">
           <Form.Item
              wrapperCol={{
                ...layout.wrapperCol,
                offset: 8,
              }}
            >
               {isUpdateImg   ?
                <Button  className="bg-[#0c8747] text-white"  htmlType="submit">
              Cập nhật tài khoản
             </Button>
               
             :
             <Button disabled className="bg-gray-500 text-white"  htmlType="submit">
               Đang cập nhật ảnh
             </Button>
              }
            </Form.Item>
           </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Userinformation;
