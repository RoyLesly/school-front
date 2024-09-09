import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import MyPagination from '@/section-h/common/Pagination/MyPagination'
import { getData } from '@/functions'
import MyButtonCustom from '@/section-h/common/MyButtonCustom'
import { redirect } from 'next/navigation'
import ServerError from '@/section-h/common/ServerError'
import NotificationError from '@/section-h/common/NotificationError'
import { RiSearch2Fill } from 'react-icons/ri';
import { GetMainCourseUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { GetMainCourseInter } from '@/NoDomain/Utils-H/appControl/appInter'
import { protocol } from '@/config'


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + GetMainCourseUrl, {...searchParams, fieldList: ["id", "course_name"]});
  
  return (
    <LayoutAdmin >
      <>
       <Breadcrumb
          pageName="MainCourses" 
          pageName1="Dashboard" 
          pageName2="Settings" 
          link1={`/Section-H/pageAdministration/${params.school_id}/pageDashboard`}
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiData == "ECONNREFUSED" && <ServerError />}
        {apiData && apiData.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
        {apiData != "ECONNREFUSED" && <List apiData={apiData} params={params} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Specialties",
  description: "This is Specialties Page",
};



const List = ( {apiData, params}: any ) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded shadow-default">
      <div className="flex flex-col gap-2 justify-between md:flex-row md:gap-4 md:px-6 px-4 py-3">
        <div className='flex flex-row gap-2 justify-between md:gap-10'>
          <div className="dark:text-white md:font-semibold md:text-xl text-black">
            <span>Count</span>-({apiData.count})
          </div>

          <SearchUser school_id={params.school_id} />
        </div>

        <div className='flex flex-row gap-2 justify-between'>
        <MyButtonCustom type='edit' title="See Courses" href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageCourses`} />
        <MyButtonCustom type='create' title="Add Title" href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainCourses/create`}  />
      </div>
      </div>

      <div></div>

      <div className="bg-bluedark border-stroke border-t dark:border-strokedark font-semibold grid grid-cols-3 md:grid-cols-4 md:px-6 px-4 py-2 text-lg text-white tracking-widest">
        <div className="hidden items-center sm:flex">
          <p className="font-medium">#</p>
        </div>

        <div className="col-span-2 flex items-center">
          <p className="font-medium">Course Title</p>
        </div>

        <div className="flex items-center justify-end md:pr-6 pr-4 text-center">
          <p className="font-medium">Action</p>
        </div>
      </div>
      {apiData.results && apiData.results.length > 0 && apiData.results.map((item: GetMainCourseInter, key: number) => (
        <div
          className="2xl:px-6.5 border-stroke border-t dark:border-strokedark dark:text-white grid grid-cols-3 md:grid-cols-4 md:px-6 px-4 py-2 text-black"
          key={key}
        >
          <div className="hidden items-center sm:flex">
            <p className="">
              {key + 1}
            </p>
          </div>

          <div className="col-span-2 flex items-center">
            <p className="">
              {item.course_name}
            </p>
          </div>

          <div className="flex gap-2 items-center justify-end md:gap-6 px-2 w-full">
            <MyButtonCustom
              type='create'
              title='View'
              href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainCourses/details/${item.id}`}
            />
          </div>

        </div>
      ))}
      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainCourses`}
      />
    
    </div>
  )
}


const SearchUser = ({ school_id }: any) => {
  const onSearchCourseServerAction = async (formData: FormData) => {
    'use server'
    var course_name = formData.get("course_name")
    if (!course_name){ course_name = ""}

    redirect(`/Section-H/pageAdministration/${school_id}/pageSettings/pageMainCourses?course_name=${course_name}`)
    
  }

  return (
      <>
          <form action={onSearchCourseServerAction} className='flex flex-row gap-1'>
              <input name='course_name' placeholder='Search By Course Name ...' className='border-2 border-slate-700 flex md:px-2 md:w-72 px-2 rounded w-48' />
              <button type='submit' className='flex items-center justify-center ml-2'>
                <RiSearch2Fill size={23} />
              </button>          
            </form>

      </>
  )
}