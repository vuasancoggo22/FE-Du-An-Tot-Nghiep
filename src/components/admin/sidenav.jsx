import { message } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticate } from "../../utils/LocalStorage";

import { Menu } from "antd";
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem(
    <li className="mt-0.5 w-full">
      <Link
        className=" flex items-center whitespace-nowrap px-4 transition-colors"
        to={`/admin`}
      >
        <div className="mr-2 flex h-8 w-10 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
          <img
            width="100%"
            src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/null/external-dashboard-mobile-app-development-flaticons-lineal-color-flat-icons-4.png"
          />
        </div>
        <span className="">Thống kê</span>
      </Link>
    </li>,
    "1"
  ),
  getItem(
    <li className="mt-0.5 w-full">
      <Link
        to="/admin/employee"
        className=" flex items-center whitespace-nowrap px-4 transition-colors"
      >
        <div className="mr-2 flex h-8 w-10 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
          <img src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/000000/external-spa-travel-agency-flaticons-lineal-color-flat-icons.png" />
        </div>
        <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">
          Nhân viên
        </span>
      </Link>
    </li>,
    "2"
  ),
  getItem(
    <li className="mt-0.5 w-full">
      <Link
        to="/admin/booking"
        className=" flex items-center whitespace-nowrap px-4 transition-colors"
      >
        <div className="mr-2 flex h-8 w-10 items-center justify-center rounded-lg bg-center fill-current stroke-0 text-center xl:p-2.5">
          <img src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/null/external-booking-spa-flaticons-lineal-color-flat-icons.png" />{" "}
        </div>
        <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">
          Đặt lịch
        </span>
      </Link>
    </li>,
    "3"
  ),
  getItem(
    <li className="mt-0.5 w-full">
      <Link
        className=" flex items-center whitespace-nowrap px-4 transition-colors"
        to="/admin/service"
      >
        <div className="mr-2 flex h-8 w-10 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
          <img src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/null/external-spa-hospitality-services-flaticons-lineal-color-flat-icons.png" />{" "}
        </div>
        <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">
          Dịch vụ
        </span>
      </Link>
    </li>,
    "4"
  ),
  getItem(
    <li className="mt-0.5 w-full">
      <Link
        className=" flex items-center whitespace-nowrap px-4 transition-colors"
        to="/admin/contact"
      >
        <div className="mr-2 flex h-8 w-10 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
          <img src="https://img.icons8.com/cotton/64/null/contact-card.png" />{" "}
        </div>
        <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">
          Liên hệ
        </span>
      </Link>
    </li>,
    "5"
  ),
  getItem(
    <li className="mt-0.5 w-full">
      <Link
        className=" flex items-center whitespace-nowrap px-4 transition-colors"
        to="/admin/banner"
      >
        <div className="mr-2 flex h-8 w-10 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
          <img src="https://img.icons8.com/external-smashingstocks-isometric-smashing-stocks/55/null/external-Banner-sports-smashingstocks-isometric-smashing-stocks-2.png" />{" "}
        </div>
        <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">
          Ảnh Banner
        </span>
      </Link>
    </li>,
    "6"
  ),
  getItem(
    <li className="mt-0.5 w-full">
      <Link
        className=" flex items-center whitespace-nowrap px-4 transition-colors"
        to="/admin/post"
      >
        <div className="mr-2 flex h-8 w-10 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
          <img src="https://img.icons8.com/nolan/64/us-news.png" />{" "}
        </div>
        <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">
          Bài viết
        </span>
      </Link>
    </li>,
    "7"
  ),
  getItem(
    <li className="mt-0.5 w-full">
      <Link
        className=" flex items-center whitespace-nowrap px-4 transition-colors"
        to="/admin/voucher"
      >
        <div className="mr-2 flex h-8 w-10 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
          <img src="https://img.icons8.com/external-smashingstocks-isometric-smashing-stocks/55/null/external-Banner-sports-smashingstocks-isometric-smashing-stocks-2.png" />{" "}
        </div>
        <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">
          Khuyến mại
        </span>
      </Link>
    </li>,
    "8"
  ),
  getItem(
    <li className="mt-0.5 w-full">
      <Link
        to="/admin/user"
        className=" flex items-center whitespace-nowrap px-4 transition-colors"
      >
        <div className="mr-2 flex h-8 w-10 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
          <img src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/null/external-spa-alternative-medicine-flaticons-lineal-color-flat-icons.png" />{" "}
        </div>
        <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">
          Tài khoản
        </span>
      </Link>
    </li>,
    "9"
  ),
];
const Sidenav = () => {
  const navigate = useNavigate();
  const user = isAuthenticate();
  const handleLogout = () => {
    console.log(1);
    localStorage.removeItem("user");
    message.success("Đăng xuất thành công.", 2);
    navigate("/");
    // setAuth(false);
  };
  return (
    <>
      {/* sidenav  */}
      <aside
        className="fixed inset-y-0 flex-wrap items-center justify-between block w-full p-0 my-4 overflow-y-auto antialiased transition-transform duration-200 -translate-x-full bg-white border-0 shadow-xl dark:shadow-none dark:bg-slate-850 max-w-64 ease-nav-brand z-990 xl:ml-6 rounded-2xl xl:left-0 xl:translate-x-0"
        aria-expanded="false"
      >
        <div className="h-19">
          <i className="absolute top-0 right-0 p-4 opacity-50 cursor-pointer fas fa-times dark:text-white text-slate-400 xl:hidden" />
          <Link
            to="/"
            className="block px-8 py-6 m-0 text-sm whitespace-nowrap dark:text-white text-slate-700"
          >
            <span className="ml-1 font-semibold transition-all duration-200 ease-nav-brand">
              Thẩm mỹ viện Tuyến Spa
            </span>
          </Link>
        </div>
        <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent" />
        <div className="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full width-navbar">
          {user && user?.role === 1 ? (
            <ul className="flex flex-col pl-0 mb-0">
              <li className="mt-0.5 w-full">
                <Link
                  className="py-2.7 bg-blue-500/13 dark:text-white dark:opacity-80 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold text-slate-700 transition-colors"
                  to={`/admin/booking/employee`}
                >
                  <div className="mr-2 flex h-8 w-10 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
                    <img
                      width="100%"
                      src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/null/external-dashboard-mobile-app-development-flaticons-lineal-color-flat-icons-4.png"
                    />
                  </div>
                  <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">
                    Lịch sử công việc
                  </span>
                </Link>
              </li>
              <li className="mt-10 grid">
                <button
                  type="button"
                  className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                  style={{ borderRadius: "5px" }}
                  onClick={handleLogout}
                >
                  {" "}
                  Đăng xuất{" "}
                </button>
              </li>
            </ul>
          ) : (
            <ul className="flex flex-col pl-0 mb-0">
              <div className="">
                <Menu
                  defaultSelectedKeys={["1"]}
                  defaultOpenKeys={["sub1"]}
                  mode="vertical"
                  theme="light"
                  items={items}
                />
              </div>
              <li className="mt-10 grid">
                <button
                  type="button"
                  className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
                  style={{ borderRadius: "5px" }}
                  onClick={handleLogout}
                >
                  {" "}
                  Đăng xuất{" "}
                </button>
              </li>
            </ul>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidenav;
