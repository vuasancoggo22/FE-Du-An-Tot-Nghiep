import { Badge, message } from "antd";
import moment from "moment";
import React from "react";
import { useRecoilState } from "recoil";
import {
  notificationLengthState,
  notificationState,
  userNotificationLengthState,
  userNotificationState,
  employeeNotificationState,
  employeeNotificationLengthState
} from "../../recoil/notificationState";
import { isAuthenticate } from "../../utils/LocalStorage";
import { readedNotification } from "../../api/notification";
import { useNavigate } from "react-router-dom";

const notification = () => {
  const user = isAuthenticate();
  const [adminNotification,setAdminNotification] = useRecoilState(notificationState);
  const [userNotification,setUserNotification] = useRecoilState(userNotificationState);
  const [userNotificationUnRead, setUserNotificationUnRead] = useRecoilState(userNotificationLengthState)
  const [adminNotificationUnRead, setAdminNotificationUnRead] = useRecoilState(notificationLengthState)
  const [employeeNotification,setEmployeeNotification] = useRecoilState(employeeNotificationState)
  const [employeeNotificationUnRead,setEmployeeNotificationUnRead] = useRecoilState(employeeNotificationLengthState)
  const [show, setShow] = React.useState(false);
  const navigate = useNavigate()
  const onClick = () => {
    setShow(!show);
  };
  const readNotification = async (id) => {
    try {
      const readed = await readedNotification(id, user.token)
      if(user.role == 2){
        setAdminNotification(readed.notification)
        setAdminNotificationUnRead(readed.unRead)
        const booking = adminNotification.find((item) => item._id == id)
        localStorage.setItem("bookingNew", booking.bookingId._id)
        navigate("/admin/booking")
      }
      else if(user.role == 0){
        setUserNotificationUnRead(readed.unRead)
        setUserNotification(readed.notification)
      }
      else if(user.role == 1 ){
        setEmployeeNotification(readed.notification)
        setEmployeeNotificationUnRead(readed.unRead)
        const booking = employeeNotification.find((item) => item._id == id)
        localStorage.setItem("bookingNew", booking.bookingId._id)
        navigate("/admin/booking/employee")
      }
     
    } catch (error) {
      console.log(error);
      message.error(`${error.response.message}`, 4)
    }
  }
  return (
    <>
      {user.role == 2 ? <li className="relative flex items-center pr-2">
        <p className="hidden transform-dropdown-show" />
        <a
          href="javascript:;"
          className="block p-0 text-sm text-white transition-all ease-nav-brand"
          aria-expanded="false"
        >
          <Badge
            count={adminNotificationUnRead}
            overflowCount={100}
          >
            <i
              className="cursor-pointer fa fa-bell text-3xl text-white"
              onClick={onClick}
            />
          </Badge>
        </a>
        <ul
          className={`${show === false ? "hidden" : ""
            } overflow-y-scroll max-h-96 text-sm mt-[50px] before:font-awesome before:leading-default before:duration-350 before:ease lg:shadow-3xl duration-250 min-w-44 before:sm:right-8 before:text-5.5  absolute right-0 top-0 z-50 origin-top list-none rounded-lg border-0 border-solid border-transparent dark:shadow-dark-xl dark:bg-slate-850 bg-white bg-clip-padding px-2 py-4 text-left text-slate-500 transition-all before:absolute before:right-2 before:left-auto before:top-0 before:z-50 before:inline-block before:font-normal before:text-white before:antialiased before:transition-all before:content-['\f0d8']`}
        >
          {adminNotification && adminNotification.map((item, index) => {
            return (
              <li style={{backgroundColor:item.readed == true ? "white" : "#e7e7e7"}} className="relative mb-2" key={index} onClick={() => readNotification(item._id)}>
                <a className="dark:hover:bg-slate-900 ease py-1.2 clear-both block w-full whitespace-nowrap rounded-lg bg-transparent px-4 duration-300 hover:bg-gray-200 hover:text-slate-700 lg:transition-colors">
                  <div className="flex py-1">
                    {/* <div className="my-auto">
                      <img
                        src=""
                        className="inline-flex items-center justify-center mr-4 text-sm text-white h-9 w-9 max-w-none rounded-xl"
                      />
                    </div> */}
                    <div className="flex flex-col justify-center">
                      <h6 className="mb-1 text-sm font-normal leading-normal dark:text-white">
                        <p>{item.text}</p>
                      </h6>
                      <p className="mb-0 text-xs leading-tight text-slate-400 dark:text-white/80">
                        <i className="mr-1 fa fa-clock" />
                        {moment(item.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </li> : ""}
      {user.role == 0 ? <li className="relative flex items-center pr-2">
        <p className="hidden transform-dropdown-show" />
        <a
          href="javascript:;"
          className="block p-0 text-sm text-white transition-all ease-nav-brand"
          aria-expanded="false"
        >
          <Badge
            count={userNotificationUnRead}
            overflowCount={100}
          >
            <i
              className="cursor-pointer fa fa-bell text-3xl text-white"
              onClick={onClick}
            />
          </Badge>
        </a>
        <ul
          className={`${show === false ? "hidden" : ""
            } overflow-y-scroll max-h-96 text-sm mt-[50px] before:font-awesome before:leading-default before:duration-350 before:ease lg:shadow-3xl duration-250 min-w-44 before:sm:right-8 before:text-5.5  absolute right-0 top-0 z-50 origin-top list-none rounded-lg border-0 border-solid border-transparent dark:shadow-dark-xl dark:bg-slate-850 bg-white bg-clip-padding px-2 py-4 text-left text-slate-500 transition-all before:absolute before:right-2 before:left-auto before:top-0 before:z-50 before:inline-block before:font-normal before:text-white before:antialiased before:transition-all before:content-['\f0d8']`}
        >
          {userNotification && userNotification.map((item, index) => {
            return (
              <li style={{backgroundColor:item.readed == true ? "white" : "#e7e7e7"}} className="relative mb-2" key={index} onClick={() => readNotification(item._id)}>
                <a className="dark:hover:bg-slate-900 ease py-1.2 clear-both block w-full whitespace-nowrap rounded-lg bg-transparent px-4 duration-300 hover:bg-gray-200 hover:text-slate-700 lg:transition-colors">
                  <div className="flex py-1">
                    {/* <div className="my-auto">
                      <img
                        src=""
                        className="inline-flex items-center justify-center mr-4 text-sm text-white h-9 w-9 max-w-none rounded-xl"
                      />
                    </div> */}
                    <div className="flex flex-col justify-center">
                      <h6 className="mb-1 text-sm font-normal leading-normal dark:text-white">
                        <p>{item.text}</p>
                      </h6>
                      <p className="mb-0 text-xs leading-tight text-slate-400 dark:text-white/80">
                        <i className="mr-1 fa fa-clock" />
                        {moment(item.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </li> : ""}
      {user.role == 1 ? <li className="relative flex items-center pr-2">
        <p className="hidden transform-dropdown-show" />
        <a
          href="javascript:;"
          className="block p-0 text-sm text-white transition-all ease-nav-brand"
          aria-expanded="false"
        >
          <Badge
            count={employeeNotificationUnRead}
            overflowCount={100}
          >
            <i
              className="cursor-pointer fa fa-bell text-3xl text-white"
              onClick={onClick}
            />
          </Badge>
        </a>
        <ul
          className={`${show === false ? "hidden" : ""
            } overflow-y-scroll max-h-96 text-sm mt-[50px] before:font-awesome before:leading-default before:duration-350 before:ease lg:shadow-3xl duration-250 min-w-44 before:sm:right-8 before:text-5.5  absolute right-0 top-0 z-50 origin-top list-none rounded-lg border-0 border-solid border-transparent dark:shadow-dark-xl dark:bg-slate-850 bg-white bg-clip-padding px-2 py-4 text-left text-slate-500 transition-all before:absolute before:right-2 before:left-auto before:top-0 before:z-50 before:inline-block before:font-normal before:text-white before:antialiased before:transition-all before:content-['\f0d8']`}
        >
          {employeeNotification && employeeNotification.map((item, index) => {
            return (
              <li style={{backgroundColor:item.readed == true ? "white" : "#e7e7e7"}} className="relative mb-2" key={index} onClick={() => readNotification(item._id)}>
                <a className="dark:hover:bg-slate-900 ease py-1.2 clear-both block w-full whitespace-nowrap rounded-lg bg-transparent px-4 duration-300 hover:bg-gray-200 hover:text-slate-700 lg:transition-colors">
                  <div className="flex py-1">
                    {/* <div className="my-auto">
                      <img
                        src=""
                        className="inline-flex items-center justify-center mr-4 text-sm text-white h-9 w-9 max-w-none rounded-xl"
                      />
                    </div> */}
                    <div className="flex flex-col justify-center">
                      <h6 className="mb-1 text-sm font-normal leading-normal dark:text-white">
                        <p>{item.text}</p>
                      </h6>
                      <p className="mb-0 text-xs leading-tight text-slate-400 dark:text-white/80">
                        <i className="mr-1 fa fa-clock" />
                        {moment(item.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </li> : ""}
    </>
  );
};

export default notification;
