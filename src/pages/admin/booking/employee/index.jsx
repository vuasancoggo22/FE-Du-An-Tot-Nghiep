/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef, useState } from "react";
import { InfoCircleTwoTone, SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, message, Modal, Space, Table, Tag, TimePicker, Select, Spin } from 'antd';
import { httpGetAll, httpGetChangeStatus } from "../../../../api/booking";
import Highlighter from 'react-highlight-words';
import { employeeStatistics, httpGetOne } from "../../../../api/employee";
import moment from "moment";
const ListBookingByEmployee = (props) => {
    const format = 'HH';
    const { Option } = Select;
    const [searchText, setSearchText] = useState('');
    const [employeeStatic, setEmpoyeeStatic] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [titleModal, setTitleModal] = useState("");
    const [fillerMonth, setFillterMonth] = useState("");
    const [loading, setLoading] = useState(false);
    const [fillterYear, setFillterYear] = useState("");
    const [handleBooking, setHandleBooking] = useState();
    const [ishandle, setIshandle] = useState();
    const [employee, setEmployee] = useState();
    const [booking, setBooking] = useState();

    // eslint-disable-next-line react/prop-types
    // eslint-disable-next-line react/prop-types
    // eslint-disable-next-line react/prop-types

    const employe = JSON.parse(localStorage.getItem('user'));

    // eslint-disable-next-line react/prop-types

    // eslint-disable-next-line react/prop-types

    // eslint-disable-next-line react/prop-types
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const renderTime = (value) => {
        const d = new Date(value)
        let time = d.getHours();
        if (time.toString().length == 1) {
            time = `0${time}: 00`
        } else {
            time = `${time}: 00`
        }
        if (value == undefined) {
            return ""
        }
        return time
    }

    const renderDate = (value) => {
        const d = new Date(value)
        let date = d.getDate();
        let month = d.getMonth() + 1;
        if (date.toString().length == 1) {
            date = `0${date}`;
        }
        if (month.toString().length == 1) {
            month = `0${month}`;
        }
        return `${d.getFullYear()}-${month}-${date}`;
    }

    function formatCash(str) {
        const string = str.toString()
        return string.split('').reverse().reduce((prev, next, index) => {
            return ((index % 3) ? next : (next + ',')) + prev
        })
    }

    const showModal = (e) => {
        // eslint-disable-next-line react/prop-types
        let isButon = e.target.getAttribute("data");
        let idBooking = e.target.getAttribute("dataId");
        let show = e.target.getAttribute("isshow");
        if (isButon == null) {
            isButon = e.target.offsetParent.getAttribute("data");
            idBooking = e.target.offsetParent.getAttribute("dataId");
            show = e.target.offsetParent.getAttribute("isshow");
        }
        // eslint-disable-next-line react/prop-types
        booking?.map(async (item) => {
            if (item._id == idBooking) {
                if (item.status == isButon
                    || show == "false"
                ) {
                    return
                }
                await setIsModalOpen(true);
            }
        })

        // eslint-disable-next-line react/prop-types
        booking?.map(async (item) => {
            if (item._id == idBooking) {
                await setHandleBooking(item)
                return
            }
        })
        setIshandle(isButon)
        if (isButon === "3") {
            setTitleModal("Hoàn thành")
        } else {
            setTitleModal("Thông tin")
        }
    };

    // eslint-disable-next-line no-unused-vars
    const handleOk = async () => {
        if (ishandle === "5") {
            setIsModalOpen(false);
            return
        }
        setIsModalOpen(false);
        if (ishandle === "3") {
            try {
                await httpGetChangeStatus(handleBooking._id, { status: 3 })
                message.success(`Chờ thanh toán "${handleBooking.name}"`)
                const res = await httpGetAll()
                setBooking(res)
                const notification = {
                    id: handleBooking._id,
                    notificationType: "admin",
                    text: `Nhân viên ${user.name} đã hoàn thành đơn làm việc ${handleBooking._id}.`,
                    from: user.id,
                };
                socket.emit(SocketEvent.NEWNOTIFICATION, notification);
                socket.off(SocketEvent.NEWNOTIFICATION);
            } catch (error) {
                message.error(`${error.response.data.message}`)
            }
        }
        // eslint-disable-next-line react/prop-types

        // eslint-disable-next-line react/prop-types
        props.handleChangeStatus();
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
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
                    color: filtered ? '#1890ff' : undefined,
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
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const getColumnSearchDateTime = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
            >

                <DatePicker
                    // disabledDate={disabledDate}
                    onChange={async (e) => { setSelectedKeys([renderDate(e._d)]) }}
                    // onChange={setSelectedKeys([2022006])}
                    style={{
                        marginBottom: 8,
                        display: 'block',
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
                    color: filtered ? '#1890ff' : undefined,
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
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const getColumnSearchTime = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <TimePicker onChange={async (e) => { setSelectedKeys([renderTime(e._d).toString()]) }} style={{
                    marginBottom: 8,
                    display: 'block',
                }} format={format} />

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
                    color: filtered ? '#1890ff' : undefined,
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
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const columns = [
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
            render: (item) => {
                return (
                    <div style={{display: "none", fontSize : "20px"}}  className={item}><InfoCircleTwoTone /></div>
                )
            } 

        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),

        },
        {
            title: 'SĐT',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            ...getColumnSearchProps('phoneNumber')
        },
        {
            title: <span >
                Ngày

            </span>,
            dataIndex: 'date',
            key: 'date',
            render: (data) => <span>{data}</span>,
            ...getColumnSearchDateTime("date")
            // filters: dateFilter,
            // onFilter: (value, record) => record.date.toString().indexOf(value) === 0,
        },
        {
            title: 'Giờ',
            dataIndex: 'time',
            key: 'time',
            ...getColumnSearchTime("time")
        },
        {
            title: 'Nhân viên',
            dataIndex: 'employeeId',
            key: 'employeeId',
        },

        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            filters: [
                {
                    text: 'Đã xác nhận',
                    value: '1',
                },
                {
                    text: 'Chờ thanh toán',
                    value: '3',
                },
                {
                    text: 'Hoàn thành',
                    value: '4',
                },
            ],
            onFilter: (value, record) => record.status.toString().indexOf(value) === 0,
            render: (status) => {
                let key = "Chờ xác nhận";
                let color = "volcano"
                if (status === 0) {
                    true
                } else if (status === 1) {
                    key = "Đã xác nhận"
                    color = "blue"
                }
                else if (status === 2) {
                    key = "Hủy"
                    color = "Silver"
                }
                else if (status === 3) {
                    key = "Chờ thanh toán"
                    color = "#69c20a"
                } else if (status === 4) {
                    key = "Hoàn thành"
                    color = "#0a5dc2"
                }

                return (
                    <Tag color={color} key={key}>
                        {key.toUpperCase()}
                    </Tag>
                )

            },

        },
        {
            title: 'Hành động',
            dataIndex: "action",
            key: 'action',
            render: (item) => {
                // chờ
                // let showWait = "false"
                // let showSussces = "false"
                let showFailure = "false"
                let isShowInfo = "true";
                // let BtWaitCursor = "not-allowed"
                // let BtWaitColor = "#dedede"
                // // let BtWaitColor = "#cd3e3e"
                // // xác nhận
                // let BtSusscesCursor = "not-allowed"
                // let BtSusscessColor = "#dedede"
                // let BtSusscessColor = "#da0cc8"
                let BtInfoCursor = "pointer";
                let BtInfo = "#3934df";
                // hủy
                let BtFailureCursor = "not-allowed"
                let BtFailureColor = "#dedede"
                // let BtFailureColor = "green"

                if (item.status === 0) {
                    // chờ
                    // showSussces = "true"
                    // showWait = "true"
                    // BtSusscesCursor = "pointer"
                    // BtSusscessColor = "#da0cc8"
                    // BtWaitCursor = "not-allowed"
                    // BtWaitColor = "#cd3e3e"
                } else if (item.status === 1) {
                    BtFailureCursor = "pointer"
                    BtFailureColor = "green"
                    showFailure = "true"
                    // xác nhận

                }
                return (

                    <Select
                        style={{ width: "170px", color: "blue", textAlign: "center" }}
                        value="Đổi trạng thái"
                    >
                        {/* <Option value="3"> <Button isshow={showSussces} onClick={showModal} dataId={item._id} data="3" style={{ cursor: BtSusscesCursor, backgroundColor: BtSusscessColor, border: "none", color: "white", width: "100%" }} >
                            Đang diễn ra
                        </Button></Option> */}
                        <Option value="3">  <Button isshow={showFailure} onClick={showModal} dataId={item._id} data="3" type="danger" style={{ cursor: BtFailureCursor, backgroundColor: BtFailureColor, border: "none", color: "white", width: "100%" }} >
                            Chờ thanh toán
                        </Button></Option>
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

                    </Select >
                )
            },
        },
    ];
    let datatable = [];
    // eslint-disable-next-line react/prop-types
    booking?.forEach((item) => {
        if (item.employeeId?._id == employee?._id && item.status == 1 || item.employeeId?._id == employee?._id && item.status == 4 || item.employeeId?._id == employee?._id && item.status == 3) {
            const time = renderTime(item.time)
            const date = renderDate(item.date)
            datatable.push({
                name: item.name,
                phoneNumber: item.phoneNumber,
                status: item.status,
                date: date,
                time: time,
                employeeId: item.employeeId?.name,
                action: (item),
                id: item._id
            })
        }
    })

    // eslint-disable-next-line react/prop-types
   
    const onChangeMonth = async (date, dateString) => {
        if (date == "") {
            setFillterMonth("");
        } else {
            setLoading(true)
            const month = moment(date).format("MM")
            const year = moment(date).format("YYYY")
            const res = await employeeStatistics(employee?._id, month, year);
            setEmpoyeeStatic(res)
            setFillterYear("");
            setFillterMonth(dateString);
        }
        setLoading(false)
    }

    const onChangeYear = async (date, dateString) => {

        if (date == "") {
            setFillterYear("");
        } else {
            setLoading(true)
            const year = moment(date).format("YYYY")
            const res = await employeeStatistics(employee?._id, undefined, year);
            setEmpoyeeStatic(res)
            setFillterMonth("");
            setFillterYear(dateString);
        }
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        const adminLogin = async () => {
            let res
            // eslint-disable-next-line react/prop-types
            if (props.dataAdminLogin != undefined) {
                // eslint-disable-next-line react/prop-types
                res = await httpGetOne(props.dataAdminLogin)
                // eslint-disable-next-line react/prop-types
                setEmployee(res)
            } else {
                if (employe) {
                    res = await httpGetOne(employe.employeeId)
                    setEmployee(res)

                }
            }
            const data = await employeeStatistics(res._id)
            console.log(data);
            const hightlight = async () => {
                // eslint-disable-next-line react/prop-types
             if (props.dataBookingId) {
                 // eslint-disable-next-line react/prop-types
                  const highlight = await document.getElementsByClassName(props.dataBookingId);
                 console.log(highlight);
                 if (highlight != undefined) {
                     highlight[0].style.display = "block";
                 }
             }
            }
            hightlight()
            setEmpoyeeStatic(data)
        }
        adminLogin()
        const getBooking = async () => {
            const res = await httpGetAll()
            setBooking(res)
        }

        getBooking()
          
        setLoading(false)

    // eslint-disable-next-line react/prop-types
    }, [props.dataBooking])
    return <Spin Spin spinning={loading} style={{
        position: "fixed",
        top: "25%",
        left: "8%"
    }}>
        <div className="w-full px-6 py-6 mx-auto">
            <div>
                <h1 className="mb-0 font-bold text-white capitalize pb-[20px] text-center text-[50px]">
                    Booking by {employee?.name}
                </h1>

            </div>
            <div className="b-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent">

                <Button
                    onClick={() => {
                        fillerMonth(""), fillterYear("");
                    }}
                    style={{
                        float: "right",
                        marginLeft: "3px",
                        backgroundColor: "#168ea0",
                        fontFamily: "monospace",
                        color: "white",
                    }}
                >
                    Làm mới
                </Button>
                <DatePicker
                    value={fillterYear == "" ? null : moment(fillterYear)}
                    placeholder="Lọc năm"
                    status="warning"
                    style={{
                        float: "right",
                        fontWeight: "bold",
                        marginLeft: "3px",
                    }}
                    onChange={onChangeYear}
                    picker="year"
                />
                <DatePicker
                    value={fillerMonth == "" ? null : moment(fillerMonth)}
                    placeholder="Lọc tháng "
                    status="warning"
                    style={{ float: "right", fontWeight: "bold" }}
                    onChange={onChangeMonth}
                    picker="month"
                />
            </div>
            <br />
            <div className="flex flex-wrap -mx-3 mt-7 ">
                {/* card1 */}
                <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4 ">
                    <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                        <div

                            className="flex-auto p-4"
                        >
                            <div className="flex flex-row -mx-3">
                                <div className="flex-none w-2/3 max-w-full px-3">
                                    <div>
                                        <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">
                                            Chờ Spa
                                        </p>
                                        <h5 className="mb-2 font-bold dark:text-white">{employeeStatic?.confirmed}
                                        </h5>
                                        <p className="mb-0 dark:text-white dark:opacity-60">
                                            <span className="text-sm font-bold leading-normal text-emerald-500">
                                                {/* +55% */}
                                            </span>
                                            {/* since yesterday */}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-3 text-right basis-1/3">
                                    <div className="inline-block w-12 h-12 text-center rounded-circle bg-gradient-to-tl">
                                        <img src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/null/external-spa-hairdresser-and-barber-shop-flaticons-lineal-color-flat-icons-3.png" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                    <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                        <div

                            className="flex-auto p-4"
                        >
                            <div className="flex flex-row -mx-3">
                                <div className="flex-none w-2/3 max-w-full px-3">
                                    <div>
                                        <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">
                                            Chờ thanh toán
                                        </p>
                                        <h5 className="mb-2 font-bold dark:text-white">{employeeStatic?.waitToPay}
                                        </h5>
                                        <p className="mb-0 dark:text-white dark:opacity-60">
                                            <span className="text-sm font-bold leading-normal text-emerald-500">
                                                {/* +55% */}
                                            </span>
                                            {/* since yesterday */}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-3 text-right basis-1/3">
                                    <div className="inline-block w-12 h-12 text-center rounded-circle bg-gradient-to-tl">
                                        <img src="https://img.icons8.com/cotton/64/null/receive-cash--v1.png" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                    <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                        <div

                            className="flex-auto p-4"
                        >
                            <div className="flex flex-row -mx-3">
                                <div className="flex-none w-2/3 max-w-full px-3">
                                    <div>
                                        <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">
                                            Hoàn thành
                                        </p>
                                        <h5 className="mb-2 font-bold dark:text-white">{employeeStatic?.finished}
                                        </h5>
                                        <p className="mb-0 dark:text-white dark:opacity-60">
                                            <span className="text-sm font-bold leading-normal text-emerald-500">
                                                {/* +55% */}
                                            </span>
                                            {/* since yesterday */}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-3 text-right basis-1/3">
                                    <div className="inline-block w-12 h-12 text-center rounded-circle bg-gradient-to-tl">
                                        <img src="https://img.icons8.com/doodle/48/null/checkmark.png" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {/* card2 */}

                <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                    <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">

                        <div

                            className="flex-auto p-4"
                        >
                            <div className="flex flex-row -mx-3">

                                <div className="flex-none w-2/3 max-w-full px-3">
                                    <div>
                                        <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">
                                            Đóng góp
                                        </p>
                                        <h5 className="mb-2 font-bold dark:text-white">
                                            {employeeStatic?.turnover?.toLocaleString("vi", {
                                                style: "currency",
                                                currency: "VND",
                                            })}
                                        </h5>
                                        <p className="mb-0 dark:text-white dark:opacity-60">
                                            <span className="text-sm font-bold leading-normal text-emerald-500">
                                                {/* +3% */}
                                            </span>
                                            {/* since last week */}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-3 text-right basis-1/3">
                                    <div className="inline-block w-12 h-12 text-center rounded-circle bg-gradient-to-tl ">
                                        <img src="https://img.icons8.com/color/48/null/banknotes.png" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* card3 */}

                {/* card4 */}

            </div>
            <Table className="mt-5" columns={columns} dataSource={datatable} />;

            <Modal style={{ fontFamily: "revert-layer" }} title={titleModal} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Tên Khách hàng: {handleBooking?.name}</p>
                <p>Tuổi: {handleBooking?.age}</p>
                <p>Giới tính: {handleBooking?.gender == 1 ? 'Nữ' : "Nam"}</p>
                <p>Số điện thoại: {handleBooking?.phoneNumber}</p>
                <p>Ngày: {renderDate(handleBooking?.date)}</p>
                <p>Giờ đến: {renderTime(handleBooking?.time)}</p>
                <p>Nhân viên: {handleBooking?.employeeId.name}</p>
                <p>Dịch vụ:
                    <ul>
                        {handleBooking?.serviceId?.map((item) => {
                            return (
                                // eslint-disable-next-line react/jsx-key
                                <li>{item.name}</li>
                            )

                        })}
                    </ul>
                </p>
                <p>Thanh toán: {formatCash(handleBooking?.bookingPrice || "0")}</p>
                <p>Note: {handleBooking?.note}</p>
            </Modal>
        </div>;
    </Spin>
};
export default ListBookingByEmployee;