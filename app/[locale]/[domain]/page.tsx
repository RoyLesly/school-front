import { ConfigData } from "@/config";
import initTranslations from "@/i18n";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const Home = async ({
  params,
  searchParams,
}: {
  params: { locale: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const { t } = await initTranslations(params.locale, ['home', 'common'])

  console.log(params, 17)

  return (
    <div className="bg-teal-50 dark:bg-slate-900 dark:text-slate-50 flex flex-col gap-10 h-screen items-center justify-center md:pb-40 pb-20 text-slate-950">

      <div className="hidden md:flex">
        <Image
          width={200}
          height={200}
          src={ConfigData[`${params.domain}`].logo_main512}
          alt="Logo"
          style={{ borderRadius: 150 }}
          priority
        />
      </div>

      <div className="flex md:hidden">
        <Image
          width={130}
          height={130}
          src={ConfigData[`${params.domain}`].logo_main256}
          alt="Logo"
          style={{ borderRadius: 150 }}
          priority
        />
      </div>

      <div className='flex flex-col gap-4 text-center'>
        {/* <h2 className='font-bold md:text-4xl text-2xl tracking-widest'>{ConfigData[params.domain].landing_page[0]}</h2> */}
        <h2 className='font-bold md:text-4xl text-2xl tracking-widest'>{ConfigData[params.domain].landing_page[1]}</h2>
      </div>

      <Link href="/pageAuthentication/Login" className="bg-teal-600 mt-4 px-6 py-2 rounded text-white text-xl tracking-widest uppercase">{t("login")}</Link>

    </div>
  );
};


export default Home;

export const metadata: Metadata = {
  title:
    "School",
  description: "This Home",
};

