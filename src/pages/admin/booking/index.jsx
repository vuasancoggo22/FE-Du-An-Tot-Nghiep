/* eslint-disable no-const-assign */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
import React, { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  Inject,
  ExcelExport,
} from "@syncfusion/ej2-react-grids";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  TimePicker,
} from "antd";
import {
  bookingAddByEmployeeApi,
  httpGetAll,
  httpGetChangeStatus,
} from "../../../api/booking";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { ChangeToSlug } from "../../../utils/ConvertStringToSlug";
import { isAuthenticate } from "../../../utils/LocalStorage";
import { readMoney } from "../../../utils/ReadMoney";
import { formatPrice } from "../../../utils/formatCash";
import { socket } from "../../../App";
import { SocketEvent } from "../../../utils/SocketConstant";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// import { httpChangeStatusTimeWork } from "../../../api/employee";
const ListBooking = (props) => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const { Option } = Select;
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [girl, setGirl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [titleModal, setTitleModal] = useState("Xác nhận");
  const [handleBooking, setHandleBooking] = useState();
  const [ishouse, setIsHouse] = useState();
  const [ishouseNoneBlock, setIsHouseNoneBlock] = useState();
  const [timeUpdate, setTimeUpdate] = useState();
  const [bookingPrice, setBookingPirce] = useState();
  const [booking, setBooking] = useState();
  const [dateUpdate, setDateUpdate] = useState();
  const [employeeBooking, setEmployeeBooking] = useState();
  // eslint-disable-next-line no-unused-vars
  const [dateBooking, seDateBooking] = useState();
  const [ishandle, setIshandle] = useState();
  const dateFormat = "YYYY/MM/DD";
  const navigate = useNavigate()
  const format = "HH";
  // eslint-disable-next-line react/prop-types
  // eslint-disable-next-line react/prop-types
  const employee = props.dataEmployy?.map((item) => {
    return {
      text: item.name,
      value: item.name,
    };
  });
  // eslint-disable-next-line react/prop-types

  const user = isAuthenticate();
  // eslint-disable-next-line react/prop-types
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const changeEmployee = (e) => {
    console.log(e);
    let count = 0;
    setEmployeeBooking(e);
    booking?.map((item) => {
      // console.log(renderDate(value._d) == renderDate(item.date));
      if (
        item.status == 1 &&
        renderDate(item.date) == renderDate(dateUpdate) &&
        item.employeeId?._id == e &&
        renderTime(item.time) == renderTime(timeUpdate)
      ) {
        count = Number(count) + 1;
      }
    });

    if (count > 0) {
      setIsHouseNoneBlock("block");
      setIsHouse(count);
    } else {
      setIsHouseNoneBlock("none");
    }
    console.log(count);
  };

  const ReadMoney = new readMoney();

  const onchangeDateBooking = (value) => {
    let count = 0;
    console.log(employeeBooking);
    // setDateUpdate(dateIp.value)
    setDateUpdate(value);
    booking?.map((item) => {
      // console.log(renderDate(value._d) == renderDate(item.date));
      if (
        item.status == 1 &&
        renderDate(item.date) == renderDate(value) &&
        item.employeeId?._id == employeeBooking &&
        renderTime(item.time) == renderTime(timeUpdate)
      ) {
        count = Number(count) + 1;
      }
    });
    console.log(count);
    if (count > 0) {
      setIsHouseNoneBlock("block");
      setIsHouse(count);
    } else {
      setIsHouseNoneBlock("none");
    }
  };
  const onOk = (value) => {
    // console.log("...."+ employeeBooking);

    console.log("onOk: ", value);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const onchangeTimeBooking = async (value) => {
    console.log(value);
    setTimeUpdate(value);
    console.log(timeUpdate);
    let count = 0;
    booking?.map((item) => {
      if (
        item.status == 1 &&
        renderDate(item.date) == renderDate(dateUpdate) &&
        item.employeeId?._id == employeeBooking &&
        renderTime(item.time) == renderTime(value)
      ) {
        count = Number(count) + 1;
      }
    });
    if (count > 0) {
      setIsHouseNoneBlock("block");
      setIsHouse(count);
    } else {
      setIsHouseNoneBlock("none");
    }
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

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const getColumnSearchDateTime = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <DatePicker
          // disabledDate={disabledDate}
          onChange={async (e) => {
            console.log(renderDate(e._d)), setSelectedKeys([renderDate(e._d)]);
          }}
          // onChange={setSelectedKeys([2022006])}
          onOk={onOk}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const getColumnSearchTime = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <TimePicker
          onChange={async (e) => {
            console.log(renderTime(e._d)),
              setSelectedKeys([renderTime(e._d).toString()]);
          }}
          style={{
            marginBottom: 8,
            display: "block",
          }}
          format={format}
        />

        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  // let elemenPick;
  const showModal = async (e) => {

    // eslint-disable-next-line react/prop-types
    if (
      e.target.getAttribute("data") == "addBooking" ||
      e.target.offsetParent.getAttribute("data") == "addBooking"
    ) {
      await setIsModalOpen(true);
      document.getElementById("js-licensing").style.display = "none";
      document.getElementById("grid_1281791375_0").style.display = "none";
      setIshandle(1);
      setIsHouseNoneBlock("none");
      form.setFieldsValue({
        name: "",
        phoneNumber: undefined,
        services: undefined,
        employeeId: undefined,
        note: "",
        age: "",
        gender: "",
        date: undefined,
        time: undefined,
      });
      setBookingPirce(0);
      setTitleModal("Thêm khách đến trực tiếp");
    } else {
      setIsHouseNoneBlock("none");
      let isButon = e.target.getAttribute("data");
      let idBooking = e.target.getAttribute("dataId");
      let show = e.target.getAttribute("isshow");

      if (isButon == null) {
        isButon = e.target.offsetParent.getAttribute("data");
        idBooking = e.target.offsetParent.getAttribute("dataId");
        show = e.target.offsetParent.getAttribute("isshow");
      }
      let count = 0;
      let isBooking;
      // eslint-disable-next-line react/prop-types

      // eslint-disable-next-line react/prop-types
      booking.map(async (item) => {
        if (item._id == idBooking) {
          isBooking = item;
          await setHandleBooking(item);
          setDateUpdate(item.date);
          setTimeUpdate(item.time);
          setEmployeeBooking(item.employeeId?._id || "");
          return;
        }
      });
      booking.map(async (item) => {
        console.log(item);
        if (item._id == idBooking) {
          if (item.status == isButon || show == "false") {
            return;
          }
          await seDateBooking(item.date.toString());
          setBookingPirce(item?.bookingPrice);
          form.setFieldsValue({
            name: item?.name,
            phoneNumber: item?.phoneNumber.toString().replace("+84", "0"),
            services: item.services?.map((item) => {
              return {
                lable: item.serviceId?.name,
                value: item.serviceId?._id,
              };
            }),
            employeeId: item?.employeeId?._id,
            note: item?.note,
            age: item?.age,
            gender: item?.gender,
            // bookingPrice:item?.bookingPrice ? formatCash(item?.bookingPrice) : "",
            date: moment(renderDate(item?.date), dateFormat),
            time:
              item?.time != undefined
                ? moment(renderTime(item?.time), format)
                : "",
          });
          await setIsModalOpen(true);
          document.getElementById("js-licensing").style.display = "none";
          document.getElementById("grid_1281791375_0").style.display = "none";
        }
      });

      setIshandle(isButon);
      if (isButon === "1") {
        setTitleModal("Xác nhận");
      } else if (isButon === "2") {
        setTitleModal("Hủy");
      } else if (isButon === "0") {
        setTitleModal("Chờ xác nhận");
      } else if (isButon === "4") {
        setTitleModal("Thanh toán và in hóa đơn");
      } else if (isButon === "5") {
        setTitleModal("Thông tin");
      }

      if (isButon == 1) {
        booking?.map((item) => {
          if (
            item.status == 1 &&
            renderDate(item.date) == renderDate(isBooking.date) &&
            renderTime(item.time) == renderTime(isBooking.time) &&
            item.employeeId?._id == isBooking.employeeId?._id
          ) {
            count = Number(count) + 1;
          }
        });
        if (count > 0) {
          setIsHouseNoneBlock("block");
          setIsHouse(count);
        } else {
          setIsHouseNoneBlock("none");
        }
      } else {
        setIsHouseNoneBlock("none");
      }
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleOk = async () => { };

  const handleCancel = () => {
    setIsModalOpen(false);

    const changeStatus = async () => {
      const res = await httpGetAll();
      setBooking(res)
    }
    changeStatus()
  };
  const renderTime = (value) => {
    const d = new Date(value);
    let time = d.getHours();
    if (time.toString().length == 1) {
      time = `0${time}: 00`;
    } else {
      time = `${time}: 00`;
    }
    if (value == undefined) {
      return "";
    }
    return time;
  };

  const renderDate = (value) => {
    const d = new Date(value);
    let date = d.getDate();
    let month = d.getMonth() + 1;
    if (date.toString().length == 1) {
      date = `0${date}`;
    }
    if (month.toString().length == 1) {
      month = `0${month}`;
    }
    return `${d.getFullYear()}-${month}-${date}`;
  };
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...getColumnSearchProps("phoneNumber"),
    },
    {
      title: <span>Ngày</span>,
      dataIndex: "date",
      key: "date",
      render: (data) => <span>{data}</span>,
      ...getColumnSearchDateTime("date"),
      // filters: dateFilter,
      // onFilter: (value, record) => record.date.toString().indexOf(value) === 0,
    },
    {
      title: "Giờ",
      dataIndex: "time",
      key: "time",
      ...getColumnSearchTime("time"),
    },
    {
      title: "Nhân viên",
      dataIndex: "employeeId",
      key: "employeeId",
      filters: employee,
      onFilter: (value, record) => record.employeeId?.indexOf(value) === 0,
    },

    {
      title: "Trạng Thái",
      key: "status",
      dataIndex: "status",
      filters: [
        {
          text: "Chờ xác nhận",
          value: "0",
        },
        {
          text: "Đã xác nhận",
          value: "1",
        },
        {
          text: "Hủy",
          value: "2",
        },
        {
          text: "Chờ thanh toán",
          value: "3",
        },
        {
          text: "Hoàn thành",
          value: "4",
        },
      ],
      onFilter: (value, record) =>
        record.status.toString().indexOf(value) === 0,
      render: (status) => {
        let key = "Chờ xác nhận";
        let color = "#e4ed36";
        if (status === 0) {
          true;
        } else if (status === 1) {
          key = "Đã xác nhận";
          color = "blue";
        } else if (status === 2) {
          key = "Hủy";
          color = "red";
        } else if (status === 3) {
          key = "Chờ thanh toán";
          color = "#69c20a";
        } else if (status === 4) {
          key = "Hoàn thành";
          color = "#09857e";
        }
        return (
          <Tag color={color} key={key}>
            {key.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (item) => {
        let isShowCucess = "false";
        let isShowFailure = "false";
        let isShowPay = "false";
        let isShowInfo = "true";
        let BtSusscesCursor = "pointer";
        let BtToEmployeeCursor = "pointer";
        let BtSusscessColor = "#dedede";
        // thong tin
        let BtInfoCursor = "pointer";
        let BtInfo = "#3934df";
        let BtToEmployee = "#b11aa0";
        // let BtSusscessColor = "#26cbe8"
        // hủy
        let BtFailureCursor = "not-allowed";
        let BtFailureColor = "#dedede";
        // let BtFailureColor = "#db5656"
        // thanh toánisShowCucess
        let BtPayCursor = "not-allowed";
        let BtPayColor = "#dedede";
        // let BtPayColor = "#09857e"

        if (item.status === 0) {
          // xac nhan
          isShowCucess = "true";
          BtToEmployee = "#dedede";
          BtToEmployeeCursor = "not-allowed"
          isShowFailure = "true";
          BtSusscesCursor = "pointer";
          BtSusscessColor = "#26cbe8";
          BtFailureCursor = "pointer";
          BtFailureColor = "#db5656";
        } else if (item.status === 1) {
          // hủy
          isShowFailure = "true";
          BtFailureCursor = "pointer";
          BtFailureColor = "#db5656";
        } else if (item.status === 3) {
          // hủy
          BtPayCursor = "pointer";
          BtPayColor = "#09857e";
          isShowPay = "true";
        }else if (item.status === 2) {
          // hủy
          BtToEmployee = "#dedede";
          BtToEmployeeCursor = "not-allowed"
        }
        return (
          <Select
            className="selectChangeSatus"
            style={{ width: "150px", color: "blue", textAlign: "center" }}
            value="Đổi trạng thái"
          >
            <Option value="1">
              {" "}
              <Button
                isshow={isShowCucess}
                onClick={showModal}
                dataId={item._id}
                data="1"
                style={{
                  cursor: BtSusscesCursor,
                  backgroundColor: BtSusscessColor,
                  border: "none",
                  color: "white",
                  width: "100%",
                }}
              >
                Xác nhận
              </Button>
            </Option>
            <Option value="2">
              {" "}
              <Button
                isshow={isShowFailure}
                onClick={showModal}
                dataId={item._id}
                data="2"
                type="danger"
                style={{
                  cursor: BtFailureCursor,
                  backgroundColor: BtFailureColor,
                  border: "none",
                  color: "white",
                  width: "100%",
                }}
              >
                Hủy
              </Button>
            </Option>
            {/* <Option value="0"><Button onClick={showModal} dataId={item._id} data="0" style={{ cursor: BtWaitCursor, backgroundColor: BtWaitColor, border: "none", color: "white", width: "100%" }} >
                            Chờ xác nhận
                        </Button></Option> */}
            <Option value="4">
              <Button
                isshow={isShowPay}
                onClick={showModal}
                dataId={item._id}
                data="4"
                style={{
                  cursor: BtPayCursor,
                  backgroundColor: BtPayColor,
                  border: "none",
                  color: "white",
                  width: "100%",
                }}
              >
                Thanh toán
              </Button>
            </Option>
            <Option value="5">
              <Button
                onClick={async () => {
                  if (item.status == 0 ) {
                   return
                  }else if(item.status == 2) {
                    return
                  }else{
                    await props.handleToEmployee(item.employeeId._id, item._id)
                    navigate("/admin/booking/employee")
                  }
                }}
                style={{
                  cursor: BtToEmployeeCursor,
                  backgroundColor: BtToEmployee,
                  border: "none",
                  color: "white",
                  width: "100%",
                }}
              >
                Quyền nhân viên
              </Button>
            </Option>
            <Option value="5">
              <Button
                isshow={isShowInfo}
                onClick={showModal}
                dataId={item._id}
                data="5"
                style={{
                  cursor: BtInfoCursor,
                  backgroundColor: BtInfo,
                  border: "none",
                  color: "white",
                  width: "100%",
                }}
              >
                Thông tin
              </Button>
            </Option>
          </Select>
        );
      },
    },
  ];

  // eslint-disable-next-line react/prop-types

  const validateMessages = {
    required: "${label} không được để trống!",
    types: {
      email: "${label} không đúng định dạng!",
      number: "",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const onSubmit = async (data) => {
    console.log("submit", data);
    if (titleModal == "Thêm khách đến trực tiếp") {
      console.log(bookingPrice);
      let res = "";
      if (!data.services[0].lable) {
        res = data.services.map((item) => {
          let price;
          props.dataService?.map((current) => {
            if (current._id == item) {
              price = current.price;
            }
          });
          return {
            serviceId: item,
            price: price,
          };
        });
      } else {
        res = data.services.map((item) => {
          let price;
          props.dataService?.map((current) => {
            if (current._id == item.value) {
              price = current.price;
            }
          });
          return {
            serviceId: item.value,
            price: price,
          };
        });
      }
      const bodyData = {
        ...data,
        status: 1,
        date: dateUpdate,
        time: timeUpdate,
        services: res,
        bookingPrice: bookingPrice,
      };
      console.log(bodyData);
      try {
        await bookingAddByEmployeeApi(bodyData);
        message.success("Thêm khách đến trực tiếp thành công", 2);
        setIsModalOpen(false);
        const changeStatus = async () => {
          const res = await httpGetAll();
          setBooking(res)
        }
        changeStatus()
      } catch (error) {
        message.error(`${error.response?.data?.message}`);
        console.log(error);
      }
    } else {
      if (ishandle === "1") {
        try {
          let res = "";
          if (!data.services[0].lable) {
            res = data.services.map((item) => {
              let price;
              props.dataService?.map((current) => {
                if (current._id == item) {
                  price = current.price;
                }
              });
              return {
                serviceId: item,
                price: price,
              };
            });
          } else {
            res = data.services.map((item) => {
              let price;
              props.dataService?.map((current) => {
                if (current._id == item.value) {
                  price = current.price;
                }
              });
              return {
                serviceId: item.value,
                price: price,
              };
            });
          }
          console.log(data);
          console.log(handleBooking);
          await httpGetChangeStatus(handleBooking._id, {
            ...data,
            date: dateUpdate,
            time: timeUpdate,
            status: 1,
            bookingPrice: bookingPrice,
            services: res,
          });
          message.success(`${titleModal} khách hàng ${handleBooking.name}`);
          if (handleBooking.userId) {
            const notification = {
              id: handleBooking._id,
              notificationType: "user",
              text: "Đơn đặt lịch của bạn đã được xác nhận",
              from: user.id,
              userId: handleBooking.userId._id,
            };
            socket.emit(SocketEvent.NEWUSERNOTIFICATION, notification);
            socket.off(SocketEvent.NEWUSERNOTIFICATION);
          }
        } catch (error) {
          console.log(error);
          message.error(`${error.response?.data?.message}`);
        }
      } else if (ishandle === "2") {
        try {
          await httpGetChangeStatus(handleBooking._id, { status: 2 });
          message.success(`${titleModal} khách hàng ${handleBooking.name}`);
          if (handleBooking.userId) {
            const notification = {
              id: handleBooking._id,
              notificationType: "user",
              text: "Admin đã cập nhật trạng thái đơn hàng của bạn.",
              from: user.id,
              userId: handleBooking.userId._id,
            };
            socket.emit(SocketEvent.NEWUSERNOTIFICATION, notification);
            socket.off(SocketEvent.NEWUSERNOTIFICATION);
          }
        } catch (error) {
          message.error(`${error.response.data.message}`);
        }
      } else if (ishandle === "0") {
        try {
          await httpGetChangeStatus(handleBooking._id, { status: 0 });
          message.success(`${titleModal} khách hàng ${handleBooking.name}`);
          if (handleBooking.userId) {
            const notification = {
              id: handleBooking._id,
              notificationType: "user",
              text: "Admin đã cập nhật trạng thái đơn hàng của bạn.",
              from: user.id,
              userId: handleBooking.userId._id,
            };
            socket.emit(SocketEvent.NEWUSERNOTIFICATION, notification);
            socket.off(SocketEvent.NEWUSERNOTIFICATION);
          }
        } catch (error) {
          message.error(`${error.response.data.message}`);
        }
      } else if (ishandle === "4") {
        try {
          await httpGetChangeStatus(handleBooking._id, { status: 4 });
          message.success(`${titleModal} khách hàng ${handleBooking.name}`);
          if (handleBooking.userId) {
            const notification = {
              id: handleBooking._id,
              notificationType: "user",
              text: "Admin đã cập nhật trạng thái đơn hàng của bạn.",
              from: user.id,
              userId: handleBooking.userId._id,
            };
            socket.emit(SocketEvent.NEWUSERNOTIFICATION, notification);
            socket.off(SocketEvent.NEWUSERNOTIFICATION);
          }
        } catch (error) {
          message.error(`${error.response.data.message}`);
        }
      }
      // eslint-disable-next-line react/prop-types
      const changeStatus = async () => {
        const res = await httpGetAll();
        setBooking(res)
      }
      changeStatus()
      handleCancel();
    }
  };
  const onHandleAdd = (value) => {
    console.log("cha:", value);
  };
  const layout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const handleToolbarClick = async () => {
    if (ishandle != 4) {
      return;
    }
    const sliceId = handleBooking?._id.slice(-7, handleBooking._id.length);
    if (girl) {
      girl.excelExport({
        fileName: `${ChangeToSlug(handleBooking?.name)}-${sliceId}.xlsx`,
        header: {
          headerRows: 10,
          rows: [
            {
              cells: [
                {
                  colSpan: 2,
                  value: "Dịch vụ Tuyến Spa",
                  style: {
                    fontSize: 20,
                    hAlign: "Center",
                    bold: true,
                    girlLine: "bol",
                  },
                },
              ],
            },
            {
              cells: [
                {
                  colSpan: 2,
                  value: "Web: http://tuyenspa.com",
                  style: { fontSize: 10, hAlign: "Center", bold: true },
                },
              ],
            },
            {
              cells: [
                {
                  colSpan: 2,
                  value: "Tel: 012344567 / 012344567",
                  style: { fontSize: 10, hAlign: "Center", bold: true },
                },
              ],
            },
            {
              cells: [
                {
                  colSpan: 2,
                  value: "",
                  style: {
                    fontSize: 10,
                    hAlign: "Center",
                    bold: true,
                    wrapperCol: true,
                  },
                },
              ],
            },
            {
              cells: [
                {
                  colSpan: 2,
                  value: "HÓA ĐƠN THANH TOÁN",
                  style: { fontSize: 20, hAlign: "Center", bold: true },
                },
              ],
            },
            {
              cells: [
                {
                  colSpan: 2,
                  value: "",
                  style: {
                    fontSize: 10,
                    hAlign: "Center",
                    bold: true,
                    wrapperCol: true,
                  },
                },
              ],
            },
            {
              cells: [
                {
                  colSpan: 1,
                  value: "Ngày tạo: " + moment().format("DD/MM/YYYY"),
                  style: {
                    hAlign: "left",
                    wrapText: true,
                    bold: true,
                  },
                },
                {
                  colSpan: 1,
                  value: "Số: " + sliceId,
                  style: { hAlign: "right", bold: true },
                },
              ],
            },
            {
              cells: [
                {
                  colSpan: 1,
                  value: "Thu ngân: " + user?.name,
                  style: { hAlign: "left", bold: true },
                },
                {
                  colSpan: 1,
                  value: "In lúc: " + moment().format("h:mm"),
                  style: { hAlign: "right", bold: true },
                },
              ],
            },
            {
              cells: [
                {
                  colSpan: 2,
                  value: `Khách hàng: ${handleBooking?.name} - ${handleBooking?.phoneNumber}`,
                  style: { fontSize: 10, hAlign: "Center", bold: true },
                },
              ],
            },
          ],
        },
        footer: {
          footerRows: 3,
          rows: [
            {
              cells: [
                {
                  colSpan: 1,
                  value: `Thanh toán:`,
                  style: { bold: true, wrapText: true, fontSize: 15 },
                },
                {
                  colSpan: 1,
                  value: formatCash(handleBooking?.bookingPrice),
                  style: { bold: true, hAlign: "right", fontSize: 15 },
                },
              ],
            },
            {
              cells: [
                {
                  colSpan: 2,
                  value: "",
                  style: {
                    fontSize: 10,
                    hAlign: "Center",
                    bold: true,
                    wrapperCol: true,
                  },
                },
              ],
            },
            {
              cells: [
                {
                  rowSpan: 2,
                  colSpan: 2,
                  value: `( ${ReadMoney.doc(handleBooking?.bookingPrice)} )`,
                  style: { hAlign: "center", bold: true, wrapText: true },
                },
              ],
            },
          ],
        },
      });
    }
  };
  const handleChange = (value) => {
    let total = 0;
    const arrOption = value.toString().split(",");
    arrOption.forEach((item) => {
      props.dataService?.map((service) => {
        if (item == service._id) {
          total += service.price;
        }
      });
    });
    console.log(total);
    setBookingPirce(total);
  };
  const options = props.dataService?.map((item) => {
    setBooking
    return {
      label: item.name,
      value: item._id,
    };
  });
  const datatable = booking?.map((item) => {
    const time = renderTime(item.time);
    const date = renderDate(item.date);
    return {
      name: item.name,
      phoneNumber: item.phoneNumber.toString().replace("+84", "0"),
      status: item.status,
      date: date,
      time: time,
      employeeId: item.employeeId?.name,
      action: item,
    };
  });
  useEffect(() => {
    setLoading(true);
    const getBooking = async () => {
      const res = await httpGetAll();
      setBooking(res)
    }
    getBooking()
    setLoading(false);
  }, [])
  return (
    <Spin
      spinning={loading}
      style={{
        position: "fixed",
        top: "25%",
        left: "8%",
      }}
    >
      <div className="w-full px-6 py-6 mx-auto">
        <div>
          <h1 className="mb-0 font-bold text-white capitalize pb-[20px] text-center text-[50px]">
            Danh sách lịch đặt
          </h1>
          <Button
            onClick={showModal}
            data="addBooking"
            type="success"
            style={{
              border: "1px solid white",

              font: "bold",
            }}
          >
            + Thêm khách đến trực tiếp
          </Button>
        </div>
        <Table className="mt-5" columns={columns} dataSource={datatable} />;
        <Modal
          footer={null}
          style={{ fontFamily: "revert-layer" }}
          title={titleModal}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <GridComponent
            style={{
              display:
                titleModal == "Thanh toán và in hóa đơn" ? "block" : "none",
            }}
            ref={(g) => setGirl(g)}
            toolbar={[titleModal]}
            allowExcelExport={true}
            wrapText={true}
            // dataSource={handleBooking?.services.map((item) => {
            //     return { ...item, price: formatCash(item?.price) }
            // })}
            // toolbarClick={handleToolbarClick}
            allowPaging={true}
          >
            <ColumnsDirective>
              <ColumnDirective
                indent="1"
                field="name"
                headerText="Dịch vụ"
                width="200"
                textAlign="left"
              />
              <ColumnDirective
                field="price"
                headerText="Đơn Giá"
                width="110"
                textAlign="right"
              />
            </ColumnsDirective>
            <Inject services={[ExcelExport]} />
          </GridComponent>

          <Form
            id="html2pdf"
            form={form}
            onAdd={onHandleAdd}
            {...layout}
            name="nest-messages"
            validateMessages={validateMessages}
            onFinish={onSubmit}
          >
            {/* Tên */}
            <Form.Item
              name="name"
              label="Tên"
              rules={[
                {
                  required: ishandle == 1 ? true : false,
                },
              ]}
            >
              <Input disabled={ishandle == 1 ? false : true} placeholder="Tên" />
            </Form.Item>
            <Form.Item style={{ margin: "0px" }} label="Tuổi - Giới tính">
              <Input.Group>
                <Row>
                  <Col style={{ width: "45%" }}>
                    <Form.Item name="age">
                      <InputNumber
                        disabled={ishandle == 1 ? false : true}
                        style={{ width: "100%" }}
                        placeholder="Tuổi"
                        min={1}
                        max={100}
                      />
                    </Form.Item>
                  </Col>
                  <Col style={{ width: "50%", marginLeft: "5%" }}>
                    <Form.Item name="gender">
                      <Select
                        disabled={ishandle == 1 ? false : true}
                        style={{ width: "100%" }}
                        placeholder="Giới tính"
                        options={[
                          {
                            label: "Nam",
                            value: "0",
                          },
                          {
                            label: "Nữ",
                            value: "1",
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[
                {
                  required: ishandle == 1 ? true : false,
                  pattern: new RegExp(/((09|03|07|08|05)+([0-9]{8})\b)/g),
                  message: "Số điện thoại không đúng định dạng!",
                },
              ]}
            >
              <Input
                placeholder="Số điện thoại"
                disabled={ishandle == 1 ? false : true}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
            <Form.Item
              name="services"
              label="Dịch vụ"
              rules={[
                {
                  required: ishandle == 1 ? true : false,
                  // eslint-disable-next-line no-undef
                },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="Dịch vụ"
                onChange={handleChange}
                options={options}
                disabled={ishandle == 1 ? false : true}
              />
            </Form.Item>

            <Form.Item
              name="date"
              label="Ngày đến"
              rules={[
                {
                  required: ishandle == 1 ? true : false,
                  // eslint-disable-next-line no-undef
                },
              ]}
            >
              <DatePicker
                disabled={ishandle == 1 ? false : true}
                showTime
                format={dateFormat}
                onChange={onchangeDateBooking}
                placeholder="Ngày đến"
              // onOk={onOk}
              />
            </Form.Item>

            {/* chọn nhân viên */}
            <Form.Item
              name="employeeId"
              label="Nhân viên"
              rules={[
                {
                  required: ishandle == 1 ? true : false,
                  // eslint-disable-next-line no-undef
                },
              ]}
            >
              <Select
                disabled={ishandle == 1 ? false : true}
                onChange={changeEmployee}
                placeholder="Nhân viên"
              >
                {props.dataEmployy?.map((item, index) => (
                  <Select.Option value={item._id} key={index}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="time"
              label="Giờ đến"
              rules={[
                {
                  required: ishandle == 1 ? true : false,
                  // eslint-disable-next-line no-undef
                },
              ]}
            >
              <TimePicker
                disabled={ishandle == 1 ? false : true}
                format={format}
                onChange={onchangeTimeBooking}
                placeholder="Giờ đến"
              />
            </Form.Item>

            <Form.Item
              style={{ display: ishouseNoneBlock }}
              label="Note"
              name="time"
            >
              <div
                className=""
                style={{ color: "#cfab1b", display: ishouseNoneBlock }}
              >
                Nhân viên này đã có {ishouse} khách vào thời điểm này !
              </div>
            </Form.Item>
            {/* chọn ca  */}

            <Form.Item name="note" label="Ghi chú">
              <Input.TextArea disabled={ishandle == 1 ? false : true} />
            </Form.Item>
            <Form.Item name="bookingPrice" label="Thanh toán">
              <span className="font-semibold">
                {formatPrice(
                  bookingPrice || bookingPrice == 0
                    ? bookingPrice
                    : handleBooking?.bookingPrice
                )}
              </span>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button
                style={{
                  display:
                    // eslint-disable-next-line no-constant-condition
                    titleModal == "Thanh toán và in hóa đơn" || "thông tin"
                      ? "none"
                      : "block",
                }}
                type="primary"
                htmlType="submit"
              >
                {titleModal}
              </Button>

              <Button
                onClick={handleToolbarClick}
                style={{
                  display:
                    titleModal == "Thanh toán và in hóa đơn"
                      ? "block"
                      : titleModal == "Thông tin"
                        ? "none"
                        : "",
                }}
                type="primary"
                htmlType="submit"
              >
                {titleModal}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};
export default ListBooking;
