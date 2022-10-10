/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, message, Modal, Space, Table, Tag, TimePicker, Tooltip } from 'antd';
import { httpGetChangeStatus } from "../../../../api/booking";
import Highlighter from 'react-highlight-words';
import { httpGetOne } from "../../../../api/employee";
const ListBookingByEmployee = (props) => {
    const format = 'HH';
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [titleModal, setTitleModal] = useState("Đang diễn ra");
    const [handleBooking, setHandleBooking] = useState();
    const [ishandle, setIshandle] = useState();
    const [isEmploye, setIsemploye] = useState();
    // eslint-disable-next-line react/prop-types
    const booking = props.dataBooking
    // eslint-disable-next-line react/prop-types

    const isEmployee = JSON.parse(localStorage.getItem('user'));
    if (isEmployee) {
        console.log(isEmployee
        );
    }
    // eslint-disable-next-line react/prop-types
    const service = props.dataService?.map((item) => {
        return {
            text: item.name,
            value: item.name,
        }
    })
    // eslint-disable-next-line react/prop-types

    // eslint-disable-next-line react/prop-types
    console.log(props);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const onOk = (value) => {
        // console.log("...."+ employeeBooking);

        console.log("onOk: ", value);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const renderTime = (value) => {
        const d = new Date(value)
        let time = d.getHours();
        if (time.toString().length == 1) {
            time = `0${time}`
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
    const showModal = (e) => {
        // eslint-disable-next-line react/prop-types
        const isButon = e.target.getAttribute("data");
        const idBooking = e.target.getAttribute("dataId");
        console.log(idBooking);
        // eslint-disable-next-line react/prop-types
        booking.map(async (item) => {
            if (item._id == idBooking) {
                if (item.status == isButon) {
                    return
                }
                await setIsModalOpen(true);
            }
        })

        // eslint-disable-next-line react/prop-types
        booking.map(async (item) => {
            if (item._id == idBooking) {
                await setHandleBooking(item)
                console.log(item);
                return
            }
        })
        setIshandle(isButon)
        if (isButon === "3") {
            setTitleModal("Chuyển sang Đang diễn ra")
        } else if (isButon === "4") {
            setTitleModal("Chuyển sang Hoàn thành")
        } else {
            setTitleModal("Chuyển sang khách không đến")
        }
    };

    // eslint-disable-next-line no-unused-vars
    const handleOk = async () => {
        setIsModalOpen(false);
        console.log(ishandle);
        if (ishandle === "3") {
            try {
                await httpGetChangeStatus(handleBooking._id, { status: 3 })
                message.success(`Xác nhận khách hàng "${handleBooking.name}"`)
            } catch (error) {
                message.error(`${error.response.data.message}`)
            }
        } else if (ishandle === "4") {
            try {
                await httpGetChangeStatus(handleBooking._id, { status: 4 })
                message.success(`Hủy khách hàng "${handleBooking.name}"`)
            } catch (error) {
                message.error(`${error.response.data.message}`)
            }
        } else {
            try {
                await httpGetChangeStatus(handleBooking._id, { status: 5 })

                message.success(`Reset chờ khách hàng "${handleBooking.name}"`)
            } catch (error) {
                message.error(`${error.response.data.message}`)
            }
        }
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
                    onChange={async (e) => { console.log(renderDate(e._d)), setSelectedKeys([renderDate(e._d)]) }}
                    // onChange={setSelectedKeys([2022006])}
                    onOk={onOk}
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
                <TimePicker onChange={async (e) => { console.log(renderTime(e._d)), setSelectedKeys([renderTime(e._d).toString()]) }} style={{
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Phone',
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
            title: 'Dịch vụ',
            dataIndex: 'serviceId',
            key: 'serviceId',
            filters: service,
            onFilter: (value, record) => record.serviceId.indexOf(value) === 0,
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            filters: [
                {
                    text: 'Đã xác nhận',
                    value: '1',
                },

                {
                    text: 'Đang diễn ra',
                    value: '3',
                },
                {
                    text: 'Hoàn thành',
                    value: '4',
                },
                {
                    text: 'Khách không đến',
                    value: '5',
                }
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
                } else if (status === 3) {
                    key = "Đang diễn ra"
                    color = "#da0cc8"
                } else if (status === 4) {
                    key = "Hoàn thành"
                    color = "#69c20a"
                }
                else {
                    key = "Khách không đến"
                    color = "#bc0808"
                }
                return (
                    <Tag color={color} key={key}>
                        {key.toUpperCase()}
                    </Tag>
                )

            },

        },
        {
            title: 'Action',
            dataIndex: "action",
            key: 'action',
            render: (item) => {
                // chờ
                let BtWaitCursor
                let BtWaitColor = "#bc0808"
                // xác nhận
                let BtSusscesCursor
                let BtSusscessColor = "#da0cc8"
                // hủy
                let BtFailureCursor
                let BtFailureColor = "green"

                if (item.status === 5) {
                    // chờ
                    BtWaitCursor = "not-allowed"
                    BtWaitColor = "#f9f6f6"
                } else if (item.status === 3) {
                    // xác nhận
                    BtSusscesCursor = "not-allowed"
                    BtSusscessColor = "#f9f6f6"
                } else if (item.status === 4) {
                    // hủy
                    BtFailureCursor = "not-allowed"
                    BtFailureColor = "#f9f6f6"
                }
                return (
                    <Space size="middle">
                        <Tooltip title="Đang diễn ra">
                            <Button style={{ border: "none", cursor: BtSusscesCursor, color: BtSusscessColor }} shape="circle" >
                                <i style={{ fontSize: "25px" }} onClick={showModal} dataId={item._id} data="3" class="far fa-clock"></i></Button>
                        </Tooltip>
                        <Tooltip title="Hoàn thành">
                            <Button style={{ border: "none", cursor: BtFailureCursor, color: BtFailureColor }} shape="circle" ><i style={{ fontSize: "25px" }} onClick={showModal} dataId={item._id} data="4" class="far fa-check-circle"></i></Button>
                        </Tooltip>
                        <Tooltip title="Khách không đến">
                            <Button style={{ border: "none", cursor: BtWaitCursor, color: BtWaitColor }} shape="circle" >
                                <i style={{ fontSize: "25px" }} onClick={showModal} dataId={item._id} data="5" class="fas fa-exclamation-circle"></i>
                            </Button>
                        </Tooltip>

                    </Space>
                )
            },
        },
    ];
    let datatable = [];
    // eslint-disable-next-line react/prop-types
    booking?.forEach((item) => {
        console.log(item);
        if (item.employeeId._id == isEmploye?._id && item.status != 0 && item.status != 2) {
            const time = renderTime(item.time)
            const date = renderDate(item.date)
            datatable.push({
                name: item.name,
                phoneNumber: item.phoneNumber,
                status: item.status,
                date: date,
                time: time,
                employeeId: item.employeeId.name,
                serviceId: item.serviceId[0].name,
                action: (item)
            })
        }
    })
    useEffect(() => {
        const getEmployee = async () => {
            const res = await httpGetOne(isEmployee.id)
            setIsemploye(res)
            console.log(res);
        }
        getEmployee()
    }, [])
    return <div className="w-full px-6 py-6 mx-auto">
        <div>
            <h1 className="mb-0 font-bold text-white capitalize pb-[20px] text-center text-[50px]">
                List Booking By {isEmploye?.name}
            </h1>
        </div>

        <Table columns={columns} dataSource={datatable} />;

        <Modal style={{ fontFamily: "revert-layer" }} title={titleModal} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Tên Khách hàng: {handleBooking?.name}</p>
            <p>Số điện thoại: {handleBooking?.phoneNumber}</p>
            <p>Ngày: {renderDate(handleBooking?.date)}</p>
            <p>Giờ đến: {renderTime(handleBooking?.time)}</p>
            <p>Nhân viên: {handleBooking?.employeeId.name}</p>
            <p>Dịch vụ: {handleBooking?.serviceId[0].name}</p>
            <p>Note: {handleBooking?.note}</p>
        </Modal>
    </div>;
};
export default ListBookingByEmployee;