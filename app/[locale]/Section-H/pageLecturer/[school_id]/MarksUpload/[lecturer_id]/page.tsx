import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import MyButtonCustom from '@/section-h/common/MyButtonCustom';
import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import LayoutLecturer from '@/section-h/compLecturer/LayoutLecturer';
import { getData } from '@/functions';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'
import { RiSearch2Fill } from 'react-icons/ri';
import { GetCourseInter, GetLevelInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { AcademicYearUrl, GetCourseUrl, GetLevelUrl } from '@/NoDomain/Utils-H/appControl/appConfig';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, lecturer_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const coursesData: any = await getData(GetCourseUrl, { ...searchParams, nopage: true, specialty__school__campus__id: params.school_id, assigned_to__id: params.lecturer_id, fieldList: [
    "id", 
    "main_course__course_name",
    "specialty__main_specialty__specialty_name",
    "specialty__academic_year",
    "specialty__level__level",
    "course_code",
    "course_type",
    "semester",
    "course_credit",
    "completed",
    "assigned",
    "paid",
    "assigned_to__full_name",
    "hours",
    "hours_left",
    "date_assigned",
    "created_by__full_name",
  ] });
  

  return (
    <LayoutLecturer>
      <>
        <Breadcrumb
          pageName="Upload Marks"
          pageName1="Home"
          link1={`/pageLecturer/${params.school_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {coursesData == "ECONNREFUSED" && <ServerError />}
        {coursesData && coursesData.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
        {coursesData != "ECONNREFUSED" && coursesData.length > 0 && <List apiData={coursesData} params={params} />}

      </>
    </LayoutLecturer>
  )
}

export default page


export const metadata: Metadata = {
  title:
    "My Courses",
  description: "This is MyCourses Page",
};


const List = ({ apiData, params }: any) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='flex items-center justify-center my-2'><SearchLecturerCourses params={params} /></div>

      <div className="bg-bluedark border-stroke border-t dark:border-strokedark font-medium grid grid-cols-5 md:grid-cols-9 md:px-4 md:text-lg px-2 py-2 text-white tracking-widest">
        <div className="hidden items-center md:flex">
          <span className="">#</span>
        </div>
        <div className="col-span-3 flex items-center">
          <span className="">Course Name</span>
        </div>
        <div className="col-span-3 hidden items-center md:flex">
          <span className="">Class</span>
        </div>
        <div className="col-span-2 flex items-center md:hidden pr-2 text-center text-sm text-wrap">
          <span className="flex">Class</span>/
          <span className="flex">Year</span>/
          <span className="flex">Level</span>
        </div>
        <div className="hidden items-center md:flex pr-2 text-center text-wrap">
          <span className="flex">Year</span>/
          <span className="flex">Level</span>
        </div>
        <div className="hidden items-center justify-end md:flex md:pr-4 pr-2 text-center">
          <span className="">Action</span>
        </div>
      </div>

      {apiData && apiData.length > 0 && apiData.map((item: GetCourseInter, key: number) => (
        <div
          className="border-stroke border-t dark:border-strokedark dark:text-white even:bg-blue-50 even:dark:bg-slate-700 grid grid-cols-5 md:grid-cols-9 md:px-4 md:text-lg px-2 py-2 text-black text-sm"
          key={key}
        >
          <div className="hidden items-center md:flex">
            <p className="">
              {key + 1}
            </p>
          </div>
          <div className="col-span-3 flex items-center">
            <span className="hidden md:flex">
              {item.main_course__course_name}
            </span>
            <Link href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${item.id}`} className="flex md:hidden">
              {item.main_course__course_name}
            </Link>
          </div>
          <div className="col-span-3 hidden items-center md:flex">
            <span className="">
              {item.specialty__main_specialty__specialty_name}
            </span>
          </div>
          <Link href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${item.id}`} className="col-span-2 flex flex-col gap-0 items-center md:col-span-1 md:flex-row md:justify-between text-sm text-wrap">
            <div className="col-span-2 flex flex-col gap-0 items-center md:col-span-1 md:flex-row md:justify-between text-sm text-wrap">
              <span className="flex md:hidden text-center">
                {item.specialty__main_specialty__specialty_name}
              </span>
              <span className="flex">
                {item.specialty__academic_year}
              </span>
              <span className="flex">
                {item.specialty__level__level}
              </span>
            </div>
          </Link>

          <div className="gap-2 hidden items-center justify-end md:flex md:gap-6 w-full">
            <MyButtonCustom
              title="Upload"
              href={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}/details/${item.id}`}
            />
          </div>
        </div>
      ))}

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
      redirect(`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}?main_course__course_name=${value}&specialty__academic_year=${year}&specialty__level__id=${level}`)
    } 
    if (year || level) {
      redirect(`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}?specialty__academic_year=${year}&specialty__level__id=${level}`)
    }
    redirect(`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}`)

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