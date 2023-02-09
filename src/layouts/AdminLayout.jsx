
import React from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/admin/Header";
import Sidenav from "../components/admin/sidenav";

const AdminLayout = () => {
 

   
 
  return (
    <>
      <div className="m-0 font-sans text-base antialiased font-normal dark:bg-slate-900 leading-default bg-gray-50 text-slate-500">
        <div className="absolute w-full bg-[#005E2E] dark:hidden min-h-75" />
        {/* sidenav  */}
        <Sidenav />
        {/* end sidenav */}
        <div>
          <main className="relative h-full max-h-screen transition-all duration-200 ease-in-out xl:ml-68 rounded-xl">
            {/* Navbar */}
            <Header />
            <div className="hidden"></div>
            {/* end Navbar */}
            {/* cards */}
            <div>
              <Outlet />
            </div>
            {/* end cards */}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
