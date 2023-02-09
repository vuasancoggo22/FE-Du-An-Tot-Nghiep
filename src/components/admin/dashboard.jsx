/* eslint-disable react/no-unknown-property */
import { Button, DatePicker, message } from "antd";
import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { httpGetAll, statusStatistic } from "../../api/booking";
import { employeeOrderStatistics } from "../../api/employee";
import {
  groupAgeByService,
  groupGenderByService,
  servicesStatistic,
  turnoverServicesMonth,
} from "../../api/services";
import { httpGetTopUser, userAccountStatistics } from "../../api/user";
import moment from "moment";
import ReactApexChart from "react-apexcharts";
const Dashboard = () => {
  const [booking, setBooking] = useState([]);
  const [employees, setEmployees] = useState();
  const [service, setService] = useState();
  const [acCount, setaccCount] = useState();
  const [loading, setLoading] = useState(false);
  const [topUser, setTopUser] = useState();
  const [turnover, setTurnover] = useState();
  const [cancel, setCancel] = useState();
  const [ageByService, setAgeByService] = useState();
  const [genderByService, setGenderByService] = useState();
  const [serviceFilter, setServiceFilter] = useState(""); // năm
  const [employeeFilterDate, setEmployeeFilterDate] = useState("");
  const [employeeFilterMonth, setEmployeeFilterMonth] = useState("");
  const [employeeFilterYear, setEmployeeFilterYear] = useState("");
  const [serviceFilterMonth, setServiceFilterMonth] = useState("");
  const [dataChart, setDataChart] = useState();
  const [lableChart, setLableChart] = useState();
  // const [dataChartService, setDataChartService] = useState();
  const [chartYear, setChartYear] = useState(moment().format("YYYY"));
  const [isChart, setIsChart] = useState("turnover");

  // function formatCash(str) {
  //   const string = str.toString();
  //   return string
  //     .split("")
  //     .reverse()
  //     .reduce((prev, next, index) => {
  //       return (index % 3 ? next : next + ",") + prev;
  //     });
  // }
  const datavl = {
    series: dataChart != undefined ? dataChart : "",
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: -10,
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      xaxis: lableChart != undefined ? lableChart : "",
      legend: {
        position: "right",
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    },
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

  const countCustomerByEmployee = (idEmployee) => {
    let coutn = 0;
    const thisday = new Date();
    const today = `${thisday.getFullYear()}-${
      thisday.getMonth() + 1
    }-${thisday.getDate()}`;
    booking?.forEach((item) => {
      let dayItem = renderDate(item.date);
      if (item.employeeId != undefined) {
        if (
          idEmployee == item.employeeId?._id &&
          dayItem == today &&
          item.status != 0 &&
          item.status != 2 &&
          item.status != 5
        ) {
          coutn += 1;
        }
      }
    });
    return coutn;
  };

  const onChangeYearService = async (date, dateString) => {
    if (date == "") {
      setServiceFilter("");
    } else {
      setLoading(true);
      const year = moment(date).format("YYYY");
      const res = await servicesStatistic(undefined, year);
      const arr = {
        services: [...res],
      };
      setService(arr);
      setServiceFilter(dateString);
      setServiceFilterMonth("");
    }
    setLoading(false);
  };

  const onChangeMonthService = async (date, dateString) => {
    if (date == "") {
      setServiceFilterMonth("");
    } else {
      setLoading(true);
      const month = moment(date).format("MM");
      const year = moment(date).format("YYYY");
      const res = await servicesStatistic(month, year);
      const arr = {
        services: [...res],
      };
      setService(arr);
      setServiceFilter("");
      setServiceFilterMonth(dateString);
    }
    setLoading(false);
  };

  const onChangeMonthEmployee = async (date, dateString) => {
    if (date == "") {
      setEmployeeFilterMonth("");
    } else {
      setLoading(true);
      const month = moment(date).format("MM");
      const year = moment(date).format("YYYY");
      const res = await employeeOrderStatistics(month, year);
      setEmployees(res);
      setEmployeeFilterMonth(dateString);
    }
    setEmployeeFilterYear("");
    setLoading(false);
  };

  const onChangeYearEmployee = async (date, dateString) => {
    if (date == "") {
      setEmployeeFilterYear("");
    } else {
      setLoading(true);
      const year = moment(date).format("YYYY");
      const res = await employeeOrderStatistics(undefined, year);
      setEmployees(res);
      setEmployeeFilterYear(dateString);
    }
    setEmployeeFilterMonth("");
    setEmployeeFilterDate("");
    setLoading(false);
  };

  // eslint-disable-next-line no-unused-vars
  const colorbyRevenue = (revenue) => {
    if (revenue <= 33) {
      return "red";
    } else if (revenue <= 66) {
      return "blue";
    } else {
      return "#13c2c2";
    }
  };

  const onChangeYearChart = (date, dateString) => {
    setChartYear(dateString);
  };

  const countCustomerSpaIngByEmployee = (idEmployee) => {
    let coutn = 0;
    const thisday = new Date();
    const today = `${thisday.getFullYear()}-${
      thisday.getMonth() + 1
    }-${thisday.getDate()}`;
    booking?.forEach((item) => {
      let dayItem = renderDate(item.date);
      if (
        idEmployee == item.employeeId?._id &&
        dayItem == today &&
        item.status == 3
      ) {
        coutn += 1;
      }
    });
    return coutn;
  };

  const countCustomerSpaSuccessByEmployee = (idEmployee) => {
    let coutn = 0;
    const thisday = new Date();
    const today = `${thisday.getFullYear()}-${
      thisday.getMonth() + 1
    }-${thisday.getDate()}`;
    booking?.forEach((item) => {
      let dayItem = renderDate(item.date);
      if (
        idEmployee == item.employeeId?._id &&
        dayItem == today &&
        item.status == 4
      ) {
        coutn += 1;
      }
    });
    return coutn;
  };

  const totalTurnover = () => {
    let sum = 0;
    turnover?.allData.map((item) => {
      item.datas.map((current) => {
        sum += current;
      });
    });
    return sum.toLocaleString("vi", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleChooseChart = async (e) => {
    const isChart = e.target.getAttribute("data");
    let year = moment().format("YYYY");
    if (chartYear != "") {
      year = chartYear;
    } else {
      setChartYear(year);
    }
    if (isChart == "turnover") {
      setIsChart("turnover");
      setDataChart(
        turnover?.allData.map((item) => {
          return {
            name: item.service.name,
            data: item.datas,
          };
        })
      );
      //
      setLableChart({
        type: "",
        categories: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
      });
    } else if (isChart == "user") {
      setIsChart("user");
      setDataChart([
        {
          name: "Tài khoản kích hoạt",
          data: [acCount.availableUser],
        },
        {
          name: "Tài khoản bị khóa",
          data: [acCount.lockUser],
        },
        {
          name: "Tài khoản chưa kích hoạt",
          data: [acCount.unActiveUser],
        },
      ]);
      //
      setLableChart({
        type: "",
        categories: ["Tất cả thời gian"],
      });
    } else if (isChart == "ageBySerVice") {
      setIsChart("ageBySerVice");
      setDataChart(ageByService.groupAge);
      //
      setLableChart({
        type: "",
        categories: ageByService.categories,
      });
    } else if (isChart == "genderBySerVice") {
      setIsChart("genderBySerVice");
      setDataChart(genderByService.groupGender);
      //
      setLableChart({
        type: "",
        categories: genderByService.categories,
      });
    }else if (isChart == "cancel") {
      setIsChart("cancel");
      setDataChart(
        cancel?.allData.map((item) => {
          return {
            name: item.service.name,
            data: item.datas,
          };
        })
      );
      //
      setLableChart({
        type: "",
        categories: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
      });
    }

  };

  const newFilterService = async () => {
    setLoading(true);
    const res = await servicesStatistic();
    await setService(res);
    setServiceFilter("");
    setServiceFilterMonth("");
    setLoading(false);
  };

  const newFilterEmployee = async () => {
    setLoading(true);
    const res = await employeeOrderStatistics(undefined, undefined);
    setEmployees(res);
    setEmployeeFilterYear("");
    setEmployeeFilterMonth("");
    setLoading(false);
  };

  const totalCancel = () => {
    let count = 0
    cancel?.allData.map((item) => {
      item.datas.map((current) => {
        count += current
      })
    })
    return count
  }

  useEffect(() => {
    const getBooking = async () => {
      const res = await httpGetAll();
      await setBooking(res);
      // setTatalChartBefor(countBefor);
      // setDataChartFirst(arrData);
    };
    getBooking();

    const getUserTop = async () => {
      const res = await httpGetTopUser();
      await setTopUser(res);
      console.log(res);
      // setTatalChartBefor(countBefor);
      // setDataChartFirst(arrData);
    };
    getUserTop();

    const getAgeByService = async () => {
      const res = await groupAgeByService();
      setAgeByService(res);
    };
    getAgeByService();

    const getCancel = async () => {
      let year = moment().format("YYYY");
      if (chartYear != "") {
        year = chartYear;
      }
      const res = await statusStatistic(year);
      setCancel(res);
    };
    getCancel();

    const getGenderByService = async () => {
      const res = await groupGenderByService();
      setGenderByService(res);
      console.log(res);
    };
    getGenderByService();

    const getTurnover = async () => {
      let year = moment().format("YYYY");
      if (chartYear != "") {
        year = chartYear;
      }
      setLoading(true);
      const res = await turnoverServicesMonth(year);
      await setTurnover(res);
      console.log(res);
      setDataChart(
        res.allData.map((item) => {
          return {
            name: item.service.name,
            data: item.datas,
          };
        })
      );
      //
      setLableChart({
        type: "",
        categories: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
      });
      setLoading(false);
    };
    getTurnover();

    const getServicesStatistic = async () => {
      const res = await servicesStatistic();
      await setService(res);
      console.log(res);
    };
    getServicesStatistic();

    const getAccount = async () => {
      const res = await userAccountStatistics();
      message.error;
      await setaccCount(res);
    };
    getAccount();

    const getEmployee = async () => {
      try {
        const res = await employeeOrderStatistics(undefined, undefined);
        setEmployees(res);
      } catch (error) {
        message.error(`${error.response.data.message}`);
      }
    };
    getEmployee();
  }, [chartYear]);
  return (
    <Spin
      spinning={loading}
      style={{
        position: "fixed",
        top: "25%",
        left: "8%",
      }}
    >
      <div className="w-full px-6 mx-auto">
        <div style={{ height: "" }}>
          <h1
            style={{ justifyContent: "space-between", alignItems: "center" }}
            className="mb-0 font-bold text-white text-center setChartLable text-[50px]"
          >
            <span>Thống kê</span>
          </h1>
        </div>
        <div style={{ marginTop: "20px", fontWeight: "bold" }}>
          <span
            style={{
              fontSize: "20px",
              color: "white",
              textDecoration: "underline",
            }}
          >
            {" "}
            Thống kê {chartYear != "" ? chartYear : "tất cả thời gian"}
          </span>
          <Button
            onClick={() => {
              setChartYear("");
            }}
            style={{
              float: "right",
              marginLeft: "3px",
              backgroundColor: "#525252",
              fontFamily: "monospace",
              color: "#fbff08",
              fontWeight: "bold",
            }}
          >
            Làm mới
          </Button>
          <DatePicker
            value={chartYear == "" ? null : moment(chartYear)}
            placeholder="Lọc năm"
            status="warning"
            style={{ float: "right", marginLeft: "3px" }}
            onChange={onChangeYearChart}
            picker="year"
          />
        </div>{" "}
        <br />
        <div className="flex flex-wrap -mx-3 mt-3">
          {/* card1 */}
          <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/5">
            <div
              style={{
                backgroundColor: isChart == "turnover" ? "#525252" : "white",
                color: isChart == "turnover" ? "white" : "",
              }}
              className="relative flex flex-col min-w-0 break-words shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border"
            >
              <div className="flex-auto p-4 ">
                <div className="flex flex-row -mx-3">
                  <div className="flex-none w-2/3 max-w-full px-3">
                    <div>
                      <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">
                        Doanh thu
                      </p>
                      <h5
                        style={{ color: isChart == "turnover" ? "white" : "" }}
                        className="mb-2 font-bold dark:text-white"
                      >
                        {totalTurnover()}
                      </h5>
                      <p
                        style={{
                          color: isChart != "turnover" ? "#fbff08" : "#168ea0 ",
                        }}
                        className="mb-0 dark:texgenderBySerVicet-white dark:opacity-60"
                      >
                        {/* since yesterday */}
                      </p>
                    </div>
                  </div>
                  <div className="px-3 text-right basis-1/3">
                    <div className="inline-block w-12 h-12 text-center rounded-circle bg-gradient-to-tl ">
                      <img src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/000000/external-assets-factory-flaticons-lineal-color-flat-icons-3.png" />
                    </div>
                  </div>
                </div>
                <button>
                  <span
                    style={{
                      color: isChart != "turnover" ? "#168ea0" : "#fbff08",
                    }}
                    data="turnover"
                    onClick={handleChooseChart}
                    className="text-sm font-bold leading-normal "
                  >
                    Xem biểu đồ năm {chartYear}
                  </span>
                </button>
              </div>
            </div>
          </div>
           <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/5">
            <div
              style={{
                backgroundColor: isChart == "cancel" ? "#525252" : "white",
                color: isChart == "cancel" ? "white" : "",
              }}
              className="relative flex flex-col min-w-0 break-words shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border"
            >
              <div className="flex-auto p-4 ">
                <div className="flex flex-row -mx-3">
                  <div className="flex-none w-2/3 max-w-full px-3">
                    <div>
                      <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">
                         Đơn hủy 
                      </p>
                      <h5
                        style={{ color: isChart == "cancel" ? "white" : "" }}
                        className="mb-2 font-bold dark:text-white"
                      >
                        {totalCancel()}
                      </h5>
                      <p
                        style={{
                          color: isChart != "cancel" ? "#fbff08" : "#168ea0 ",
                        }}
                        className="mb-0 dark:texgenderBySerVicet-white dark:opacity-60"
                      >
                        {/* since yesterday */}
                      </p>
                    </div>
                  </div>
                  <div className="px-3 text-right basis-1/3">
                    <div className="inline-block w-12 h-12 text-center rounded-circle bg-gradient-to-tl ">
                      <img src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/000000/external-assets-factory-flaticons-lineal-color-flat-icons-3.png" />
                    </div>
                  </div>
                </div>
                <button>
                  <span
                    style={{
                      color: isChart != "cancel" ? "#168ea0" : "#fbff08",
                    }}
                    data="cancel"
                    onClick={handleChooseChart}
                    className="text-sm font-bold leading-normal "
                  >
                    Xem biểu đồ năm {chartYear}
                  </span>
                </button>
              </div>
            </div>
          </div>
          {/* card2 */}
          <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/5">
            <div
              style={{
                backgroundColor: isChart == "user" ? "#525252" : "white",
                color: isChart == "user" ? "white" : "",
              }}
              className="relative flex flex-col min-w-0 break-words shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border"
            >
              <div className="flex-auto p-4">
                <div className="flex flex-row -mx-3">
                  <div className="flex-none w-2/3 max-w-full px-3">
                    <div>
                      <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">
                        Tài khoản
                      </p>
                      <h5
                        style={{ color: isChart == "user" ? "white" : "" }}
                        className="mb-2 font-bold dark:text-white"
                      >
                        {acCount?.totalUser}
                      </h5>
                      <p
                        style={{
                          color: isChart != "user" ? "#168ea0" : "#fbff08",
                        }}
                        className="mb-0 dark:text-white dark:opacity-60"
                      >
                        <button>
                          {" "}
                          <span
                            onClick={handleChooseChart}
                            data="user"
                            className="text-sm font-bold leading-normal "
                          >
                            Xem biểu đồ
                          </span>
                        </button>
                        {/* since last week */}
                      </p>
                    </div>
                  </div>

                  <div className="px-3 text-right basis-1/3">
                    <div className="inline-block w-12 h-12 text-center rounded-circle bg-gradient-to-tl">
                      <img src="https://img.icons8.com/fluency/48/null/guest-male.png" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* card3 */}
          <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/5">
            <div
              style={{
                backgroundColor:
                  isChart == "genderBySerVice" ? "#525252" : "white",
                color: isChart == "genderBySerVice" ? "white" : "",
              }}
              className="relative flex flex-col min-w-0 break-words shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border"
            >
              <div className="flex-auto p-4">
                <div className="flex flex-row -mx-3">
                  <div className="flex-none w-2/3 max-w-full px-3">
                    <div>
                      <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">
                        Giới tính
                      </p>
                      <h5
                        style={{
                          color: isChart == "genderBySerVice" ? "white" : "",
                        }}
                        className="mb-2 font-bold dark:text-white"
                      >
                        Biểu đồ
                      </h5>
                      <p
                        style={{
                          color:
                            isChart != "genderBySerVice"
                              ? "#168ea0"
                              : "#fbff08",
                        }}
                        className="mb-0 dark:text-white dark:opacity-60"
                      >
                        <button>
                          <span
                            data="genderBySerVice"
                            onClick={handleChooseChart}
                            className="text-sm font-bold leading-normal "
                          >
                            Xem biểu đồ
                          </span>
                        </button>
                        {/* than last month */}
                      </p>
                    </div>
                  </div>
                  <div className="px-3 text-right basis-1/3">
                    <div className="inline-block w-12 h-12 text-center rounded-circle bg-gradient-to-tl ">
                      <img src="https://img.icons8.com/color/48/null/unisex--v2.png" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* card4 */}
          <div className="w-full max-w-full px-3 sm:w-1/2 sm:flex-none xl:w-1/5">
            <div
              style={{
                backgroundColor:
                  isChart == "ageBySerVice" ? "#525252" : "white",
                color: isChart == "ageBySerVice" ? "white" : "",
              }}
              className="relative flex flex-col min-w-0 break-words shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border"
            >
              <div className="flex-auto p-4">
                <div className="flex flex-row -mx-3">
                  <div className="flex-none w-2/3 max-w-full px-3">
                    <div>
                      <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase dark:text-white dark:opacity-60">
                        Độ tuổi
                      </p>
                      <h5
                        style={{
                          color: isChart == "ageBySerVice" ? "white" : "",
                        }}
                        className="mb-2 font-bold dark:text-white"
                      >
                        Biểu đồ
                      </h5>
                      <p
                        style={{
                          color:
                            isChart != "ageBySerVice" ? "#168ea0" : "#fbff08",
                        }}
                        className="mb-0 dark:text-white dark:opacity-60"
                      >
                        <button>
                          <span
                            data="ageBySerVice"
                            onClick={handleChooseChart}
                            className="text-sm font-bold leading-normal "
                          >
                            Xem biểu đồ
                          </span>
                        </button>
                      </p>
                      {/* since yesterday */}
                    </div>
                  </div>
                  <div className="px-3 text-right basis-1/3">
                    <div className="inline-block w-12 h-12 text-center rounded-circle bg-gradient-to-tl ">
                      <img src="https://img.icons8.com/color/48/null/growing-up-skin-type-5.png" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-full px-3 sm:w-1/2 sm:flex-none xl:w-1/5">
            <div
              style={{
                backgroundColor: isChart == "employee" ? "#525252" : "",
                color: isChart == "employee" ? "white" : "",
              }}
              className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border"
            ></div>
          </div>
        </div>
        <div className="w-full px-6 py-6 mx-auto">
          <div className="app">
            <div className="row">
              <div className="mixed-chart mt-[120px]">
                <ReactApexChart
                  options={datavl.options}
                  series={datavl.series}
                  type="bar"
                  s
                  height={350}
                />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>

      <div className="w-full px-3 py-6 mx-auto">
        <div className="flex flex-wrap -mx-3 ">
          <div className="flex-none w-full max-w-full px-3">
            <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
              <div className="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
                <h6
                  style={{
                    float: "left",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                  className="dark:text-white"
                >
                  Thống kê nhân viên{" "}
                  <span
                    className="text-[#005e2e]"
                    style={{
                      textDecoration: "underline",
                      textDecorationColor: "#005e2e",
                    }}
                  >
                    {employeeFilterMonth != ""
                      ? employeeFilterMonth
                      : employeeFilterYear != ""
                      ? employeeFilterYear
                      : "tất cả thời gian"}
                  </span>
                </h6>
                <Button
                  onClick={() => {
                    newFilterEmployee();
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
                  value={
                    employeeFilterYear == "" ? null : moment(employeeFilterYear)
                  }
                  placeholder="Lọc năm"
                  status="warning"
                  style={{
                    float: "right",
                    fontWeight: "bold",
                    marginLeft: "3px",
                  }}
                  onChange={onChangeYearEmployee}
                  picker="year"
                />
                <DatePicker
                  value={
                    employeeFilterMonth == ""
                      ? null
                      : moment(employeeFilterMonth)
                  }
                  placeholder="Lọc tháng "
                  status="warning"
                  style={{
                    float: "right",
                    fontWeight: "bold",
                    marginLeft: "3px",
                  }}
                  onChange={onChangeMonthEmployee}
                  picker="month"
                />
              </div>
              <div className="flex-auto px-0 pt-0 pb-2">
                <div className="p-0 overflow-x-auto">
                  <table className="items-center w-full mb-0 align-top border-collapse dark:border-white/40 text-slate-500">
                    <thead className="align-bottom">
                      <tr>
                        <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-gray-700 opacity-70 text-sm">
                          Thông tin
                        </th>
                        <th
                          style={{
                            display:
                              employeeFilterDate ==
                              moment().format("YYYY-MM-DD")
                                ? "block"
                                : "none",
                          }}
                          className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-gray-700 opacity-70 text-sm"
                        >
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-gray-700 opacity-70 text-sm">
                          {employeeFilterDate == moment().format("YYYY-MM-DD")
                            ? "Tổng khách dự kiến"
                            : "Tổng khách đã làm"}
                        </th>
                        <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-gray-700 opacity-70 text-sm">
                          {employeeFilterDate == moment().format("YYYY-MM-DD")
                            ? "Khách đang làm"
                            : "Đóng góp doanh thu"}
                        </th>
                        <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-gray-700 opacity-70 text-sm">
                          {employeeFilterDate == moment().format("YYYY-MM-DD")
                            ? " Hoạt động"
                            : "Trạng thái"}
                        </th>
                        <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-gray-700 opacity-70 text-sm">
                          {employeeFilterDate == moment().format("YYYY-MM-DD")
                            ? " Khách hoàn thành"
                            : "Phần trăm (%)"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees?.statistics.map((item) => {
                        return (
                          // eslint-disable-next-line react/jsx-key
                          <tr>
                            <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                              <div className="flex px-2 py-1">
                                <div>
                                  <img
                                    src={item.employee.avatar}
                                    className="inline-flex items-center justify-center mr-4 text-sm text-white transition-all duration-200 ease-in-out h-9 w-9 rounded-xl"
                                    alt="user1"
                                  />
                                </div>
                                <div className="flex flex-col justify-center">
                                  <h6 className="mb-0 text-sm leading-normal dark:text-white text-[#005e2e]">
                                    {item.employee.name}
                                  </h6>
                                  <p className="mb-0 text-xs leading-tight dark:text-white dark:opacity-80 text-slate-400">
                                    {item.employee.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td
                              style={{
                                display:
                                  employeeFilterDate ==
                                  moment().format("YYYY-MM-DD")
                                    ? ""
                                    : "none",
                              }}
                              className="p-2 text-sm leading-normal text-center align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent"
                            >
                              <span
                                className={
                                  item.employee.status == 1
                                    ? "bg-gradient-to-tl from-emerald-500 to-teal-400 px-2.5 text-xs rounded-1.8 py-1.4 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white"
                                    : "bg-gradient-to-tl from-slate-600 to-slate-300 px-2.5 text-xs rounded-1.8 py-1.4 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white"
                                }
                              >
                                {item.employee.status == 1
                                  ? "online"
                                  : "offline"}
                              </span>
                            </td>
                            <td className="p-2 text-center align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                              <span className="text-sm font-semibold leading-tight dark:text-white dark:opacity-80 text-slate-400">
                                {employeeFilterDate ==
                                moment().format("YYYY-MM-DD")
                                  ? countCustomerByEmployee(item._id)
                                  : item.finished}
                              </span>
                            </td>
                            <td className="p-2 text-center align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                              <span className="text-sm font-semibold leading-tight dark:text-white dark:opacity-80 text-slate-400">
                                {employeeFilterDate ==
                                moment().format("YYYY-MM-DD")
                                  ? countCustomerSpaIngByEmployee(item._id)
                                  : item.turnover.toLocaleString("vi", {
                                      style: "currency",
                                      currency: "VND",
                                    })}
                              </span>
                            </td>
                            <td className="p-2 align-middle bg-transparent text-center border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                              <span
                                style={{
                                  color:
                                    item.employee.status == 1
                                      ? "#a0d911"
                                      : item.employee.status == 0
                                      ? "#b83a1b"
                                      : item.employee.status == 2
                                      ? "#828282"
                                      : "#828282",
                                }}
                                className="text-sm font-semibold leading-tight dark:text-white dark:opacity-60"
                              >
                                {item.employee.status == 1
                                  ? "Đang làm việc"
                                  : item.employee.status == 0
                                  ? "Tạm nghỉ làm"
                                  : item.employee.status == 2
                                  ? "Đã nghỉ việc"
                                  : "Đã nghỉ việc"}
                              </span>
                            </td>
                            <td className="p-2 text-center align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                              <span className="text-sm font-semibold leading-tight dark:text-white dark:opacity-80 text-slate-400">
                                {employeeFilterDate ==
                                moment().format("YYYY-MM-DD") ? (
                                  countCustomerSpaSuccessByEmployee(item._id)
                                ) : (
                                  <div className="flex items-center justify-center">
                                    <span className="mr-2 text-sm font-semibold leading-tight dark:text-white dark:opacity-60">
                                      {item.percentage == null
                                        ? 0
                                        : item.percentage
                                            ?.toString()
                                            .substring(0, 5)}
                                      %
                                    </span>
                                    <div>
                                      <div className="text-xs h-0.75 w-30 m-0 flex overflow-visible rounded-lg bg-gray-200">
                                        <div
                                          style={{
                                            width: `${
                                              item.percentage == null
                                                ? 0
                                                : item.percentage
                                                    ?.toString()
                                                    .substring(0, 5)
                                            }%`,
                                            backgroundColor: colorbyRevenue(),
                                          }}
                                          className="flex flex-col justify-center h-auto overflow-hidden "
                                          role="progressbar"
                                          aria-valuenow={
                                            item.percentage == null
                                              ? 0
                                              : item.percentage
                                                  ?.toString()
                                                  .substring(0, 5)
                                          }
                                          aria-valuemin={0}
                                          aria-valuemax={100}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* card 2 */}
        <div className="flex flex-wrap -mx-3">
          <div className="flex-none w-full max-w-full px-3">
            <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
              <div className="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
                <h6
                  style={{
                    float: "left",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                  className="dark:text-white"
                >
                  Thống kê dịch vụ{" "}
                  <span
                    className="text-[#005e2e]"
                    style={{
                      textDecoration: "underline",
                      textDecorationColor: "#005e2e",
                    }}
                  >
                    {serviceFilter != ""
                      ? ` ${serviceFilter}`
                      : serviceFilterMonth != ""
                      ? serviceFilterMonth
                      : "tất cả thời gian"}
                  </span>{" "}
                  <br />
                  <span style={{ color: "red", fontSize: "16px" }}>
                    {" "}
                    {/* Tổng {totalTurnover()} */}
                  </span>{" "}
                </h6>{" "}
                <Button
                  onClick={() => {
                    newFilterService();
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
                  value={serviceFilter == "" ? null : moment(serviceFilter)}
                  placeholder="Lọc năm"
                  status="warning"
                  style={{
                    float: "right",
                    fontWeight: "bold",
                    marginLeft: "3px",
                  }}
                  onChange={onChangeYearService}
                  picker="year"
                />
                <DatePicker
                  value={
                    serviceFilterMonth == "" ? null : moment(serviceFilterMonth)
                  }
                  placeholder="Lọc tháng "
                  status="warning"
                  style={{ float: "right", fontWeight: "bold" }}
                  onChange={onChangeMonthService}
                  picker="month"
                />
              </div>
              <div className=" px-0 pt-0 pb-2 ">
                <div className="p-0 overflow-x-auto">
                  <table className="items-center justify-center w-full mb-0 align-top border-collapse dark:border-white/40 text-slate-500">
                    <thead className="align-bottom">
                      <tr>
                        <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-gray-700 opacity-70 text-sm">
                          Thông tin
                        </th>
                        <th className="px-6 py-3 pl-2 text-center font-bold uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-gray-700 opacity-70 text-sm">
                          Giá tiền (vnđ)
                        </th>
                        <th className="px-6 py-3 pl-2 text-center font-bold uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-gray-700 opacity-70 text-sm">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 pl-2 font-bold text-center uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-gray-700 opacity-70 text-sm">
                          Số lượt hoàn thành
                        </th>
                        <th className="px-6 py-3 pl-2 font-bold text-center uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-gray-700 opacity-70 text-sm">
                          Doanh thu (vnđ)
                        </th>
                        <th className="px-6 py-3 pl-2 font-bold text-center uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-gray-700 opacity-70 text-sm">
                          Phần trăm (%)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="border-t">
                      {service?.services.map((item) => {
                        return (
                          // eslint-disable-next-line react/jsx-key
                          <tr
                            style={{
                              backgroundColor:
                                item.service.status == 1 ? "" : "#f4f4f4",
                            }}
                          >
                            <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                              <div className="flex px-2">
                                <div>
                                  <img
                                    src={item.service.image}
                                    className="inline-flex items-center justify-center mr-2 text-sm text-white transition-all duration-200 ease-in-out rounded-full h-9 w-9"
                                    alt="spotify"
                                  />
                                </div>
                                <div className="my-auto">
                                  <h6 className="mb-0 text-sm leading-normal dark:text-white text-[#005e2e]">
                                    {item.service.name}
                                  </h6>
                                </div>
                              </div>
                            </td>
                            <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                              <p className="mb-0 text-sm text-center font-semibold leading-normal dark:text-white dark:opacity-60">
                                {item.service.price.toLocaleString("vi", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </p>
                            </td>
                            <td className="p-2 align-middle text-center bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                              <span
                                style={{
                                  color:
                                    item.service.status == 1
                                      ? "#a0d911"
                                      : "#b83a1b",
                                }}
                                className="text-sm font-semibold leading-tight dark:text-white dark:opacity-60"
                              >
                                {item.service.status == 1
                                  ? "Kinh doanh"
                                  : "Dừng kinh doanh"}
                              </span>
                            </td>
                            <td className="font-medium text-slate-400  p-2 text-center align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                              {item.complete}
                            </td>
                            <td
                              id="totalserviceID"
                              className="font-medium text-slate-400 p-2 text-center align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent"
                            >
                              {item.turnover.toLocaleString("vi", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </td>
                            <td className="p-2 text-center align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                              <div className="flex items-center justify-center">
                                <span className="font-medium text-slate-400 mr-2 text-sm leading-tight dark:text-white dark:opacity-60">
                                  {item.percentage == null
                                    ? 0
                                    : item.percentage
                                        .toString()
                                        .substring(0, 5)}
                                  %
                                </span>
                                <div>
                                  <div className="text-xs h-0.75 w-30 m-0 flex overflow-visible rounded-lg bg-gray-200">
                                    <div
                                      style={{
                                        width: `${
                                          item.percentage == null
                                            ? 0
                                            : item.percentage
                                        }%`,
                                        backgroundColor: colorbyRevenue(),
                                      }}
                                      className="flex flex-col justify-center h-auto overflow-hidden "
                                      role="progressbar"
                                      aria-valuenow={
                                        item.percentage == null
                                          ? 0
                                          : item.percentage
                                      }
                                      aria-valuemin={0}
                                      aria-valuemax={100}
                                    />
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* <div style={{ width: "50%", marginLeft: "25%" }} className="flex-auto p-4 mt-3">
                  <canvas id="chartService" ></canvas>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3">
          <div className="flex-none w-full max-w-full px-3">
            <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
              <div className="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
                <h6
                  style={{
                    float: "left",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                  className="dark:text-white"
                >
                  Thống kê{" "}
                  <span className="text-[#00502b] underline">
                    khách hàng thân quen
                  </span>{" "}
                  <br />
                  <span style={{ color: "red", fontSize: "16px" }}>
                    {" "}
                    {/* Tổng {totalTurnover()} */}
                  </span>{" "}
                </h6>{" "}
              </div>
              <div className=" px-0 pt-0 pb-2 ">
                <div className="p-0 overflow-x-auto">
                  <table className="items-center justify-center w-full mb-0 align-top border-collapse dark:border-white/40 text-slate-500">
                    <thead className="align-bottom">
                      <tr>
                        <th className="text-sm text-gray-700 px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap opacity-70">
                          Thông tin
                        </th>
                        <th className="text-sm text-gray-700 px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap opacity-70">
                          Số điện thoại
                        </th>
                        <th className="text-sm text-gray-700 px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap opacity-70">
                          Tuổi
                        </th>

                        <th className="text-sm text-gray-700 px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap opacity-70">
                          Giới tính
                        </th>
                        <th className="text-sm text-gray-700 px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap opacity-70">
                          Địa chỉ
                        </th>
                        <th className="text-sm text-gray-700 px-6 py-3 pl-2 font-bold text-center uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap opacity-70">
                          Số lượt Spa
                        </th>
                        <th className="text-sm text-gray-700 px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap opacity-70">
                          Trạng thái tài khoản
                        </th>
                      </tr>
                    </thead>
                    <tbody className="border-t">
                      {topUser?.map((item) => {
                        if (item._id == "637e321c347223cf109f85e3") {
                          return;
                        }
                        return (
                          // eslint-disable-next-line react/jsx-key
                          <tr
                            style={{
                              backgroundColor:
                                item.status == 1 ? "" : "#f4f4f4",
                            }}
                          >
                            <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                              <div className="flex px-2">
                                <div>
                                  <img
                                    src={item.avatar}
                                    className="inline-flex items-center justify-center mr-2 text-sm text-white transition-all duration-200 ease-in-out rounded-full h-9 w-9"
                                    alt="spotify"
                                  />
                                </div>
                                <div className="my-auto">
                                  <h6 className="mb-0 text-sm leading-normal dark:text-white text-[#005e2e]">
                                    {item.name}
                                  </h6>
                                </div>
                              </div>
                            </td>
                            <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                              <p className="mb-0 text-sm font-semibold leading-normal dark:text-white dark:opacity-60">
                                {item.phoneNumber}
                              </p>
                            </td>
                            <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                              <p className="mb-0 text-sm font-semibold leading-normal dark:text-white dark:opacity-60">
                                {item.age}
                              </p>
                            </td>
                            <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                              <p className="mb-0 text-sm font-semibold leading-normal dark:text-white dark:opacity-60">
                                {item.gender == 0 ? "Nam" : "Nữ"}
                              </p>
                            </td>
                            <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                              <p className="mb-0 text-sm font-semibold leading-normal dark:text-white dark:opacity-60">
                                {item.address}
                              </p>
                            </td>

                            <td
                              id="totalserviceID"
                              className="p-2 text-center align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent"
                            >
                              {item.usedQuantity}
                            </td>
                            <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                              <span
                                style={{
                                  color:
                                    item.status == 1 ? "#a0d911" : "#b83a1b",
                                }}
                                className="  text-sm font-semibold leading-tight dark:text-white dark:opacity-60"
                              >
                                {item.status == 1 ? "Hoạt động" : "Khóa"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {/* <div style={{ width: "50%", marginLeft: "25%" }} className="flex-auto p-4 mt-3">
                  <canvas id="chartService" ></canvas>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default Dashboard;
