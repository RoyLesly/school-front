import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import SessionExpired from '@/NoDomain/section-h/common/SessionExpired'
import { redirect } from 'next/navigation'
import { GetDayProgramUrl } from '@/NoDomain/Utils-H/timeControl/timeConfig'
import { AcademicYearUrl, GetSpecialtyUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { protocol } from '@/config'
import NotificationError from '@/NoDomain/section-h/common/NotificationError'

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
      "period_0812__assigned_to__full_name", "period_1317__assigned_to__full_name", "period_1317__assigned_to__full_name",
    ]
  });

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName={`SELECT DATE - ${apiSpecialty?.results[0].main_specialty__specialty_name}  ${apiSpecialty?.results[0].academic_year} -  ${apiSpecialty?.results[0].level__level}`}
          pageName1="Dashboard"
          pageName2="Back"
          link1={`/Section-H/pageAdministration/${params.school_id}`}
          link2={`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/selectclass`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiSpecialty['unauthorized'] && <SessionExpired />}
        {apiSpecialty && apiSpecialty.count && <List params={params} data={apiDayProgram} specialty={apiSpecialty} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Create TimeTable Date",
  description: "Select Date for New Time Table - Page",
};


const List = async ({ params }: any) => {

  const acadYears: any = await getData(protocol + AcademicYearUrl, {} );

  const Months: { id: number, name: string }[] = [
    { id: 1, name: "January" }, { id: 2, name: "Febuary" }, { id: 3, name: "March" }, { id: 4, name: "April" },
    { id: 5, name: "May" }, { id: 6, name: "June" }, { id: 7, name: "July" }, { id: 8, name: "August" },
    { id: 9, name: "September" }, { id: 10, name: "October" }, { id: 11, name: "November" }, { id: 12, name: "December" },
  ]

  const ToNextPage = async (t: FormData) => {
    "use server"
    var month = t.get("month");
    var year = t.get("year");

    if (month && year){
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${params.specialty_id}/create?year=${year}&month=${month}`)
    }
  }

  const dateYear = new Date()

  return <div className='flex flex-col items-center justify-center pb-40 pt-32 text-xl tracking-widest'>

    {
    acadYears && acadYears.count ?<form action={ToNextPage} className='bg-white flex flex-col gap-10 p-10 rounded'>

      <select 
        className='border px-10 py-2 rounded text-xl' 
        name="year" 
      >
        <option value={""}>-----------------</option>
        {acadYears.results.sort((a: string, b:string) => a[3] > b [3] ? -1 : a[3] < b[3] ? 1 : 0).map((item:string) => <option key={item} value={item.slice(0, 4)}>{item.slice(0, 4)}</option>)}
      </select>

      <select 
        className='border px-10 py-2 rounded text-xl' 
        name="month" 
      >
        <option value={""}>-------------</option>
        <option value={dateYear.getMonth() + 2}>{Months[dateYear.getMonth() + 1].name}</option>
        <option value={dateYear.getMonth() + 1}>{Months[dateYear.getMonth()].name}</option>
        <option value={dateYear.getMonth()}>{Months[dateYear.getMonth() - 1].name}</option>
      </select>

      <button type='submit' className='bg-blue-600 font-medium my-2 px-6 py-2 rounded text-white tracking-widest'>Next</button>

    </form>
    :
    <div>No Classes Registered Yet</div>
    }

  </div>
}