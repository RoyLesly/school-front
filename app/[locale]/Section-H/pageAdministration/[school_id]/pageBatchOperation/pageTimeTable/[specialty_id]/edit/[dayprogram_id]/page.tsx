import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb'
import { getData, getStartEndOfWeek } from '@/functions'
import SearchSelect from './SearchSelect'
import { redirect } from 'next/navigation'
import ServerError from '@/NoDomain/section-h/common/ServerError'
import { GetCourseUrl, GetSpecialtyUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { DayProgramUrl } from '@/NoDomain/Utils-H/timeControl/timeConfig'
import { DayProgramInter } from '@/NoDomain/Utils-H/timeControl/timeInter'
import SessionExpired from '@/NoDomain/section-h/common/SessionExpired'
import { ActionEdit } from '@/serverActions/actionGeneral'
import { SchemaEditDayProgram } from '@/NoDomain/schemas/schemas'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, specialty_id: string, dayprogram_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {


  const apiSpecialty: any = await getData(protocol + GetSpecialtyUrl, { ...searchParams, id: params.specialty_id, fieldList: ["id", "main_specialty__specialty_name", "academic_year", "level__level"] });
  const apiDayProgram: any = await getData(DayProgramUrl, {
    ...searchParams, id: params.dayprogram_id
  });

  return (
    <LayoutAdmin>
      <>
        {apiSpecialty && apiSpecialty.count && <Breadcrumb
          pageName={`EDIT Time-Table  - ${apiSpecialty?.results[0].main_specialty__specialty_name}  ${apiSpecialty?.results[0].academic_year} -  ${apiSpecialty?.results[0].level__level}`}
          pageName1="Classes"
          pageName2="Back"
          link1={`/Setion-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable`}
          link2={`/Setion-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${params.specialty_id}/listCourses`}
        />}

        {apiSpecialty == "ECONNREFUSED" && <ServerError />}
        {apiSpecialty['unauthorized'] && <SessionExpired />}
        {apiSpecialty && apiSpecialty.count && <List school_id={params.school_id} data={apiDayProgram} specialty={apiSpecialty} params={params} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "DayProgram-Edit",
  description: "This is Day Program Edit Page",
};


const List = async ({ data, params, specialty }: any) => {
  const coursesForSpecialty: any = await getData(GetCourseUrl, {
    specialty__id: specialty.results[0].id, fieldList: [
      "id", "main_course__course_name",
    ]
  });

  const period: any = data && data.count ? [... new Set(data.results.map((t: DayProgramInter) => t.timetable.year_week))] : []

  const SubmitUpdate = async (t: FormData) => {
    "use server"

    var dayData = data.results[0];

    var a = t.get("period_0812_id")
    var b = t.get("period_1317_id")
    var c = t.get("period_1721_id")

    var updatedData: any = {
      id: dayData.id,
      day: dayData.day,
      timetable_id: dayData.timetable.id,
    }
    const CheckEmpty = (a: any, b: any, c: any) => {
      if (a != ""){ updatedData = {...updatedData, period_0812_id: a}}
      if (b != ""){ updatedData = {...updatedData, period_1317_id: b}}
      if (c != ""){ updatedData = {...updatedData, period_1721_id: c}}
      return updatedData
    }
    updatedData = CheckEmpty(a, b , c)
    
    const response = await ActionEdit(updatedData, dayData.id, SchemaEditDayProgram, protocol + DayProgramUrl, `/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable`)
    
    if (response?.id) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${params.specialty_id}/listCourses?updated=Successfully-Updated`)
    }
    redirect(`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${params.specialty_id}/edit/${params.dayprogram_id}?error?error=Error-Updating`)
  }

  return <>
    <div className='flex-col flex-grow gap-4 hidden md:flex'>

      {period && period.length > 0 && period.map((p: string, index: number) =>
        <div key={index} className='border-2 flex flex-col'>
          <div className='bg-slate-700 dark:bg-white dark:text-black flex font-medium gap-4 items-center justify-center py-2 text-center text-lg text-white tracking-widest'>
            <span>Year: {p.slice(0, 4)}</span>
            <span>Week: {p.slice(4, 7)}</span>
            <span>Period: <b>({getStartEndOfWeek(p.slice(4, 7), p.slice(0, 4))[0].slice(0, 12)} - {getStartEndOfWeek(p.slice(4, 7), p.slice(0, 4))[1].slice(0, 12)})</b></span>
          </div>
          {data && data.count && data.results ? data.results.map((item: DayProgramInter) => {
            return (
              <>
                <div className="bg-bluedash dark:border-strokedark grid grid-cols-4 md:grid-cols-10 py-2 text-lg text-white tracking-wider">
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
                </div>
                <form action={SubmitUpdate} key={item.id} className='dark:odd:bg-slate-600 items-center justify-center py-10'>
                  {item.timetable.year_week == p && <div key={item.id}>
                    <div className="dark:border-strokedark dark:text-white gap-4 grid grid-cols-4 md:grid-cols-10 px-2 text-black tracking-wider w-full">

                      <div className="items-end justify-center md:flex"><span className="font-medium">{item.day}</span></div>

                      <div className="col-span-3 flex-col items-center justify-center md:flex md:gap-2 w-full">
                        <span className="flex font-medium items-center justify-center w-full">{item.period_0812?.main_course ? item.period_0812?.main_course.course_name : "."}</span>
                        <SearchSelect
                          name="period_0812_id"
                          className="flex items-center justify-center w-full"
                          defaultValue={{ value: item.period_0812?.id, label: item.period_0812?.main_course ? item.period_0812?.main_course.course_name : "."}}
                          data={coursesForSpecialty.results}
                        />
                      </div>
{/* 
                        <SearchSelect
                          name="period_1317_id"
                          className="flex items-center justify-center w-full"
                          defaultValue={{ value: item.period_1317?.id, label: item.period_1317?.main_course.course_name}}
                          data={coursesForSpecialty.results}
                        /> */}

                      <div className="col-span-3 flex-col items-center justify-center md:flex md:gap-2 w-full">
                        <span className="flex font-medium items-center justify-center w-full">{item.period_1317?.main_course ? item.period_1317?.main_course.course_name : "."}</span>
                        <SearchSelect
                          name="period_1317_id"
                          className="flex items-center justify-center w-full"
                          defaultValue={{ value: item.period_1317?.id, label: item.period_1317?.main_course.course_name}}
                          data={coursesForSpecialty.results}
                        />
                      </div>

                      <div className="col-span-3 flex-col items-center justify-center md:flex md:gap-2 w-full">
                        <span className="flex font-medium items-center justify-center w-full">{item.period_1721?.main_course ? item.period_1721?.main_course.course_name : "."}</span>
                        <SearchSelect
                          name="period_1721_id"
                          className="flex items-center justify-center w-full"
                          defaultValue={{ value: item.period_1721?.id, label: item.period_1721?.main_course.course_name}}
                          data={coursesForSpecialty.results}
                        />
                      </div>

                    </div>

                    <div className='flex items-center justify-center'>
                      <button type="submit" className="bg-bluedash flex font-medium mb-4 mt-20 px-6 py-2 rounded text-lg text-white tracking-widest">Update</button>
                    </div>

                  </div>
                  }
                </form>
              </>
            )
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