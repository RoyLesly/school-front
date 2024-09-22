import { ConfigData, protocol } from "@/config";
import { getData } from "@/functions";
import { GetNotificationUrl } from "@/Domain/Utils-H/notiControl/notiConfig";
import { GetNotificationInter } from "@/Domain/Utils-H/notiControl/notiInter";
import { GetUserProfileUrl } from "@/Domain/Utils-H/userControl/userConfig";
import Image from "next/image";
import Link from "next/link";


const page = async ({
  params,
  searchParams,
}: {
  params: { userprofile_id: string, domain: string, specialty_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const profile: any = await getData(protocol + "api" + params.domain + GetUserProfileUrl, { id: params.userprofile_id, fieldList: [
    "id", "user__full_name", "user__matricle", "specialty__main_specialty__specialty_name", "specialty__academic_year", 
    "specialty__level__level", "specialty__id", "specialty__main_specialty__field__domain__id", "specialty__school__campus__id",
  ] });

  const apiNotiSchool: any = await getData(protocol + "api" + params.domain + GetNotificationUrl, { target: "school", schools: profile.results[0].specialty__school__campus__id, status: true, fieldList: [
    "id", "message_one", "message_two", "noti_type",
  ] });
  const apiNotiDomain: any = await getData(protocol + "api" + params.domain + GetNotificationUrl, { target: "domain", domains: profile.results[0].specialty__main_specialty__field__domain__id, status: true, fieldList: [
    "id", "message_one", "message_two", "noti_type",
  ] });
  const apiNotiSpecialty: any = await getData(protocol + "api" + params.domain + GetNotificationUrl, { target: "specialty", specialty: profile.results[0].specialty__id, status: true, fieldList: [
    "id", "message_one", "message_two", "noti_type",
  ] });

  const menuList = [
    { id: 1, link: "", label: "CA", icon: "/images/ca.svg", notification: false },
    { id: 2, link: "", label: "Exam", icon: "/images/resit.svg", notification: false },
    { id: 3, link: "", label: "Resit", icon: "/images/exam.svg", notification: false },
    { id: 4, link: "", label: "Result", icon: "/images/course.svg", notification: false },
    { id: 5, link: "", label: "Fees", icon: "/images/fees.svg", notification: false },
    { id: 6, link: "", label: "TimeTable", icon: "/images/news.svg", notification: false },
    { id: 7, link: "", label: "Transcript", icon: "/images/course.svg", notification: true },
    { id: 8, link: "", label: "News", icon: "/images/news.svg", notification: true },
  ]

  function removeDuplicates() {
    var arr: any = [...apiNotiSchool.results, ...apiNotiDomain.results, ...apiNotiSpecialty.results]

    const ids = arr.map((item: GetNotificationInter) => item.id);
    const filtered = arr.filter((item: GetNotificationInter, index: number) => !ids.includes(item.id, index + 1));

    return filtered;
  }

  const notifications = removeDuplicates()

  return (
    <main className="mb-20 mt-[70px]">
      {profile && profile.count && <section className="my-6 px-3">

        <div className="bg-blue-950 h-[176px] px-5 py-2 rounded-lg w-full">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <span className="font-bold">{profile.results[0].user__full_name}</span>
              <div className="flex flex-col mt-2">
                <div className="flex gap-2 justify-between">
                  <span className="font-bold">{profile.results[0].specialty__main_specialty__specialty_name}</span>
                </div>

                <div className="flex flex-row gap-2">
                  <div className="flex gap-2 justify-between">
                    <span className="font-bold"> {profile.results[0].specialty__academic_year}</span> | <span className=""> {profile.results[0].specialty__level__level}</span>
                  </div>    
                </div>

                <div className="flex flex-row gap-2">
                  <div className="flex gap-2 justify-between">
                  Matricle: <span className="font-old italic tracking-widest">{profile.results[0].user__matricle}</span>
                  </div>    
                </div>

              </div>
            </div>

            <Link href={`/Section-H/pageStudent`}>
              <Image
                width={72}
                height={72}
                src={"/images/user/user-01.png"}
                style={{
                  width: "auto",
                  height: "auto",
                }}
                alt="User"
              />
            </Link>

          </div>

          <div className="mt-2">
            <div className="flex justify-between text-white">
              <p className="text-[12px]">Overall Performance</p>
              <p className="text-[12px]">70%</p>
            </div>
            <div className="before:absolute before:bg-white before:h-[4px] before:left-0 before:rounded-lg before:top-0 before:w-[70%] bg-[#D9D9D9] h-[4px] relative rounded-lg w-full"></div>
          </div>
        </div>

        <div className='gap-3 grid grid-cols-2 grid-rows-3 mt-3 p-3 pb-16 rounded-[16px]'>
          {menuList.map((list: any, index: number) => {
            return (
              <Link href={`/${params.domain}/Section-H/pageStudent/${params.userprofile_id}/${params.specialty_id}/${list.label}`} key={list.id} className='bg-white flex flex-col h-[86px] items-center justify-center rounded-[20px] shadow-3xl w-full'>
                <div className="flex relative">
                  <div className={`${list.notification && notifications.length > 0 ? "bg-red" : ""} -translate-y-1/2 absolute animate-pulse  bottom-auto inline-block left-auto  p-1.5 right-0 rotate-0 rounded-full scale-x-100 scale-y-100 skew-x-0 skew-y-0 text-xs top-0 translate-x-2/4 z-10`}></div>
                  <Image src={list.icon} alt={list.label} width={40} height={40} />
                </div>
                <span className="font-bold text-black">{list.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="flex flex-col px-6 text-sm tracking-widest">
          <Link href={'https://forms.gle/HCTB8EXXAQUQJRA5A'} passHref target="_blank" className="font-medium italic text-blue-800 text-center w-full">
            Feedback
          </Link>
          <Link href={`https://wa.me/+237${ConfigData.help_number}`} passHref target="_blank" className="font-medium italic text-blue-800 text-center w-full">
            Online Help
          </Link>
        </div>

      </section>}
    </main>
  );
}

export default page;
