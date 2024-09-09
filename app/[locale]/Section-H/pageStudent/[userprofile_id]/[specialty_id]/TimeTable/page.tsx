import { getData, getStartEndOfWeek } from '@/functions';
import { GetDayProgramUrl } from '@/NoDomain/Utils-H/timeControl/timeConfig';
import { GetDayProgramInter } from '@/NoDomain/Utils-H/timeControl/timeInter';
import { GetUserProfileUrl } from '@/NoDomain/Utils-H/userControl/userConfig';
import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
  title: "Time Table",
  description: "Student Time Table",
};

const page = async ({
  params,
  searchParams
}: {
  params: { userprofile_id: string, specialty_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiProfile: any = await getData(GetUserProfileUrl, { ...searchParams, id: params.userprofile_id, fieldList: [
    "id", "user__full_name", "user__username", "specialty__main_specialty__specialty_name", 
    "specialty__academic_year", "specialty__level__level", "session", "program__name"] });
  const apiDayProgram: any = await getData(GetDayProgramUrl, {
    ...searchParams, timetable__specialty__id: params.specialty_id, timetable__publish: true, fieldList: [
      "id", "day", "timetable__year_week", "period_0812__main_course__course_name", 
      "period_1317__main_course__course_name", "period_1721__main_course__course_name",
    ]
  });

  return (
    <div className='h-screen mx-1 my-16 p-1 rounded text-black'>

      <div className='flex font-semibold items-center justify-center mb-2 text-xl'>TIME TABLE PAGE</div>

      {apiDayProgram && apiProfile && apiProfile.count && apiDayProgram.count && <List data={apiDayProgram} params={params} profile={apiProfile.results[0]} />}

      {/* {apiProfile && <div className='flex flex-col mb-20 mt-6 px-2'>
        <span className='font medium'>Dear {apiProfile.count && apiProfile.results[0].user__username},</span>
        <span className='italic'>We encourage you to keep on going, even when it gets tough.</span>
        <span className='italic mb-16'>Learning is a life long enriching journey.</span>
      </div>} */}

    </div>
  )
}

export default page


const List = ({ data, profile, params }: any) => {

  const period: any = data && data.count ? [... new Set(data.results.map((t: GetDayProgramInter) => t.timetable__year_week))] : []

  return <div className='mb-10'>
    {period && period.length > 0 && period.map((p: string, index: number) =>
      <div key={index} className='border-2 flex flex-col'>
        <div className='bg-slate-700 dark:bg-white dark:text-black flex font-medium gap-4 items-center justify-center pt-1 text-center text-white'>
          <span>Year: {p.slice(0, 4)}</span>
          <span>Week: {p.slice(4, 7)}</span>
        </div>
        <div className='bg-slate-700 dark:bg-white dark:text-black flex font-medium gap-4 items-center justify-center pb-1 text-center text-white'>
          <span>Period: <b>({getStartEndOfWeek(p.slice(4, 7), p.slice(0, 4))[0].slice(0, 12)} - {getStartEndOfWeek(p.slice(4, 7), p.slice(0, 4))[1].slice(0, 12)})</b></span>
        </div>
        {data && data.count && data.results ? data.results.map((item: GetDayProgramInter) => {
          return (
            <div key={item.id} className='dark:odd:bg-slate-700 odd:bg-blue-200'>
              {item.timetable__year_week == p && <div key={item.id}>
                <div className="dark:border-strokedark dark:text-white flex flex-col px-2 text-black tracking-wider">
                  <div className="items-center justify-center md:flex"><span className="font-bold">{item.day}</span></div>
                  {profile.session == "Morning" && item.period_0812__main_course__course_name && <div className="flex gap-2 italic items-center justify-bteween md:flex pl-4 text-[12px]"><span className='flex w-16'>08-12</span><span className="flex font-medium">{item.period_0812__main_course__course_name}</span></div>}
                  {profile.session == "Morning" && item.period_1317__main_course__course_name && <div className="flex gap-2 italic items-center justify-bteween md:flex pl-4 text-[12px]"><span className='flex w-16'>13-17</span><span className="flex font-medium">{item.period_1317__main_course__course_name}</span></div>}
                  {profile.session == "Evening" && item.period_1721__main_course__course_name && <div className="flex gap-2 italic items-center justify-bteween md:flex pl-4 text-[12px]"><span className='flex w-16'>17-21</span><span className="flex font-medium">{item.period_1721__main_course__course_name}</span></div>}
                </div>
              </div>
              }
            </div>)
        }
        )
          :
          <>NOTHING ...........</>
        }
      </div>)}
  </div>
}