import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import Link from 'next/link'
import SessionExpired from '@/section-h/common/SessionExpired'
import NotificationError from '@/section-h/common/NotificationError'
import { redirect } from 'next/navigation'
import { GetSpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { GetSpecialtyInter } from '@/Domain/Utils-H/appControl/appInter'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const year: any = new Date()

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Select Class"
          pageName1="Dashboard"
          link1={`/${params.domain}/Section-H/pageAdministration/${params.school_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        <div className='flex-col gap-4 hidden md:flex'>
          <List years={(year.getFullYear() - 1) + "/" + year.getFullYear()} searchParams={searchParams} params={params} />
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

const List = async ({ years, searchParams, params }: any) => {

  const SearchClass = async (formData: FormData) => {
    "use server"

    var specialty_name = formData.get("specialty_name")
    if (specialty_name){
      redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/selectclass?main_specialty__specialty_name=${specialty_name}`)
    }
  }

  const apiSpecialty: any = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, { ...searchParams, academic_year: years, nopage: true, school__campus__id: params.school_id, fieldList: ["id", "main_specialty__specialty_name", "academic_year", "level__level"] });

  console.log(apiSpecialty, 66)
  console.log(apiSpecialty, 66)

  return <div className='flex flex-col flex-grow'>

    <form action={SearchClass} className='flex items-center justify-center py-2'>
      <input name="specialty_name" placeholder='Search Class ...' className='border-2 flex items px-6 py-2 rounded text-black text-lg w-full' />
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
        <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${item.id}/listCourses`} className="bg-bluedash font-medium px-6 py-1 rounded">Select</Link>
      </div>
    </div>)

      :
      <div className='flex'>
        NO CLASS FOR THIS ACADEMIC YEAR
        <div className='flex'>{years.results[years.results.length - 1]}</div>
      </div>}

  </div>
}