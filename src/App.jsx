/* eslint-disable no-unused-vars */
import { Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./App.css";
import "./index.css";
import WebsiteLayout from "./layouts/WebsiteLayout";
import HomePage from "./pages/website/Home";
import BookingPage from "./pages/website/BookingPage";
import Contact from "./pages/website/Contact";
import PriceList from "./pages/website/PriceList";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./components/admin/dashboard";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Detaibooking from "./pages/website/detailbook";
import { httpGetAll } from "./api/booking";
import { httpGetEmployees } from "./api/employee";
import ListEmployee from "./pages/admin/employee";
import AddEmployee from "./pages/admin/employee/add";
import { httpGetAllService } from "./api/services";
import ListBookingByEmployee from "./pages/admin/booking/employee";
import ListService from "./pages/admin/service";
import AddService from "./pages/admin/service/Add";
import { PrivateRouter, PrivateRouter2 } from "./utils/PrivateRouter";
import EditService from "./pages/admin/service/Edit";
import VerifyPage from "./pages/website/VerifyPage";
import ListBooking from "./pages/admin/booking";
import EditEmployee from "./pages/admin/employee/edit";
import UserHistory from "./pages/website/user/UserHistory";
import ContactList from "./pages/admin/contact/index";
import UserInfo from "./components/clients/UserInfo";
import ListUser from "./pages/admin/user";
import Userinformation from "./components/clients/userinformation";
import ReplyFeedback from "./pages/admin/feedback";
import News from "./pages/website/News";
import { io } from "socket.io-client";
import { REALTIME_SERVER, SocketEvent } from "./utils/SocketConstant";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  userNotificationState,
  notificationState,
  userNotificationLengthState,
  notificationLengthState,
} from "./recoil/notificationState";
import { isAuthenticate } from "./utils/LocalStorage";
const user = isAuthenticate();
export const socket = io(REALTIME_SERVER, {
  autoConnect: true,
  forceNew: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
  query: {
    token: user?.token,
  },
});

import DetailNews from "./pages/website/DetailNews";
import UserEdit from "./pages/admin/user/edit";
import ListPost from "./pages/admin/post";
import AddPost from "./pages/admin/post/add";
import EditPost from "./pages/admin/post/edit";
import ListBanner from "./pages/admin/banner";
import AddBanner from "./pages/admin/banner/add";
import DetailPost from "./pages/admin/post/detail";
import EditBanner from "./pages/admin/banner/edit";
import { message } from "antd";

import ChangePass from "./components/clients/ChangePass";
import Swal from "sweetalert2";
import ListVoucher from "./pages/admin/voucher";
import AddVoucher from "./pages/admin/voucher/add";
import EditVoucher from "./pages/admin/voucher/edit";

