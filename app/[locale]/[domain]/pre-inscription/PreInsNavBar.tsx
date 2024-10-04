import { ConfigData } from "@/config";
import { GetSchoolIdentificationInter, GetSchoolInfoInter } from "@/Domain/Utils-H/appControl/appInter";
import initTranslations from "@/i18n";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const PreInsNavBar = async ({
  params,
  searchParams,
  page,
  school_identification,
}: {
  params: { locale: string, domain: string };
  page: number;
  school_identification: GetSchoolIdentificationInter;
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const { t } = await initTranslations(params.locale, ['home', 'common'])

  return (
    <div className="bg-teal-300 dark:bg-slate-900 dark:text-slate-50 flex flex-col gap-1 items-center justify-between md:flex-row md:gap-4 md:px-4 px-1 py-1 rounded-sm text-slate-950 w-full">

      <div className="border-red flex justify-start lg:w-9/12 md:gap-4 md:w-8/12 w-full">
        <div className="flex flex-row items-center justify-between md:gap-6 w-full">
          {/* <Link href={`/${params.domain}/pre-inscription`} className={`${page == 1 ? "" : ""} hidden md:flex`}> */}
          <Link href={`/${params.domain}`} className={`${page == 1 ? "" : ""} hidden md:flex`}>
            <Image width={75} height={75} src={ConfigData[`${params.domain}`].logo_main512} alt="Logo" style={{ borderRadius: 100 }} priority />
          </Link>
          <div className="flex font-semibold justify-center lg:text-[28px] md:mx-4 md:text-[22px] md:w-9/12 text-[18px] text-center tracking-widest w-full">
            {school_identification.name}
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-2 items-center justify-center lg:w-3/12 md:w-4/12 w-full">
        <Link href={`/${params.domain}/pre-inscription/New`} className={`${page == 1 ? "bg-white rounded px-2 md:px-4 py-1 md:py-2 tracking-widest font-semibold" : ""} flex justify-center w-full`}>
          New Student
        </Link>
        <Link href={`/${params.domain}/pre-inscription/Check`} className={`${page == 2 ? "bg-white rounded px-2 md:px-4 py-1 md:py-2 tracking-widest font-semibold" : ""} flex justify-center w-full`}>
          Check
        </Link>
      </div>


    </div>
  );
};


export default PreInsNavBar;

export const metadata: Metadata = {
  title: "Pre-Inscription Page",
  description: "Pre-Inscription Page",
};

