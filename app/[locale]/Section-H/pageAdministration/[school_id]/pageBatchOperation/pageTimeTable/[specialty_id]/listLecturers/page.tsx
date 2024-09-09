import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb'
import { getData, getStartEndOfWeek } from '@/functions'
import SessionExpired from '@/NoDomain/section-h/common/SessionExpired'
import Link from 'next/link'
import { FaPlus } from 'react-icons/fa6'
import { GetSpecialtyUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { GetDayProgramUrl } from '@/NoDomain/Utils-H/timeControl/timeConfig'
import { GetDayProgramInter } from '@/NoDomain/Utils-H/timeControl/timeInter'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, specialty_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiSpecialty: any = await getData(protocol + GetSpecialtyUrl, { ...searchParams, id: params.specialty_id, fieldList: ["id", "main_specialty__specialty_name", "academic_year", "level__level"] });
  const apiDayProgram: any = await getData(protocol + GetDayProgramUrl, {
    ...searchParams, timetable__specialty__id: params.specialty_id, fieldList: [
      "id", "day", "timetable__year_week",
      "period_0812__assigned_to__full_name", "period_1317__assigned_to__full_name", "period_1721__assigned_to__full_name",
    ]
  });

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName={`TIME TABLE FOR - ${apiSpecialty?.results[0].main_specialty__specialty_name}  ${apiSpecialty?.results[0].academic_year} -  ${apiSpecialty?.results[0].level__level}`}
          pageName1="Dashboard"
          pageName2="Back"
          link1={`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable`}
        />

        {apiSpecialty['unauthorized'] && <SessionExpired />}
        {apiSpecialty && apiSpecialty.count && <List school_id={params.school_id} data={apiDayProgram} specialty={apiSpecialty} specialty_id={params.specialty_id} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "TimeTable-Create",
  description: "This is Time Table  Page",
};


const List = async ({ data, specialty, school_id, specialty_id }: any) => {

  const period: any = data && data.count ? [... new Set(data.results.map((t: GetDayProgramInter) => t.timetable__year_week))] : []

  return <>
    <div className='bg-white flex-col flex-grow hidden md:flex p-4'>

    {specialty && specialty.count ?
        <div className='flex flex-row font-medium gap-2 items-center justify-between md:text-xl py-2'>
          <span><Link href={`/Section-H/pageAdministration/${school_id}/pageBatchOperation/pageTimeTable/${specialty_id}/listCourses`} className='bg-slate-200 px-6 py-1 rounded-sm text-slate-400'>Show Courses</Link></span>
          <span><Link href={`/Section-H/pageAdministration/${school_id}/pageBatchOperation/pageTimeTable/${specialty_id}/listLecturers`} className='bg-slate-400 px-6 py-1 rounded-sm text-black'>Show Lecturers</Link></span>
          <span className=''><Link className='bg-bluedark flex gap-2 items-center justify-center px-10 py-1 rounded text-white' href={`/Section-H/pageAdministration/${school_id}/pageBatchOperation/pageTimeTable/${specialty_id}/selectdate`}><FaPlus /><>Create</></Link></span>
        </div> : <></>}

      <div className="bg-bluedash dark:border-strokedark grid grid-cols-4 md:grid-cols-11 py- text-lg text-white tracking-wider">
        <div className="items-center justify-center md:flex">
          <span className="font-medium">DAY</span>
        </div>
        <div className="col-span-3 items-center justify-center md:flex">
          <span className="font-medium">08 - 12</span>
        </div>
        <div className="col-span-3 items-center justify-center md:flex">
          <span className="font-medium">13 - 17</span>
        </div>
        <div className="col-span-3 items-center justify-center md:flex">
          <span className="font-medium">17 - 21</span>
        </div>
        <div className="items-center justify-center md:flex">
          <span className="font-medium">Action</span>
        </div>
      </div>

      {period && period.length > 0 && period.map((p: string, index: number) =>
        <div key={index} className='border-2 flex flex-col'>
          <div className='bg-slate-700 dark:bg-white dark:text-black flex font-medium gap-4 items-center justify-center py-1 text-center text-white'>
            <span>Year: {p.slice(0, 4)}</span>
            <span>Week: {p.slice(4, 7)}</span>
            <span>Period: <b>({getStartEndOfWeek(p.slice(4, 7), p.slice(0, 4))[0].slice(0, 12)} - {getStartEndOfWeek(p.slice(4, 7), p.slice(0, 4))[1].slice(0, 12)})</b></span>
          </div>
          {data && data.count && data.results ? data.results.map((item: GetDayProgramInter) => {
            return (
              <div key={item.id} className='dark:odd:bg-slate-600 odd:bg-notiblue'>
                {item.timetable__year_week == p && <div key={item.id}>
                  <div className="dark:border-strokedark dark:text-white grid grid-cols-4 md:grid-cols-11 px-2 text-black tracking-wider">
                    <div className="items-center justify-center md:flex"><span className="font-medium">{item.day}</span></div>
                    <div className="col-span-3 items-center justify-center md:flex"><span className="font-medium">{item.period_0812__assigned_to__full_name}</span></div>
                    <div className="col-span-3 items-center justify-center md:flex"><span className="font-medium">{item.period_1317__assigned_to__full_name}</span></div>
                    <div className="col-span-3 items-center justify-center md:flex"><span className="font-medium">{item.period_1721__assigned_to__full_name}</span></div>
                    <div className="bg-bluedash flex items-center justify-center my-1 rounded text-center text-white">
                      <Link href={`/Section-H/pageAdministration/${school_id}/pageBatchOperation/pageTimeTable/${specialty_id}/edit/${item.id}`} className="font-medium">Edit</Link>
                    </div>
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

    </div >


    <div className='flex flex-grow font-medium h-screen items-center justify-center md:hidden text-xl tracking-wider'>
      Available On Desktop Only
    </div>


  </>
}