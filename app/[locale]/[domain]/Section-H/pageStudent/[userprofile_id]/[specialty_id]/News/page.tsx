import { getData } from "@/functions";
import { GetNotificationUrl } from "@/Domain/Utils-H/notiControl/notiConfig";
import { GetNotificationInter } from "@/Domain/Utils-H/notiControl/notiInter";
import { GetUserProfileUrl } from "@/Domain/Utils-H/userControl/userConfig";
import { protocol } from "@/config";
import NotificationError from "@/section-h/common/NotificationError";

const page = async ({
  params,
  searchParams,
}: {
  params: { userprofile_id: string, domain: string, specialty_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const menuList = [
    { id: 1, link: "TimeTable", label: "Time Table", icon: "/images/ca.svg", notification: true, type: "time" },
    { id: 2, link: "Notifications", label: "Finance", icon: "/images/news.svg", notification: true, type: "fees" },
    { id: 3, link: "Notifications", label: "Announcements", icon: "/images/news.svg", notification: true, type: "announcement" },
  ]

  const profile: any = await getData(protocol + "api" + params.domain + GetUserProfileUrl, {
    id: params.userprofile_id, fieldList: [
      "id", "user__full_name", "user__matricle", "specialty__main_specialty__specialty_name", "specialty__academic_year",
      "specialty__level__level", "specialty__id", "specialty__main_specialty__field__domain__id", "specialty__school__campus__id",
    ]
  });

  const apiNotiSchool: any = await getData(protocol + "api" + params.domain + GetNotificationUrl, {
    target: "school", schools: profile.results[0].specialty__school__campus__id, status: true, fieldList: [
      "id", "message_one", "message_two", "noti_type",
    ]
  });
  const apiNotiDomain: any = await getData(protocol + "api" + params.domain + GetNotificationUrl, {
    target: "domain", domains: profile.results[0].specialty__main_specialty__field__domain__id, status: true, fieldList: [
      "id", "message_one", "message_two", "noti_type",
    ]
  });
  const apiNotiSpecialty: any = await getData(protocol + "api" + params.domain + GetNotificationUrl, {
    target: "specialty", specialty: profile.results[0].specialty__id, status: true, fieldList: [
      "id", "message_one", "message_two", "noti_type",
    ]
  });

  const removeDuplicates = () => {
    var arr: any = [...apiNotiSchool.results, ...apiNotiDomain.results, ...apiNotiSpecialty.results]
    const ids = arr.map((item: GetNotificationInter) => item.id);
    const filtered = arr.filter((item: GetNotificationInter, index: number) => !ids.includes(item.id, index + 1));
    return filtered;
  }

  const notifications = removeDuplicates()


  return (
    <main className="flex flex-col mt-[64px]">

      {searchParams && <NotificationError errorMessage={searchParams} />}


      <section className="mx-2">
        <div className='gap-3 grid grid-cols-1 grid-rows-4 pb-4 rounded-[16px]'>
          {notifications.map((noti: GetNotificationInter, index: number) => {
            return (
              <div key={noti.id} className="bg-blue-100 gap-4 p-2 rounded text-black">
                <span className="capitalize font-semibold tracking underline">{noti.noti_type}</span>:
                <span className="font-medium italic"> {noti.message_one}</span>,
                <span className="font-medium italic"> {noti.message_two}</span>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  );
}

export default page;
