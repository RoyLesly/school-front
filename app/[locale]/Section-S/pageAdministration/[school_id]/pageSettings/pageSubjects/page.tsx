import { Metadata } from 'next'
import React from 'react'
import { GetSubjectInter, GetLevelInter } from '@/NoDomain/Utils-S/appControl/appInter'
import { getData } from '@/functions'
import { GetSubjectUrl, GetLevelUrl } from '@/NoDomain/Utils-S/appControl/appConfig'
import MyPagination from '@/section-s/common/Pagination/MyPagination'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import NotificationError from '@/section-s/common/NotificationError'
import ServerError from '@/section-s/common/ServerError'
import MyButtonCustom from '@/section-s/common/MyButtonCustom'
import { RiSearch2Fill } from 'react-icons/ri';
import { redirect } from 'next/navigation'
import { protocol } from '@/config'


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + GetSubjectUrl, { ...searchParams, specialty__school__id: params.school_id, fieldList: [
    "id", 
    "main_subject__subject_name",
    "classroom__level__level",
    "classroom__level__option",
    "classroom__academic_year",
    "subject_code",
    "subject_type",
    "subject_coefficient",
    "assigned_to__full_name",
    "created_by__full_name",
  ]})

  console.log(36, apiData)
  

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Subjects"
          pageName1="Dashboard"
          pageName2="Settings"
          link1={`/Section-S/pageAdministration/${params.school_id}`}
          link2={`/Section-S/pageAdministration/${params.school_id}/pageSettings`}
        />


        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiData == "ECONNREFUSED" && <ServerError />}
        {/* {data == "ECONNREFUSED" && <ServerError />} */}
        {apiData && apiData.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}

        {apiData && apiData != "ECONNREFUSED" && <List apiData={apiData} params={params} />}
        {/* {data != "ECONNREFUSED" && <List apiData={data} params={params} />} */}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Subjects",
  description: "This is Subjects Page",
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
          title="View Subject Title"
          href={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageMainSubjects`}
        />

        <MyButtonCustom
          title="Assign Subject"
          href={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects/pre-select`}
        />

      </div>

      <div className="bg-bluedark border-stroke border-t dark:border-strokedark font-medium grid grid-cols-4 md:grid-cols-6 md:px-4 md:py-2 md:text-lg px-2 text-white tracking-widest">
        <div className="col-span-2 flex items-center">
          <span className="hidden md:flex w-6">#</span>
          <span className="w-full">Subject Name</span>
        </div>
        <div className="flex items-center text-wrap">
          <span className="flex">Classroom</span>
        </div>
        <div className="hidden items-center justify-between md:flex w-full">
          <span className="flex">Year</span>
          {/* <span className="flex items-start justify-start">Level</span>
          <span className="flex items-start">Sem</span> */}
        </div>
        <div className="hidden items-center justify-center md:flex">
          <span className="">Lecturer</span>
        </div>
        <div className="flex items-center justify-end md:pr-4 pr-2 text-center">
          <span className="">Action</span>
        </div>
      </div>
      {apiData.results && apiData.results.length > 0 && apiData.results.map((item: GetSubjectInter, key: number) => (
        <div
          className="border-stroke border-t dark:border-strokedark dark:text-white even:bg-blue-50 even:dark:bg-slate-700 grid grid-cols-4 md:grid-cols-6 md:px-4 md:text-lg px-2 py-2 text-black text-sm"
          key={key}
        >
          <div className="col-span-2 flex items-center">
            <span className="hidden md:flex w-10">{key + 1}</span>
            <span className="w-full">{item.main_subject__subject_name}</span>
          </div>
          <div className="flex flex-col gap-2 items-center md:flex-row text-sm text-wrap">
            <span className="flex">
              {item.classroom__level__level} {item.classroom__level__option}
            </span>
          </div>
          <div className="hidden items-center justify-between md:flex text-sm w-full">
            <span className="flex">{item.classroom__academic_year}</span>
          </div>
          <div className="hidden items-center justify-center md:flex ml-2">
            <span className="flex">{item.assigned_to__full_name}</span>
          </div>
          <div className="flex gap-2 items-center justify-center md:gap-6 w-full">
            <MyButtonCustom
              title="Detail"
              href={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects/details/${item.id}`}
            />
          </div>
        </div>
      ))}

      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects`}
      />

    </div>
  )
}


const Search = async ({ params }: any) => {
  const thisYear = new Date().getFullYear();
  const levelData: any = await getData(GetLevelUrl, { fieldList: [ "id", "level", "option"]});


  const onSearchServerAction = async (formData: FormData) => {
    'use server'

    var sn = formData.get("subject_name")
    var year = formData.get("year")
    var level = formData.get("level")
    if (!sn) { sn = "" }

    if (sn && year && level) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects?main_subject__subject_name=${sn}&classroom__academic_year=${year}&classroom__level__id=${level}`)
    }

    if (year && level) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects?main_subject__subject_name=${sn}&classroom__academic_year=${year}&classroom__level__id=${level}`)
    }

    redirect(`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageSubjects`)

  }
  return (
    <>

      <form action={onSearchServerAction} className='flex flex-row gap-2 text-black'>

        <input
          name='subject_name'
          placeholder='Subject ...'
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
          {levelData && levelData.results.map((item: GetLevelInter) => (
            <option key={item.id} value={item.id} className='md:w-32'>{item.level} {item.option}</option>
          ))}
        </select>

        <button type='submit' className='flex items-center justify-center ml-2'>
          <RiSearch2Fill size={23} />
        </button>
      </form>

    </>
  )
}
