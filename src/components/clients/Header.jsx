import React, { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { Link } from "react-router-dom";
import "react-slideshow-image/dist/styles.css";
import { Avatar, Dropdown, Menu, Modal } from "antd";
import SignIn from "../../pages/website/SignIn";
import SignUp from "../../pages/website/SignUp";
import { isAuthenticate } from "../../utils/LocalStorage";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import Notification from "../admin/notification";
import { getProfile } from "../../api/user";
const Header = () => {
  const users = isAuthenticate();
  const navigate = useNavigate();
  const [auth, setAuth] = useState();
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [modalText, setModalText] = useState("Content of the modal");
  const [ismolDal, setIsModal] = useState();

  const showModal = (e) => {
    setOpen(true);
    setIsModal(e.target.getAttribute("data"));
  };

  useEffect(() => {
    if (users) {
      const getProfileData = () => {
        getProfile(users.token)
          .then((response) => {
            setUser(response);
          })
          .catch((error) => {
            console.log(error);
          });
      };
      getProfileData();
    }
  }, []);
  const callbackFunction = (childData) => {
    if (childData) {
      setAuth(true);
      setUser(childData);
      setOpen(false);
      if (user.role === 1) {
        navigate("/admin/booking/employee");
      } else if (user.role === 2) {
        navigate("/admin");
      }
    }
  };

  const handleSignUp = async () => {
    const signUp = await JSON.parse(localStorage.getItem("signup"));
    if (signUp) {
      setOpen(false);
    }
    localStorage.removeItem("signup");
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  // Kiểm tra nhấn signin/signup

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    message.success("Đăng xuất thành công!", 2);
    navigate("/");
    setAuth(false);
  };
  const checckAuth = () => {
    if (users?.role === 1) {
      return (
        <Link
          className="text-[5px] md:text-[8px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] w-[50px] mr-[30px]"
          to="/admin/booking/employee"
        >
          Lịch làm việc
        </Link>
      );
    } else if (users?.role === 2) {
      return (
        <Link
          className="text-[5px] md:text-[8px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] w-[50px] mr-[30px] text-black"
          to="/admin"
        >
          Admin
        </Link>
      );
    } else {
      return null;
    }
  };
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <Link
              className="text-[5px] md:text-[8px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] w-[50px] mr-[30px]"
              to="user-information/me"
            >
              Hồ sơ của tôi
            </Link>
          ),
        },
        {
          key: "2",
          label: (
            <Link
              className="text-[5px] md:text-[8px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] w-[50px] mr-[30px]"
              to="/booking-history/me"
            >
              Lịch sử đặt lịch
            </Link>
          ),
        },
        {
          key: "3",
          label: checckAuth(),
        },
        {
          key: "4",
          label: (
            <Link
              className="text-[5px] md:text-[8px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] w-[50px] mr-[30px]"
              to="/"
              onClick={handleLogout}
            >
              Đăng xuất
            </Link>
          ),
        },
      ]}
    />
  );
  useEffect(() => {
    const user = isAuthenticate();
    if (user) {
      setAuth(true);
      setUser(user);
    }
  }, []);
  const onHandleCloseModal = () => {
    setOpen(false);
  };
  return (
    <div className="bg-[#005E2E] ">
      <header className="h-[80px] sm:w-[1200px] max-w-full m-auto py-[4px] lg:py-[29px] justify-center">
        <Link to={"/"}>
          <img
            className="lg:hidden w-[100px]"
            src="https://beautyspa4.shostweb.com/wp-content/uploads/2021/12/logo-spa-4.svg"
          />
        </Link>
        <div className="header-menu">
          <nav className=" flex justify-between items-center">
            <div>
              <div id="btn-menu">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-white lg:hidden cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </div>
              <Link to={"/"}>
                <img
                  className="hidden lg:flex min-w-[100px] mr-[50px] "
                  src="https://beautyspa4.shostweb.com/wp-content/uploads/2021/12/logo-spa-4.svg"
                />
              </Link>
            </div>
            <div className="hidden lg:flex w-84 text-center" id="menu">
              <Link to={"/"}>
                <button className="text-[5px] md:text-[8px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] px-[10px] sm:px-[25px] text-[#fff]">
                  Trang chủ
                </button>
              </Link>
              <Link to={"/price-list"}>
                <button className="text-[5px] md:text-[8px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] px-[10px] sm:px-[25px] text-[#fff]">
                  Dịch vụ
                </button>
              </Link>
              <Link to={"/contact"}>
                <button className="text-[5px] md:text-[8px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] px-[10px] sm:px-[25px] text-[#fff]">
                  Liên Hệ
                </button>
              </Link>
              <Link to={"/news"}>
                <button className="text-[5px] md:text-[8px] lg:text-[15px] xl:text-[15px] 2xl:text-[15px] px-[10px] sm:px-[25px] text-[#fff]">
                  Tin tức
                </button>
              </Link>
            </div>
            <div>
              {auth ? (
                <div
                  style={{ justifyItems: "center", display: "flex" }}
                  className="items-center"
                >
                  <span className="text-white whitespace-nowrap">
                    Xin chào! {user?.name}
                  </span>
                  <div className="mx-[10px]">
                    <Dropdown overlay={menu} placement="bottom">
                      <Avatar src={users?.avatar}></Avatar>
                    </Dropdown>
                  </div>
                  <div>
                    <div className="mr-[10px]">
                      <Notification />
                    </div>
                  </div>
                  <button className="xl:text-[15px] sm:px-2 w-[100px] lg:inline-block text-[11px] whitespace-nowrap mr-3 rounded-md bg-[#003C21] hover:bg-[#024b2a] border-2 border-emerald-500 block my-1">
                    <Link className="text-[#fff]" to={`/booking`}>
                      Đặt Lịch
                    </Link>
                  </button>
                </div>
              ) : (
                <div className="flex ">
                  <button
                    data="signin"
                    onClick={showModal}
                    className="text-[12px] sm:text-[14px] lg:text-[16px] whitespace-nowrap mr-3 px-3 rounded-md bg-[#003C21] border-2 border-emerald-500 block text-[#fff] "
                  >
                    Đăng nhập
                  </button>
                  <button
                    data="signup"
                    onClick={showModal}
                    className="text-[12px] sm:text-[14px] lg:text-[16px] whitespace-nowrap mr-3 px-3 rounded-md bg-[#003C21] border-2 border-emerald-500 block text-[#fff]"
                  >
                    Đăng ký
                  </button>
                  <button className="text-[12px] sm:text-[14px] lg:text-[16px] whitespace-nowrap px-3 rounded-md bg-[#003C21] border-2 border-emerald-500 block">
                    <Link
                      className="text-[#fff] hover:text-[#fff]"
                      to={`/booking`}
                    >
                      Đặt Lịch
                    </Link>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
        <Modal
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          width={1000}
          footer={false}
        >
          <p>
            {ismolDal == "signin" ? (
              <SignIn
                closeModal={onHandleCloseModal}
                parentCallback={callbackFunction}
              />
            ) : ismolDal == "signup" ? (
              <SignUp handleSignUp={handleSignUp()} />
            ) : (
              ""
            )}
          </p>
        </Modal>
      </header>
    </div>
  );
};

export default Header;
