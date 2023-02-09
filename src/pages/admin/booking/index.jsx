/* eslint-disable no-const-assign */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
import React, { useRef, useState } from "react";
import { InfoCircleTwoTone, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
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

import { ChangeToSlug } from "../../../utils/ConvertStringToSlug";
import { isAuthenticate } from "../../../utils/LocalStorage";
import { readMoney } from "../../../utils/ReadMoney";
import { formatPrice } from "../../../utils/formatCash";
import { socket } from "../../../App";
import { SocketEvent } from "../../../utils/SocketConstant";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { httpGetOne } from "../../../api/employee";
import { httpGetOneService } from "../../../api/services";
import { ListVouchers, useVoucher } from "../../../api/voucher";
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
  const [page, setPage] = useState(
    localStorage.getItem("Idback") == undefined &&
      localStorage.getItem("bookingNew") == undefined
      ? true
      : false
  );
  const [handleBooking, setHandleBooking] = useState();
  const [ishouse, setIsHouse] = useState();
  const [voucher, setVoucher] = useState();
  const [ishouseNoneBlock, setIsHouseNoneBlock] = useState();
  const [timeUpdate, setTimeUpdate] = useState();
  const [bookingPrice, setBookingPirce] = useState();
  const [booking, setBooking] = useState();
  const [dateUpdate, setDateUpdate] = useState();
  const [coinVoucher, setCoinVoucher] = useState();
  const [note, setNote] = useState();
  const [employeeBooking, setEmployeeBooking] = useState();
  // eslint-disable-next-line no-unused-vars
  const [dateBooking, seDateBooking] = useState();
  const [ishandle, setIshandle] = useState();
  const dateFormat = "YYYY/MM/DD";
  const navigate = useNavigate();
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
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
  };
  const disabledTime = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf("hour");
  };
  const changeVoucher = async () => {
    const code = document.getElementById("code");
    let flagVoucher = false;
    let res;
    voucher?.map((item) => {
      if (item.code == code.value) {
        flagVoucher = true;
        res = item;
      }
    });
    if (flagVoucher == false) {
      message.error("Voucher không hợp lệ.");
    } else {
      console.log(res);
      let flag = false;
      let serrvice;
      handleBooking?.services.map((item) => {
        // console.log(item.serviceId._id);
        if (item.serviceId._id == res.service._id) {
          flag = true;
          serrvice = item.serviceId;
          return;
        }
      });

      if (flag == false) {
        message.error("Voucher không áp dụng khuyến mãi cho dịch vụ này !");
      } else {
        let coinDown;
        if (res.type == "direct") {
          coinDown = res.discount;
        } else {
          coinDown = (serrvice.price / 100) * res.discount;
        }
        setCoinVoucher(coinDown);
        const coinResult = handleBooking.bookingPrice - coinDown;
        if (coinResult < 0) {
          setBookingPirce(0);
        } else {
          setBookingPirce(coinResult);
        }
        message.success("Đã áp dụng Voucher !");
      }
    }
  };

  // const renderNameService = () => {
  //   let text = ""
  //   handleBooking?.services.forEach((item, index) => {
  //     if(index >= 1) {
  //       text +=  item.serviceId.name
  //     }else{
  //       text += item.serviceId.name
  //     }

  //   })
  //   return text
  // }

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

  const handleSetNote = (data) => {
    setNote(data.target.value);
  };

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
        form
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
  console.log(document.getElementsByClassName("dbd487"));
  if (localStorage.getItem("bookingNew")) {
    const element = document.querySelectorAll("#higtlight");
    console.log(element);
    for (let i = 0; i < element.length; i++) {
      element[i].style.display = "none";
    }
  }
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
        codeVoucher: undefined,
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
      localStorage.setItem("nonePage", "true");
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
          setCoinVoucher("");
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
            codeVoucher: undefined,
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
      } else if (isButon === "6") {
        setTitleModal("Sửa thông tin");
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

  const handleCancel = async () => {
    setIsModalOpen(false);

    const changeStatus = async () => {
      const res = await httpGetAll();
      setBooking(res);
    };
    changeStatus();
    if (localStorage.getItem("nonePage")) {
      // window.scroll({
      //   top: 220,
      //   left: 0,
      //   behavior: "smooth",
      // });
      const element = await document.querySelectorAll("#higtlight");
      console.log(element);
      for (let i = 0; i < element.length; i++) {
        element[i].style.display = "none";
      }
      localStorage.removeItem("nonePage");
    }
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
      title: "",
      dataIndex: "id",
      key: "id",
      render: (item) => {
        return (
          <div
            id="higtlight"
            style={{ display: "none", fontSize: "20px" }}
            className={item}
          >
            <InfoCircleTwoTone />
          </div>
        );
      },
    },
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...getColumnSearchProps("phoneNumber"),
    },
    {
      title: <span>Ngày đến</span>,
      dataIndex: "date",
      key: "date",
      render: (data) => <span>{data}</span>,
      ...getColumnSearchDateTime("date"),
      // filters: dateFilter,
      // onFilter: (value, record) => record.date.toString().indexOf(value) === 0,
    },
    {
      title: "Giờ đến",
      dataIndex: "time",
      key: "time",
      ...getColumnSearchTime("time"),
    },
    {
      title: "Nhân viên phục vụ",
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
        let isEditshow = "false";
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
        let BtEditCursor = "not-allowed";
        let BtFailureColor = "#dedede";
        let BtEditColor = "#dedede";
        // let BtFailureColor = "#db5656"
        // thanh toánisShowCucess
        let BtPayCursor = "not-allowed";
        let BtPayColor = "#dedede";
        // let BtPayColor = "#09857e"

        if (item.status === 0) {
          // xac nhan
          isShowCucess = "true";
          BtToEmployee = "#dedede";
          BtToEmployeeCursor = "not-allowed";
          isShowFailure = "true";
          isEditshow = "true";
          BtSusscesCursor = "pointer";
          BtSusscessColor = "#26cbe8";
          BtFailureCursor = "pointer";
          BtEditCursor = "pointer";
          BtFailureColor = "#db5656";
          BtEditColor = "#ba9d07";
        } else if (item.status === 1) {
          // hủy
          isShowFailure = "true";
          BtFailureCursor = "pointer";
          isEditshow = "true";
          BtFailureColor = "#db5656";
          BtEditCursor = "pointer";
          BtEditColor = "#ba9d07";
        } else if (item.status === 3) {
          // hủy
          BtPayCursor = "pointer";
          BtPayColor = "#09857e";
          isShowPay = "true";
        } else if (item.status === 2) {
          // hủy
          BtToEmployee = "#dedede";
          BtToEmployeeCursor = "not-allowed";
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
                  if (item.status == 0) {
                    return;
                  } else if (item.status == 2) {
                    return;
                  } else {
                    await props.handleToEmployee(
                      item.employeeId._id,
                      item._id.slice(-6, item._id.length)
                    );
                    navigate("/admin/booking/employee");
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
            <Option value="6">
              <Button
                isshow={isEditshow}
                onClick={showModal}
                dataId={item._id}
                data="6"
                style={{
                  cursor: BtEditCursor,
                  backgroundColor: BtEditColor,
                  border: "none",
                  color: "white",
                  width: "100%",
                }}
              >
                Sửa thông tin
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
        const response = await bookingAddByEmployeeApi(bodyData);
        message.success("Thêm khách đến trực tiếp thành công", 2);
        const notification = {
          id: response._id,
          text: `Bạn có lịch đặt mới từ khách hàng ${response.name} `,
          notificationType: "employee",
          employeeId: response.employeeId,
        };
        socket.emit("newEmployeeNotification", notification);
        socket.off("newEmployeeNotification");
        setIsModalOpen(false);
        const changeStatus = async () => {
          const res = await httpGetAll();
          setBooking(res);
        };
        changeStatus();
      } catch (error) {
        message.error(`${error.response?.data?.message}`);
        console.log(error);
      }
    } else {
      if (ishandle === "1") {
        const res = await httpGetOne(data.employeeId, user.token);
        if (res.status != 1) {
          message.error("Nhân viên này tạm thời không thể thực hiện");
          return;
        }
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
          for (let i = 0; i < res.length; i++) {
            const result = await httpGetOneService(res[0].serviceId);
            if (result.status != 1) {
              message.error("Có dịch vụ đã tạm dừng kinh doanh");
              return;
            }
          }

          console.log(handleBooking);
          const response = await httpGetChangeStatus(handleBooking._id, {
            ...data,
            date: dateUpdate,
            time: timeUpdate,
            status: 1,
            bookingPrice: bookingPrice,
            services: res,
          });
          console.log(response);
          message.success(`${titleModal} khách hàng ${handleBooking.name}`);
          if (handleBooking.userId) {
            const notification = {
              id: handleBooking._id,
              notificationType: "user",
              text: "Lịch đặt của bạn đã được xác nhận",
              from: user.id,
              userId: handleBooking.userId._id,
            };
            socket.emit(SocketEvent.NEWUSERNOTIFICATION, notification);
            socket.off(SocketEvent.NEWUSERNOTIFICATION);
          }
          const newEmployeeNotification = {
            id: response._id,
            notificationType: "employee",
            text: `Bạn có lịch đặt mới từ khách hàng ${response.name}`,
            employeeId: response.employeeId._id,
          };
          socket.emit("newEmployeeNotification", newEmployeeNotification);
          socket.off("newEmployeeNotification");
        } catch (error) {
          console.log(error);
          message.error(`${error}`);
        }
      } else if (ishandle === "2") {
        try {
          const response = await httpGetChangeStatus(handleBooking._id, {
            status: 2,
          });
          message.success(`${titleModal} khách hàng ${handleBooking.name}`);
          if (handleBooking.userId) {
            const notification = {
              id: handleBooking._id,
              notificationType: "user",
              text: "Admin đã huỷ lịch đặt của bạn.",
              from: user.id,
              userId: handleBooking.userId._id,
            };
            socket.emit(SocketEvent.NEWUSERNOTIFICATION, notification);
            socket.off(SocketEvent.NEWUSERNOTIFICATION);
            const newEmployeeNotification = {
              id: response._id,
              notificationType: "employee",
              text: `Lịch đặt từ khách hàng ${response.name} đã bị huỷ.`,
              employeeId: response.employeeId,
            };
            socket.emit("newEmployeeNotification", newEmployeeNotification);
            socket.off("newEmployeeNotification");
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
              text: "Admin đã cập nhật trạng thái lịch đặt của bạn",
              from: user.id,
              userId: handleBooking.userId._id,
            };
            socket.emit(SocketEvent.NEWUSERNOTIFICATION, notification);
            socket.off(SocketEvent.NEWUSERNOTIFICATION);
          }
        } catch (error) {
          return message.error(`${error.response?.data?.message}`);
        }
      } else if (ishandle === "4") {
        const code = document.getElementById("code");
        if (code.value == "") {
          try {
            const resB = await httpGetChangeStatus(handleBooking._id, {
              status: 4,
              note: data.note,
            });
            await setHandleBooking(resB);
            handleToolbarClick();
            message.success(`${titleModal} khách hàng ${handleBooking.name}`);
            if (handleBooking.userId) {
              const notification = {
                id: handleBooking._id,
                notificationType: "user",
                text: "Thanh toán thành công,cảm ơn đã sử dụng Spa của chúng tôi.",
                from: user.id,
                userId: handleBooking.userId._id,
              };
              socket.emit(SocketEvent.NEWUSERNOTIFICATION, notification);
              socket.off(SocketEvent.NEWUSERNOTIFICATION);
            }
          } catch (error) {
            return message.error(`${error.response?.data?.message}`);
          }
        } else {
          try {
            console.log(code.value);
            const res = await useVoucher(handleBooking._id, {
              code: code.value,
            });
            console.log(res);
            const resB = await httpGetChangeStatus(handleBooking._id, {
              ...res,
              status: 4,
              note: data.note,
            });

            await setHandleBooking(resB);
            handleToolbarClick();
            message.success(`${titleModal} khách hàng ${handleBooking.name}`);
            if (handleBooking.userId) {
              const notification = {
                id: handleBooking._id,
                notificationType: "user",
                text: "Thanh toán thành công,cảm ơn đã sử dụng Spa của chúng tôi.",
                from: user.id,
                userId: handleBooking.userId._id,
              };
              socket.emit(SocketEvent.NEWUSERNOTIFICATION, notification);
              socket.off(SocketEvent.NEWUSERNOTIFICATION);
            }
          } catch (error) {
            message.error(`${error.response?.data?.message}`);
            return;
          }
        }


      } else if (ishandle === "6") {
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
        for (let i = 0; i < res.length; i++) {
          const result = await httpGetOneService(res[0].serviceId);
          if (result.status != 1) {
            message.error("Có dịch vụ đã tạm dừng kinh doanh");
            return;
          }
        }
        try {
          await httpGetChangeStatus(handleBooking._id, {
            date: dateUpdate,
            time: timeUpdate,
            services: res,
          });
          message.success(
            "Cập nhật thông tin thành công cho khách hàng " +
            handleBooking?.name
          );
          if (handleBooking.userId) {
            const notification = {
              id: handleBooking._id,
              notificationType: "user",
              text: "Thông tin lịch spa của bạn đã được cập nhật.",
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
        setBooking(res);
      };
      changeStatus();
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
    const sliceId = handleBooking?._id.slice(-6, handleBooking._id.length);
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
                  value: "Thẩm mỹ viện Tuyến Spa",
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
                  value: "Website: http://tuyenspa.com",
                  style: { fontSize: 10, hAlign: "Center", bold: true },
                },
              ],
            },
            {
              cells: [
                {
                  colSpan: 2,
                  value: "Tel: (028) 4455 7788 / 0866 824 564",
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
            // this
          ],
        },
        footer: {
          footerRows: 5,
          rows: [
            {
              cells: [
                {
                  colSpan: 1,
                  value: `Khuyến mại Voucher:`,
                  style: { bold: true, wrapText: true, fontSize: 12 },
                },
                {
                  colSpan: 1,
                  value: coinVoucher != "" ? formatCash(coinVoucher) : "",
                  style: { bold: true, hAlign: "right", fontSize: 12 },
                },
              ],
            },
            {
              cells: [
                {
                  colSpan: 1,
                  value: `Tổng thanh toán:`,
                  style: { bold: true, wrapText: true, fontSize: 15 },
                },
                {
                  colSpan: 1,
                  value: formatCash(bookingPrice),
                  style: { bold: true, hAlign: "right", fontSize: 15 },
                },
              ],
            },
            {
              cells: [
                {
                  colSpan: 2,
                  value: `Ghi chú: ${note != undefined ? note : handleBooking?.note
                    }`,
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
                  rowSpan: 2,
                  colSpan: 2,
                  value: `( ${ReadMoney.doc(bookingPrice)} )`,
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
      id: item._id.slice(-6, item._id.length),
    };
  });

  const getEle = async () => {
    const idback = localStorage.getItem("Idback");
    if (idback) {
      const element = await document.getElementsByClassName(idback);
      console.log(element);
      if (element) {
        element[0].style.display = "block";
        element[0].scrollIntoView({ behavior: "smooth" });
      }
      setPage(false);
      localStorage.removeItem("Idback");
      setTimeout(() => {
        if (localStorage.getItem("nonePage")) {
          return;
        } else {
          // window.scroll({
          //   top: 220,
          //   left: 0,
          //   behavior: 'smooth'
          // })
          element[0].style.display = "none";
        }
      }, 7000);
    }
  };
  getEle();

  const HightLightBookingNew = async () => {
    const idBooking = localStorage.getItem("bookingNew");
    if (idBooking) {
      try {
        const res = await httpGetAll();
        setBooking(res);
        const element = await document.getElementsByClassName(
          idBooking.slice(-6, idBooking.length)
        );
        console.log(element);
        if (element) {
          element[0].style.display = "block";
          element[0].scrollIntoView({ behavior: "smooth" });
        }
        setPage(false);
        localStorage.removeItem("bookingNew");
        setTimeout(() => {
          if (localStorage.getItem("nonePage")) {
            return;
          } else {
            // window.scroll({ooking(
            //   top: 220,
            //   left: 0,
            //   behavior: 'smooth'
            // })
            element[0].style.display = "none";
          }
        }, 7000);
      } catch (error) {
        const res = await httpGetAll();
        setBooking(res);
        setPage(false);
        const element = await document.getElementsByClassName(
          idBooking.slice(-6, idBooking.length)
        );
        console.log(element);
        if (element) {
          element[0].style.display = "block";
          element[0].scrollIntoView({ behavior: "smooth" });
        }
        setPage(false);
        localStorage.removeItem("bookingNew");
        setTimeout(() => {
          if (localStorage.getItem("nonePage")) {
            return;
          } else {
            // window.scroll({
            //   top: 220,
            //   left: 0,
            //   behavior: 'smooth'
            // })
            element[0].style.display = "none";
          }
        }, 7000);
      }
    }
  };
  HightLightBookingNew();
  useEffect(() => {
    setLoading(true);
    const getBooking = async () => {
      const res = await httpGetAll();
      setBooking(res);
    };
    getBooking();

    const getVoucher = async () => {
      const res = await ListVouchers();
      setVoucher(res);
    };
    getVoucher();

    setLoading(false);
  }, []);
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              onClick={showModal}
              data="addBooking"
              type="success"
              style={{
                border: "1px solid white",
                fontWeight: "bold",
                font: "bold",
              }}
            >
              + Thêm khách đến trực tiếp
            </Button>
            <div>
              <Button
                onClick={() => {
                  setPage(false);
                }}
                data="addBooking"
                type="success"
                style={{
                  border: "1px solid white",
                  marginRight: "5px",
                  fontWeight: page == true ? "bold" : "normal",
                  color: page == true ? "#0ba2b9" : "#fefefe",
                  backgroundColor: page == false ? "#a1a1a1" : "white",
                }}
              >
                Một trang
              </Button>
              <Button
                onClick={() => {
                  setPage(true);
                }}
                data="addBooking"
                type="success"
                style={{
                  border: "1px solid white",
                  fontWeight: page == false ? "bold" : "normal",
                  color: page == false ? "#0ba2b9" : "#fefefe",
                  backgroundColor: page == true ? "#a1a1a1" : "white",
                }}
              >
                Phân trang
              </Button>
            </div>
          </div>
        </div>
        <Table
          pagination={page}
          className="mt-5"
          columns={columns}
          dataSource={datatable}
        />
        ;
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
            dataSource={handleBooking?.services.map((item) => {
              return {
                name: item.serviceId.name,
                price: formatCash(item?.price),
              };
            })}
            // toolbarClick={handleToolbarClick}
            allowPaging={true}
          >
            <ColumnsDirective>
              <ColumnDirective
                field="name"
                headerText="Dịch vụ"
                width="200"
                textAlign="left"
              />

              <ColumnDirective
                field="price"
                headerText="Đơn giá"
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
              <Input
                disabled={ishandle == 1 ? false : true}
                placeholder="Tên"
              />
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
                disabled={ishandle == 1 || ishandle == 6 ? false : true}
              >
                {props.dataService?.map((item, index) => {
                  if (item.status == 1) {
                    return (
                      <Select.Option value={item._id} key={index}>
                        {item.name}
                      </Select.Option>
                    );
                  } else {
                    return (
                      <Select.Option
                        disabled={true}
                        value={item._id}
                        key={index}
                      >
                        {item.name}
                      </Select.Option>
                    );
                  }
                })}
              </Select>
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
                disabledDate={disabledDate}
                disabled={ishandle == 1 || ishandle == 6 ? false : true}
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
                {props.dataEmployy?.map((item, index) => {
                  if (item.status == 1) {
                    return (
                      <Select.Option value={item._id} key={index}>
                        {item.name}
                      </Select.Option>
                    );
                  } else {
                    return (
                      <Select.Option
                        disabled={true}
                        value={item._id}
                        key={index}
                      >
                        {item.name}
                      </Select.Option>
                    );
                  }
                })}
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
                disabledDate={disabledTime}
                disabled={ishandle == 1 || ishandle == 6 ? false : true}
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
              <Input.TextArea
                onBlur={handleSetNote}
                disabled={ishandle == 1 || ishandle == 4 ? false : true}
              />
            </Form.Item>
            <Form.Item name="codeVoucher" label="Mã voucher">
              <Input
                id="code"
                disabled={ishandle == 4 ? false : true}
                placeholder="Nhập mã"
                onChange={ (e) => {
                  if(e.target.value == "") {
                    setBookingPirce(handleBooking?.bookingPrice)
                    setCoinVoucher("")
                  }
                } }
              />
            </Form.Item>
            <Form.Item className="mb-5" label=" ">
              <Button
                disabled={ishandle == 4 ? false : true}
                onClick={changeVoucher}
                style={{ marginTop: "2px" }}
                type="primary"
              >
                Áp dụng voucher
              </Button>
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
