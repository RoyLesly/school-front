import type { Metadata, Viewport } from "next";
// import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/NoDomain/section-h/common/css/satoshi.css";
import "@/NoDomain/section-h/common/css/style.css";
import LayoutToast from "./LayoutToast";


export const metadata: Metadata = {
  applicationName: "School",
  description: "School System",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <LayoutToast />
          {children}
        </div>
      </body>
    </html>
  );
}





















// "use client";
// import "jsvectormap/dist/css/jsvectormap.css";
// import "flatpickr/dist/flatpickr.min.css";
// import "@/common/css/satoshi.css";
// import "@/common/css/style.css";
// import React, { useEffect, useState } from "react";
// import Loader from "../components/common/Loader";
// import { Toaster } from "react-hot-toast";

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [loading, setLoading] = useState<boolean>(true);

//   // const pathname = usePathname();

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 700);
//   }, []);

//   return (
//     <html lang="en">
//       <body suppressHydrationWarning={true}>
//         <div className="dark:bg-boxdark-2 dark:text-bodydark">
//           <Toaster position="top-right" />
//           {loading ? <Loader /> : children}
//         </div>
//       </body>
//     </html>
//   );
// }
