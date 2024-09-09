import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import MyPagination from '@/section-h/common/Pagination/MyPagination'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import NotificationError from '@/section-h/common/NotificationError'
import ServerError from '@/section-h/common/ServerError'
import MyButtonCustom from '@/section-h/common/MyButtonCustom'
import { RiSearch2Fill } from 'react-icons/ri';
import { redirect } from 'next/navigation'
import { GetCourseUrl, GetLevelUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { GetCourseInter, LevelInter } from '@/NoDomain/Utils-H/appControl/appInter'
import { protocol } from '@/config'


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + GetCourseUrl, { ...searchParams, specialty__school__id: params.school_id, fieldList: [
    "id", 
    "main_course__course_name",
    "specialty__main_specialty__specialty_name",
    "specialty__academic_year",
    "specialty__level__level",
    "semester",
    "course_credit",
    "assigned_to__full_name",
    "created_by__full_name",
  ]})  

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Courses"
          pageName1="Dashboard"
          pageName2="Settings"
          link1={`/Section-H/pageAdministration/${params.school_id}`}
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings`}
        />


        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiData == "ECONNREFUSED" && <ServerError />}
        {apiData && apiData.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
        {apiData && apiData != "ECONNREFUSED" && <List apiData={apiData} params={params} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Courses",
  description: "This is Courses Page",
};



const List = ({ apiData, params }: any) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex gap-2 justify-between md:px-4 p-2">
        <h4 className="dark:text-white font-semibold md:text-xl text-black">
          Count ({apiData.count})
        </h4>

        <Search params={params} />

        <MyButtonCustom
          type='edit'
          title="View Course Title"
          href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainCourses`}
        />

        <MyButtonCustom
          title="Assign Course"
          href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/pre-select`}
        />

      </div>

      <div className="bg-bluedark border-stroke border-t dark:border-strokedark font-medium grid grid-cols-4 md:grid-cols-6 md:px-4 md:py-2 md:text-lg px-2 text-white tracking-widest">
        <div className="col-span-2 flex items-center">
          <span className="hidden md:flex w-6">#</span>
          <span className="w-full">Course Name</span>
        </div>
        <div className="flex items-center text-wrap">
          <span className="flex">Class</span>
        </div>
        <div className="hidden items-center justify-between md:flex w-full">
          <span className="flex">Year</span>
          <span className="flex items-start justify-start">Level</span>
          <span className="flex items-start">Sem</span>
        </div>
        <div className="hidden items-center justify-center md:flex">
          <span className="">Lecturer</span>
        </div>
        <div className="flex items-center justify-end md:pr-4 pr-2 text-center">
          <span className="">Action</span>
        </div>
      </div>
      {apiData.results && apiData.results.length > 0 && apiData.results.map((item: GetCourseInter, key: number) => (
        <div
          className="border-stroke border-t dark:border-strokedark dark:text-white even:bg-blue-50 even:dark:bg-slate-700 grid grid-cols-4 md:grid-cols-6 md:px-4 md:text-lg px-2 py-2 text-black text-sm"
          key={key}
        >
          <div className="col-span-2 flex items-center">
            <span className="hidden md:flex w-10">{key + 1}</span>
            <span className="w-full">{item.main_course__course_name}</span>
          </div>
          <div className="flex flex-col gap-2 items-center md:flex-row text-sm text-wrap">
            <span className="flex">
              {item.specialty__main_specialty__specialty_name}
            </span>
          </div>
          <div className="hidden items-center justify-between md:flex text-sm w-full">
            <span className="flex">{item.specialty__academic_year}</span>
            <span className="flex">{item.specialty__level__level}</span>
            <span className="flex">{item.semester}</span>
          </div>
          <div className="hidden items-center justify-center md:flex ml-2">
            <span className="flex">{item.assigned_to__full_name}</span>
          </div>
          <div className="flex gap-2 items-center justify-center md:gap-6 w-full">
            <MyButtonCustom
              title="Detail"
              href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses/details/${item.id}`}
            />
          </div>
        </div>
      ))}

      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses`}
      />

    </div>
  )
}


const Search = async ({ params }: any) => {
  const thisYear = new Date().getFullYear();
  const levelData: any = await getData(GetLevelUrl, {});


  const onSearchServerAction = async (formData: FormData) => {
    'use server'

    var sn = formData.get("specialty_name")
    var year = formData.get("year")
    var level = formData.get("level")
    if (!sn) { sn = "" }

    if (year || level) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses?specialty__main_specialty__specialty_name=${sn}&specialty__academic_year=${year}&specialty__level__id=${level}`)
    }

    redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses`)

  }
  return (
    <>

      <form action={onSearchServerAction} className='flex flex-row gap-2 text-black'>

        <input
          name='specialty_name'
          placeholder='Specialty ...'
          className='border-2 border-slate-700 flex md:w-32 px-2 py-1 rounded text-black'
        />

        <select
          name='year'
          className='border-2 border-slate-700 flex md:w-32 px-2 py-1 rounded text-black'
        >
          <option value="">-------</option>
          {[`${thisYear - 3}/${thisYear - 2}`, `${thisYear - 2}/${thisYear - 1}`, `${thisYear - 1}/${thisYear}`, `${thisYear}/${thisYear + 1}`].map((item: string) => (
            <option key={item} value={item} className='md:w-32'>{item}</option>
          ))}
        </select>

        <select
          name='level'
          className='border-2 border-slate-700 flex md:w-32 px-2 py-1 rounded text-black'
        >
          <option value="">-------</option>
          {levelData && levelData.results.map((item: LevelInter) => (
            <option key={item.id} value={item.id} className='md:w-32'>{item.level}</option>
          ))}
        </select>

        <button type='submit' className='flex items-center justify-center ml-2'>
          <RiSearch2Fill size={23} />
        </button>
      </form>

    </>
  )
}
