import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import LayoutLecturer from '@/section-h/compLecturer/LayoutLecturer';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'
import { RiSearch2Fill } from 'react-icons/ri';
import { AcademicYearUrl, GetLevelUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { GetLevelInter } from '@/Domain/Utils-H/appControl/appInter';
import SearchData from './SearchData';
import { protocol } from '@/config';
import { GetTimeSlotUrl } from '@/Domain/Utils-H/timeControl/timeConfig';
import NotificationError from '@/section-h/common/NotificationError';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string,  domain: string, lecturer_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiTimeSlot = await getData(protocol + "api" + params.domain + GetTimeSlotUrl, { 
    nopage: true,
    course__specialty__school__id: params.school_id,
    course__assigned_to__id: params.lecturer_id,
    timetableday__timetableweek__publish: true,
    // titmetableday__timetableweek__specialty__school__id: params.school_id,
    fieldList: [ "id", "title", "start", "end", "start_time", "end_time", "hours", "course__id", "status", "timetableday__id", "status",
      "timetableday__timetableweek__year_week", "timetableday__day", "timetableday__date", "course__main_course__course_name", "course__assigned_to__id"
    ]
  })
  console.log(apiTimeSlot, 33 )
  
  return (
    <LayoutLecturer>
      <>
        <Breadcrumb
          pageName="My Time Table"
          pageName1="My Courses"
          link2={`/${params.domain}/Section-H/pageLecturer/${params.school_id}/MyCourses/${params.lecturer_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        <SearchData searchParams={searchParams} params={params} apiTimeSlot={apiTimeSlot} />

      </>
    </LayoutLecturer>
  )
}

export default page


export const metadata: Metadata = {
  title: "My Time Table",
  description: "This is My Table Page",
};


const List = ({ searchParams, params, apiTimeSlot }: any) => {

  return (
    // <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark flex flex-1 rounded-sm shadow-default">
    //   <BigCalendar />
    // </div>
    <div>
      {/* <SearchData searchParams={searchParams} params={params} apiTimeSlot={apiTimeSlot} /> */}
    </div>
  )
}


const SearchLecturerCourses = async ({params}: any) => {
  const acadYear = await getData(AcademicYearUrl, {});
  const lev = await getData(GetLevelUrl, { fieldList: [ "id", "level"]});
  const onSearchDrugServerAction = async (formData: FormData) => {
    'use server'

    var value = formData.get("value")
    const year = formData.get("year")
    const level = formData.get("level")

    if (value && value.toString().length > 1) {
      redirect(`/Section-H/pageLecturer/${params.school_id}/MyCourses/${params.lecturer_id}?main_course__course_name=${value}&specialty__academic_year=${year}&specialty__level__id=${level}`)
    } 
    if (year || level) {
      redirect(`/Section-H/pageLecturer/${params.school_id}/MyCourses/${params.lecturer_id}?specialty__academic_year=${year}&specialty__level__id=${level}`)
    }
    redirect(`/Section-H/pageLecturer/${params.school_id}/MyCourses/${params.lecturer_id}`)

  }
  return (
    <>

      <form action={onSearchDrugServerAction} className='flex flex-row gap-2 text-black'>
        <input name='value' placeholder='Search Courses ...' className='border-2 border-slate-700 flex md:w-60 px-2 py-1 rounded text-black w-full' />

        <select 
          name='year' 
          className='border-2 border-slate-700 hidden md:flex md:w-28 px-2 py-1 rounded text-black'
        >
          <option value="">-----</option>
          {acadYear && acadYear.count && acadYear.results.map((item: string) => (
            <option key={item} value={item} className='md:w-28'>{item}</option>
          ))}
        </select>

        <select 
          name='level' 
          className='border-2 border-slate-700 hidden md:flex md:w-28 px-2 py-1 rounded text-black'
        >
          <option value="">-----</option>
          {lev && lev.count && lev.results.map((item: GetLevelInter) => (
            <option key={item.id} value={item.id} className='md:w-28'>{item.level}</option>
          ))}
        </select>

        <button type='submit' className='hidden items-center justify-center md:flex ml-2'><RiSearch2Fill size={23} /></button>
      </form>

    </>
  )
}