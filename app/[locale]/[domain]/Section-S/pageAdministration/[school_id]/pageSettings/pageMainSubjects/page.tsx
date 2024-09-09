import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import Link from 'next/link'
import { MainSubjectInter } from '@/Domain/Utils-S/appControl/appInter'
import { GetMainSubjectUrl } from '@/Domain/Utils-S/appControl/appConfig'
import MyPagination from '@/section-s/common/Pagination/MyPagination'
import { getData } from '@/functions'
import MyButtonCustom from '@/section-s/common/MyButtonCustom'
import { redirect } from 'next/navigation'
import ServerError from '@/section-s/common/ServerError'
import NotificationError from '@/section-s/common/NotificationError'
import { RiSearch2Fill } from 'react-icons/ri';
import { protocol } from '@/config'


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: MainSubjectInter[] | any = await getData(protocol  + "api" + params.domain + GetMainSubjectUrl, {...searchParams, fieldList: ["id", "subject_name" ]});
  
  return (
    <LayoutAdmin >
      <>
       <Breadcrumb
          pageName="MainSubjects" 
          pageName1="Dashboard" 
          pageName2="Settings" 
          link1={`/Section-S/pageAdministration/${params.school_id}`}
          link2={`/Section-S/pageAdministration/${params.school_id}/pageSettings`}
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
    "Subject Title",
  description: "This is Subject Page",
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
        <MyButtonCustom type='edit' title="See Subjects" href={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects`} />
        <MyButtonCustom type='create' title="Add Subject Title" href={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainSubjects/create`}  />
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
      {apiData.results && apiData.results.length > 0 && apiData.results.map((item: MainSubjectInter, key: number) => (
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
              {item.subject_name}
            </p>
          </div>

          <div className="flex gap-2 items-center justify-end md:gap-6 px-2 w-full">
            <MyButtonCustom
              type='create'
              title='View'
              href={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainSubjects/details/${item.id}`}
            />
          </div>

        </div>
      ))}
      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainCourses`}
      />
    
    </div>
  )
}


const SearchUser = ({ school_id }: any) => {
  const onSearchCourseServerAction = async (formData: FormData) => {
    'use server'
    var subject_name = formData.get("subject_name")
    console.log(subject_name, 135)
    if (!subject_name){ subject_name = ""}

    redirect(`/Section-S/pageAdministration/${school_id}/pageSettings/pageMainSubjects?subject_name=${subject_name}`)
    
  }

  return (
      <>
          <form action={onSearchCourseServerAction} className='flex flex-row gap-1'>
              <input name='subject_name' placeholder='Search By Subject Name ...' className='border-2 border-slate-700 flex md:px-2 md:w-72 px-2 rounded w-48' />
              <button type='submit' className='flex items-center justify-center ml-2'>
                <RiSearch2Fill size={23} />
              </button>          
            </form>

      </>
  )
}