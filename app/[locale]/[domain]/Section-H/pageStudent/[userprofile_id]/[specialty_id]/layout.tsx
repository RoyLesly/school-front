import Footer from "@/section-h/compStudent/components/Footer";
import Navbar from "@/section-h/compStudent/components/Navbar";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Student Page",
  description: "Student Home Page",
};

const page = async ({
    params,
    children
    }: {
    params: { userprofile_id: string,  domain: string, specialty_id: string };
    children: React.ReactNode;

    }) => {

  return (
      <div className="w-full">
          <Navbar params={params} />
          {children}
          <Footer params={params} />
      </div>
  );
}

export default page;