import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb'
import Link from 'next/link'
import NotificationError from '@/NoDomain/section-h/common/NotificationError'
import { redirect } from 'next/navigation'
import { AcademicYearUrl, GetSpecialtyUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { GetSpecialtyInter } from '@/NoDomain/Utils-H/appControl/appInter'
import { protocol } from '@/config'
import { RiSearch2Fill } from 'react-icons/ri'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const acadYears: any = await getData(protocol + AcademicYearUrl, {} );

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Select Class"
          pageName1="Dashboard"
          link1={`/pageAdministration/${params.school_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        <div className='flex-col gap-4 hidden md:flex'>
          {acadYears && acadYears.count && <List school_id={params.school_id} searchParams={searchParams} acadYears={acadYears.results.sort((a: string, b:string) => a[3] > b [3] ? -1 : a[3] < b[3] ? 1 : 0)} />}
        </div>
        <div className='flex flex-grow h-screen items-center justify-center md:hidden'>
          Available On Desktop Only
        </div>
      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Time Table",
  description: "This is Time Table  Page",
};

const List = async ({ searchParams, school_id, acadYears }: any) => {

  const SearchClass = async (formData: FormData) => {
    "use server"

    var specialty_name = formData.get("specialty_name")
    var year = formData.get("year")
    if (specialty_name && year){
      redirect(`/Section-H/pageAdministration/${school_id}/pageBatchOperation/pageTimeTable/selectclass?main_specialty__specialty_name=${specialty_name}&academic_year=${year}`)
    }
    if (specialty_name){
      redirect(`/Section-H/pageAdministration/${school_id}/pageBatchOperation/pageTimeTable/selectclass?main_specialty__specialty_name=${specialty_name}`)
    }
    if (year){
      redirect(`/Section-H/pageAdministration/${school_id}/pageBatchOperation/pageTimeTable/selectclass?&academic_year=${year}`)
    }
  }
  const apiSpecialty: any = await getData(protocol + GetSpecialtyUrl, { ...searchParams, academic_year: Object.keys(searchParams).length ? searchParams["academic_year"] : acadYears[0], nopage: true, school__id: school_id, fieldList: ["id", "main_specialty__specialty_name", "academic_year", "level__level"] });

  return <div className='flex flex-col flex-grow'>

    <form action={SearchClass} className='flex gap-2 items-center justify-center py-2'>
      <input name="specialty_name" placeholder='Search Class ...' className='border flex items px-6 py-1 rounded text-black text-lg w-full' />
      <select name="year" defaultValue={acadYears[0]} className='border flex px-6 py-1 rounded w-full'>
        {acadYears.map((item: string) => <option key={item}>{item}</option>)}
      </select>
      <button type='submit' className='bg-blue-300 border px-4 py-[6px] rounded'><RiSearch2Fill /></button>
    </form>

    <div className="bg-bluedash dark:border-strokedark grid grid-cols-4 md:grid-cols-5 p-2 px-4 text-lg text-white tracking-wider">
      <div className="col-span-2 hidden items-center md:flex">
        <span className="font-medium">Class</span>
      </div>
      <div className="flex items-center">
        <span className="font-medium">Academic Year</span>
      </div>
      <div className="hidden items-center md:flex">
        <span className="font-medium">Level</span>
      </div>
      <div className="flex items-center justify-center text-center">
        <p className="font-medium">Action</p>
      </div>
    </div>

    {apiSpecialty ? apiSpecialty.map((item: GetSpecialtyInter) => <div key={item.id} className="dark:border-strokedark dark:odd:bg-slate-600 dark:text-white grid grid-cols-4 md:grid-cols-5 odd:bg-notiblue p-2 px-4 text-black text-lg tracking-wider">
      <div className="col-span-2 hidden items-center md:flex">
        <span className="font-medium">{item.main_specialty__specialty_name}</span>
      </div>
      <div className="flex items-center">
        <span className="font-medium">{item.academic_year}</span>
      </div>
      <div className="hidden items-center md:flex">
        <span className="font-medium">{item.level__level}</span>
      </div>
      <div className="flex items-center justify-center text-center text-white">
        <Link href={`/Section-H/pageAdministration/${school_id}/pageBatchOperation/pageTimeTable/${item.id}/listCourses`} className="bg-bluedash font-medium px-6 py-1 rounded">Select</Link>
      </div>
    </div>)

      :
      <div className='flex'>
        NO CLASS FOR THIS ACADEMIC YEAR
        {/* <div className='flex'>{(year-1) + "/" + (year)}</div> */}
      </div>}

  </div>
}