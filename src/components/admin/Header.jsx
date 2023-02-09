import React from "react";
import Notification from "./notification";
import { isAuthenticate } from "../../utils/LocalStorage";
import { useLocalStorage } from "react-use";
const Header = () => {
  
  const [header,setHeader,remove] = useLocalStorage('userHeader')
  return (
    <>
      {/* Navbar */}
      <nav className="relative flex flex-wrap items-center justify-between px-0 py-2 mx-6 transition-all ease-in shadow-none duration-250 rounded-2xl lg:flex-nowrap lg:justify-start">
        <div className="flex items-center justify-between w-full px-4 py-1 mx-auto flex-wrap-inherit">
          <nav>
            {/* breadcrumb */}
            <ol className="flex flex-wrap pt-1 mr-12 bg-transparent rounded-lg sm:mr-16">
              <li className="text-sm leading-normal">
                <a className="text-white opacity-50" href="javascript:;">
                  Pages
                </a>
              </li>
              <li
                className="text-sm pl-2 capitalize leading-normal text-white before:float-left before:pr-2 before:text-white before:content-['/']"
                aria-current="page"
              >
                Dashboard
              </li>
            </ol>
          </nav>
          <div className="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto">
            <div className="flex items-center md:ml-auto md:pr-4">
              <div className="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease">
                <span className="text-sm ease leading-5.6 absolute z-50 -ml-px contents h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-2.5 text-center font-normal text-slate-500 transition-all">
                  <i className="fas fa-search" />
                </span>
              </div>
            </div>
            <ul className="flex flex-row justify-end pl-0 mb-0 list-none md-max:w-full">
              <li className="flex items-center">
                <a
                  href=""
                  className="block px-0 py-2 text-sm font-semibold text-white transition-all ease-nav-brand"
                >
                  <span className="hidden sm:inline">Hi {header?.name}</span>
                </a>
              </li>
              <li className="flex items-center pl-4 xl:hidden">
                <a
                  href="javascript:;"
                  className="block p-0 text-sm text-white transition-all ease-nav-brand"
                >
                  <div className="w-4.5 overflow-hidden">
                    <i className="ease mb-0.75 relative block h-0.5 rounded-sm bg-white transition-all" />
                    <i className="ease mb-0.75 relative block h-0.5 rounded-sm bg-white transition-all" />
                    <i className="ease relative block h-0.5 rounded-sm bg-white transition-all" />
                  </div>
                </a>
              </li>
              <li className="flex items-center px-4">
                <a
                  href="javascript:;"
                  className="p-0 text-sm text-white transition-all ease-nav-brand"
                >
                  {/* fixed-plugin-button-nav  */}
                </a>
              </li>
              <Notification />
            </ul>
          </div>
        </div>
      </nav>
      {/* end Navbar */}
      {/* cards */}

      {/* end cards */}
    </>
  );
};

export default Header;
