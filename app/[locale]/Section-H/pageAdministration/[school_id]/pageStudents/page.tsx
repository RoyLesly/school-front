import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import { GetUserProfileUrl } from '@/NoDomain/Utils-H/userControl/userConfig'
import MyPagination from '@/NoDomain/section-h/common/Pagination/MyPagination'
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb'
import { RiSearch2Fill } from 'react-icons/ri';
import { redirect } from 'next/navigation'
import MyButtonCustom from '@/NoDomain/section-h/common/MyButtonCustom'
import NotificationError from '@/NoDomain/section-h/common/NotificationError'
import ServerError from '@/NoDomain/section-h/common/ServerError'
import { AcademicYearUrl, GetLevelUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { FaDownload } from 'react-icons/fa6'
import Link from 'next/link'
import { GetUserProfileInter } from '@/NoDomain/Utils-H/userControl/userInter'
import { LevelInter } from '@/NoDomain/Utils-H/appControl/appInter'
import { protocol } from '@/config'
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin'

const StudentList = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(
    protocol + GetUserProfileUrl,
    {...searchParams, user__role: "student", nospecialty: false, specialty__school__campus__id: params.school_id, fieldList: [ 
      "id", "user__matricle", "user__full_name", "user__telephone", 
      "specialty__main_specialty__specialty_name", "specialty__academic_year", "specialty__level__level", "user__telephone",
    ] },
  );

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Students List"
          pageName1="Dashboard"
          link1="/Section-H/pageAdministration"
        />
        {searchParams && <NotificationError errorMessage={searchParams} />}

        {!apiData && apiData == "ECONNREFUSED" && <ServerError />}

        {apiData && apiData != "ECONNREFUSED" && <>
          {apiData.count ? <List apiData={apiData} params={params} searchParams={searchParams} /> 
            :
            <div className="bg-white flex flex-col font-semibold gap-10 items-center justify-center pb-60 pt-40 rounded tracking-widest">
              <div className="text-[28px]">No Assigned or Registered Students</div>
              <Link href={`/Section-H/pageAdministration/${params.school_id}/pageStudents/pageAdmission`} className="bg-bluedark px-6 py-2 rounded text-[20px] text-white">New Student</Link>
            </div>
            }
        </>}  

      </>
    </LayoutAdmin>
  )
}

export default StudentList

export const metadata: Metadata = {
  title:
    "Students List",
  description: "This is Students List Page",
};


const List = ({ apiData, params, searchParams }: any) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex flex-col gap-2 justify-between md:flex-row md:px-6 md:py-6 pb-2 px-4">
        <span className="dark:text-white flex font-semibold md:text-xl text-black">
          Count-{apiData?.count}
        </span>

        {searchParams ? Object.keys(searchParams).length > 0 ? <button className="bg-bluedark flex font-semibold items-center justify-center md:gap-2 md:text-lg px-4 py-1 rounded text-white">
          Download <FaDownload />
        </button> : <></> : <></>}

        <SearchUserProfile params={params} />

      </div>

      <div 
        className="bg-bluedark grid grid-cols-3 md:grid-cols-7 px-4 py-2 text-lg text-white tracking-wide"
      >
        <div className="flex items-center justify-between lg:mx-4 mx-2">
          <span className="font-medium">Matricle</span>
          {/* <p className="font-medium">Username</p> */}
        </div>
        <div className="flex items-center">
          <span className="font-medium">Full Name</span>
        </div>
        <div className="hidden items-center justify-center lg:flex">
          <span className="font-medium">Telephone</span>
        </div>
        <div className="col-span-2 hidden items-center justify-center md:flex">
          <span className="font-medium">Specialty</span>
        </div>
        <div className="hidden items-center justify-center lg:flex">
          <span className="font-medium">Academic year</span>
        </div>
        <div className="flex items-center justify-center text-center">
          <span className="font-medium">Action</span>
        </div>
      </div>
      {apiData.results && apiData.results.length > 0 && apiData.results.map((item: GetUserProfileInter, key: number) => (
        <div
          className="border-stroke border-t dark:border-strokedark grid grid-cols-3 md:grid-cols-7 odd:bg-slate-50 odd:dark:bg-slate-800 px-2 py-1 text-black"
          key={key}
        >
          <div className="flex items-center justify-between lg:mr-4 mx-2">
            <p className="dark:text-white text-black">
              {item.user__matricle}
            </p>
          </div>
          <div className="flex items-center">
            <p className="dark:text-white text-black">
              {item.user__full_name}
            </p>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <span className="dark:text-white text-black text-sm">
              {item.user__telephone}
            </span>
          </div>
          <div className="col-span-2 dark:text-white flex-row gap-2 hidden items-center justify-center md:flex w-full">
                <span className='flex justify-end'>{item.specialty__main_specialty__specialty_name}</span>
                <span className='flex w-16'>L-{item.specialty__level__level}</span>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <span className="dark:text-white items-center text-black">
              <span>{item.specialty__academic_year}</span>
            </span>
          </div>
          <div className="flex gap-2 items-center justify-center md:gap-2 md:text-md px-2 text-center">
            <MyButtonCustom
              title='View'
              type='edit'
              href={`/Section-H/pageAdministration/${params.school_id}/pageStudents/details/${item.id}`}
              />
          </div>
        </div>
      ))}

      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={`/Section-H/pageAdministration/${params.school_id}/pageStudents`}
      />

    </div>
  )
}



const SearchUserProfile = async ({params}: any) => {
  const acadYear = await getData(AcademicYearUrl, {});
  const lev = await getData(GetLevelUrl, { fieldList: [ "id", "level"]});
  const onSearchDrugServerAction = async (formData: FormData) => {
    'use server'

    var field = formData.get("field")
    var value = formData.get("value")
    const year = formData.get("year")
    const level = formData.get("level")

    if (field && field == "specialty" && value && value.toString().length > 1) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents?specialty__main_specialty__specialty_name=${value}&specialty__academic_year=${year}&specialty__level__id=${level}`)
    } 
    if (field && value && value.toString().length > 1) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents?user__${field}=${value}&specialty__academic_year=${year}&specialty__level__id=${level}`)
    } 
    if (year || level) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents?specialty__academic_year=${year}&specialty__level__id=${level}`)
    }

    redirect(`/Section-H/pageAdministration/${params.school_id}/pageStudents`)

  }
  return (
    <>

      <form action={onSearchDrugServerAction} className='flex flex-row gap-2 text-black'>
        <select name='field' className='hidden md:flex'>
          <option value="full_name">Full Name</option>
          <option value="specialty">Specialty</option>
        </select>
        <input name='value' placeholder='Search Student ...' className='border-2 border-slate-700 flex md:w-60 px-2 py-1 rounded text-black w-full' />

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
          {lev && lev.count && lev.results.map((item: LevelInter) => (
            <option key={item.id} value={item.id} className='md:w-28'>{item.level}</option>
          ))}
        </select>

        <button type='submit' className='hidden items-center justify-center md:flex ml-2'><RiSearch2Fill size={23} /></button>
      </form>

    </>
  )
}