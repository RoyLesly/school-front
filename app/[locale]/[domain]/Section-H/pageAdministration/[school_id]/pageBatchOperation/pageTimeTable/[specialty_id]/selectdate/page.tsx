import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import SessionExpired from '@/section-h/common/SessionExpired'
import { redirect } from 'next/navigation'
import { GetDayProgramUrl } from '@/Domain/Utils-H/timeControl/timeConfig'
import { GetSpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, specialty_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiSpecialty: any = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, { ...searchParams, id: params.specialty_id, fieldList: ["id", "main_specialty__specialty_name", "academic_year", "level__level"] });
  const apiDayProgram: any = await getData(protocol + "api" + params.domain + GetDayProgramUrl, {
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
          link1={`/${params.domain}/Section-H/pageAdministration/${params.school_id}`}
          link2={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable`}
        />

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

  const Months: { id: number, name: string }[] = [
    { id: 1, name: "January" }, { id: 2, name: "Febuary" }, { id: 3, name: "March" }, { id: 4, name: "April" },
    { id: 5, name: "May" }, { id: 6, name: "June" }, { id: 7, name: "July" }, { id: 8, name: "August" },
    { id: 9, name: "September" }, { id: 10, name: "October" }, { id: 11, name: "November" }, { id: 12, name: "December" },
  ]

  const ToNextPage = async (t: FormData) => {
    "use server"
    var month = t.get("month");
    var year = t.get("year");

    if (month){
      redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${params.specialty_id}/create?year=${year}&month=${month}`)
    }
  }

  const dateYear = new Date()

  return <div className='flex flex-col items-center justify-center py-40 text-xl tracking-widest'>

    <form action={ToNextPage} className='flex flex-col gap-10'>

      <select 
        className='px-10 py-2 rounded text-2xl' 
        name="year" 
      >
        <option value={""}>-------------</option>
        <option value={dateYear.getFullYear()}>{dateYear.getFullYear()}</option>
        <option value={dateYear.getFullYear() - 1}>{dateYear.getFullYear() - 1}</option>
      </select>

      <select 
        className='px-10 py-2 rounded text-2xl' 
        name="month" 
      >
        <option value={""}>-------------</option>
        <option value={dateYear.getMonth() + 2}>{Months[dateYear.getMonth() + 1].name}</option>
        <option value={dateYear.getMonth() + 1}>{Months[dateYear.getMonth()].name}</option>
        <option value={dateYear.getMonth()}>{Months[dateYear.getMonth() - 1].name}</option>
      </select>

      <button type='submit' className='bg-blue-600 font-medium my-6 px-6 py-2 rounded text-white tracking-widest'>Next</button>

    </form>

  </div>
}