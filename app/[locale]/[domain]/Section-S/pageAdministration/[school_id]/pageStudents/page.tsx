import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import MyPagination from '@/section-s/common/Pagination/MyPagination'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import { RiSearch2Fill } from 'react-icons/ri';
import { redirect } from 'next/navigation'
import MyButtonCustom from '@/section-s/common/MyButtonCustom'
import NotificationError from '@/section-s/common/NotificationError'
import ServerError from '@/section-s/common/ServerError'
import { AcademicYearUrl, GetLevelUrl } from '@/Domain/Utils-S/appControl/appConfig'
import { GetLevelInter } from '@/Domain/Utils-S/appControl/appInter'
import { GetSecondaryProfileInter } from '@/Domain/Utils-S/userControl/userInter'
import Link from 'next/link'
import { GetSecondaryProfileUrl } from '@/Domain/Utils-S/userControl/userConfig'
import { protocol } from '@/config'

const StudentList = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(
    protocol + GetSecondaryProfileUrl,
    {
      ...searchParams, user__role: "student", noclassroom: false, secondary_classroom__school__id: params.school_id, fieldList: [
        "id", "user__matricle", "user__full_name", "user__telephone", "user__first_name", "secondary_classroom__level__option",
        "secondary_classroom__level__level", "secondary_classroom__level__option", "secondary_classroom__academic_year", "secondary_classroom__domain", "user__telephone",
      ]
    },
  );

  console.log(apiData, 34)

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Students List"
          pageName1="Dashboard"
          link1={`/Section-S/pageAdministration/${params.school_id}`}
        />
        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData == "ECONNREFUSED" && <ServerError />}

        {apiData ?
          <List apiData={apiData} params={params} /> : <div className="bg-white flex flex-col font-medium h-full italic items-center justify-center py-40 text-xl tracking-widest">
            <span>No Student Registered</span>
            <Link href={`/Section-S/pageAdministration/${params.school_id}/pageStudents/pageAdmission`} className='bg-bluedash my-6 px-10 py-2 rounded text-white'>New Student</Link>
          </div>
        }

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


const List = ({ apiData, params }: any) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex flex-col gap-2 justify-between md:flex-row md:px-6 md:py-6 pb-2 px-4">
        <span className="dark:text-white flex font-semibold md:text-xl text-black">
          Count -{apiData?.count}
        </span>

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
          <span className="font-medium">Domain</span>
        </div>
        <div className="col-span-2 hidden items-center justify-center md:flex">
          <span className="font-medium">Class</span>
        </div>
        <div className="hidden items-center justify-center lg:flex">
          <span className="font-medium">Academic year</span>
        </div>
        <div className="flex items-center justify-center text-center">
          <span className="font-medium">Action</span>
        </div>
      </div>
      {apiData.results && apiData.results.length > 0 ? apiData.results.sort((a: GetSecondaryProfileInter, b: GetSecondaryProfileInter) => (a.user__first_name > b.user__first_name) ? 1 : (a.user__first_name < b.user__first_name) ? -1 : 0).map((item: GetSecondaryProfileInter, key: number) => (
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
              {item.secondary_classroom__domain}
            </span>
          </div>
          <div className="col-span-2 dark:text-white flex-row gap-4 hidden items-center justify-center md:flex w-full">
            <span className='flex justify-end w-full'>{item.secondary_classroom__level__level}</span>
            <span className='flex w-full'>{item.secondary_classroom__level__option}</span>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <span className="dark:text-white items-center text-black">
              <span>{item.secondary_classroom__academic_year}</span>
            </span>
          </div>
          <div className="flex gap-2 items-center justify-center md:gap-2 md:text-md px-2 text-center">
            <MyButtonCustom
              title='View'
              type='edit'
              href={`/Section-S/pageAdministration/${params.school_id}/pageStudents/details/${item.id}`}
            />
          </div>
        </div>
      ))
        :
        <div className="bg-white flex flex-col font-medium h-full italic items-center justify-center py-40 text-xl tracking-widest">
          <span>No Student Found</span>
          <Link href={`/Section-S/pageAdministration/${params.school_id}/pageStudents/pageAdmission`} className='bg-bluedash my-6 px-10 py-2 rounded text-white'>New Student</Link>
        </div>
      }

      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={`/Section-S/pageAdministration/${params.school_id}/pageStudents`}
      />

    </div>
  )
}



const SearchUserProfile = async ({ params }: any) => {
  const acadYear = await getData(AcademicYearUrl, {});
  const lev = await getData(GetLevelUrl, { nopage: true });

  const onSearchDrugServerAction = async (formData: FormData) => {
    'use server'

    var field = formData.get("field")
    var value = formData.get("value")
    var year = formData.get("year")
    var level = formData.get("level")

    if (field && field == "classroom" && value && value.toString().length > 1) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents?secondary_classroom__level__level=${value}`)
    }
    if (field && value && value.toString().length > 1) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents?user__${field}=${value}&secondary_classroom__academic_year=${year}&secondary_classroom__level__id=${level}`)
    }
    if (year || level) {
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents?secondary_classroom__academic_year=${year}&secondary_classroom__level__level=${level}`)
    }

    redirect(`/Section-S/pageAdministration/${params.school_id}/pageStudents`)

  }
  return (
    <>

      <form action={onSearchDrugServerAction} className='flex flex-row gap-2 text-black'>
        <select name='field' className='hidden md:flex'>
          <option value="full_name">Full Name</option>
          <option value="classroom">Class</option>
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
          <option value="">------------</option>
          {lev && lev.length > 0 && lev.map((item: GetLevelInter) => (
            <option key={item.id} value={item.level} className='md:w-28'>{item.level} {item.option}</option>
          ))}
        </select>

        <button type='submit' className='hidden items-center justify-center md:flex ml-2'><RiSearch2Fill size={23} /></button>
      </form>

    </>
  )
}