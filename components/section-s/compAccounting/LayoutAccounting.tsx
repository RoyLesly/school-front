"use client";
import React, { useState } from "react";
import HeaderAdmin from "@/section-h/compAdministration/HeaderAdmin";
import SidebarAccounting from "./SidebarAccounting";

const LayoutAccounting = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <SidebarAccounting sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto relative">
          {/* <!-- ===== Header Start ===== --> */}
          <HeaderAdmin sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="border-2 max-w-screen-2xl mx-auto p-4">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}

export default LayoutAccounting;