function App() {
  const [isConnected, setIsConnected] = useState(null);
  const [notification, setNotification] = useRecoilState(notificationState);
  const [userNotification, setUserNotification] = useRecoilState(
    userNotificationState
  );
  const [userNotificationLength, setUserNotificationLength] = useRecoilState(
    userNotificationLengthState
  );
  const [notificationLength, setNotificationLength] = useRecoilState(
    notificationLengthState
  );
  const user = isAuthenticate();

  const [booking, setBooking] = useState();
  const [employees, setEmployees] = useState();
  const [service, setService] = useState();
  const [countDown, setCountDown] = useState("");
  const [employeeId, setEmployeeId] = useState();
  const [bookingId, setBookingId] = useState();

  window.addEventListener("unload", () => {
    if (countDown > 0) {
      localStorage.setItem("countDown", countDown);
    } else {
      localStorage.removeItem("countDown");
    }
  });

  const handleSetCountDown = () => {
    let timeDown = 60;
    let timerId = setInterval(() => {
      setCountDown(--timeDown);
      if (timeDown == 0) {
        clearInterval(timerId);
        setCountDown("");
      }
    }, 1000);
  };
  const handleToEmployee = (data, bookingId) => {
    setEmployeeId(data)
    setBookingId(bookingId)
  }

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });
    if (user) {
      socket.emit("newUser", user.token);
    }
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    socket.on(SocketEvent.NOTIFICATION, (data) => {
      setNotification(data.notfication);
      setNotificationLength(data.unRead);
    });
    socket.on(SocketEvent.USERLISTNOTIFICATION, (data) => {
      setUserNotification(data.notification);
      setUserNotificationLength(data.unRead);
      console.log("USERLISTNOTIFICATION", data.notification);
    });
    socket.on("myNewNotification", (data) => {
      message.info(`${data.text}`, 20);
      console.log(data);
    });
    const getBooking = async () => {
      const res = await httpGetAll();

      setBooking(res);
    };
    getBooking();
    const getEmployee = async () => {
      const res = await httpGetEmployees();
      setEmployees(res);
    };
    getEmployee();
    const getService = async () => {
      const res = await httpGetAllService();
      setService(res);
    };
    getService();
    return () => {
      socket.off(SocketEvent.NOTIFICATION);
      socket.off(SocketEvent.USERLISTNOTIFICATION);
      socket.off("myNewNotification");
    };
  }, []);

  const changeStatusBooking = async () => {
    const res = await httpGetAll();
    setBooking(res);
  };

  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<WebsiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />

            <Route element={<UserInfo />}>
              <Route path="booking-history/me" element={<UserHistory />} />
              <Route path="user-information/me" element={<Userinformation />} />
              <Route path="user-changePass/me" element={<ChangePass />} />
            </Route>

            <Route path="/contact" element={<Contact />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/detail/:id" element={<DetailNews />} />
            <Route path="/price-list" element={<PriceList />} />
            <Route
              path="/detail-booking/:id"
              element={
                <Detaibooking
                  countDown={countDown}
                  handleSetCountDown={handleSetCountDown}
                />
              }
            />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Route>
          <Route
            path="admin"
            element={
              <PrivateRouter>
                <AdminLayout />
              </PrivateRouter>
            }
          >
            <Route
              index
              element={
                <PrivateRouter2>
                  <Dashboard />
                </PrivateRouter2>
              }
            />
            <Route path="booking">
              <Route
                index
                element={
                  <PrivateRouter2>
                    <ListBooking
                      handleToEmployee={handleToEmployee}
                      handleChangeStatus={changeStatusBooking}
                      dataBooking={booking}
                      dataEmployy={employees}
                      dataService={service}
                    />
                  </PrivateRouter2>
                }
              />
              <Route
                path="employee"
                element={
                  <ListBookingByEmployee
                    dataAdminLogin={employeeId}
                    handleChangeStatus={changeStatusBooking}
                    dataBooking={booking}
                    dataEmployy={employees}
                    dataBookingId={bookingId}
                    dataService={service}
                  />
                }
              />
            </Route>
            <Route path="employee">
              <Route
                index
                element={
                  <PrivateRouter2>
                    <ListEmployee />
                  </PrivateRouter2>
                }
              />
              <Route path="add" element={<AddEmployee />} />
              <Route path=":id/edit" element={<EditEmployee />} />
            </Route>
            <Route path="service">
              <Route
                index
                element={
                  <PrivateRouter2>
                    <ListService dataEmployy={employees} />
                  </PrivateRouter2>
                }
              />
              <Route
                path="add"
                element={<AddService dataEmployy={employees} />}
              />
              <Route path=":id/edit" element={<EditService />} />
            </Route>
            <Route path="contact">
              <Route
                index
                element={
                  <PrivateRouter2>
                    <ContactList />
                  </PrivateRouter2>
                }
              />
            </Route>
            <Route path="banner">
              <Route
                index
                element={
                  <PrivateRouter2>
                    <ListBanner />
                  </PrivateRouter2>
                }
              />
            </Route>

            <Route path="voucher">
              <Route
                index
                element={
                  <PrivateRouter2>
                    <ListVoucher />
                  </PrivateRouter2>
                }
              />
              <Route path="add" element={<AddVoucher />} />
              <Route path="update/:id" element={<EditVoucher />} />
            </Route>

            <Route path="user">
              <Route
                index
                element={
                  <PrivateRouter2>
                    <ListUser />
                  </PrivateRouter2>
                }
              ></Route>
              <Route path=":id/edit" element={<UserEdit />} />
            </Route>
            <Route path="post">
              <Route
                index
                element={
                  <PrivateRouter2>
                    <ListPost />
                  </PrivateRouter2>
                }
              ></Route>
              <Route path=":id/edit" element={<EditPost />} />
              <Route path="add" element={<AddPost />} />
              <Route path=":id" element={<DetailPost />} />
            </Route>
            <Route path="feedback">
              <Route index element={<ReplyFeedback />}></Route>
            </Route>
            <Route path="banner">
              <Route index element={<ListBanner />}></Route>
              <Route path="add" element={<AddBanner />} />
              <Route path=":id/edit" element={<EditBanner />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
