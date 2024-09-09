import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb'
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin'
import { GetCustomUserUrl } from '@/NoDomain/Utils-H/userControl/userConfig'
import MyButtonCustom from '@/NoDomain/section-h/common/MyButtonCustom'
import MyPagination from '@/NoDomain/section-h/common/Pagination/MyPagination'
import NotificationError from '@/NoDomain/section-h/common/NotificationError'
import ServerError from '@/NoDomain/section-h/common/ServerError'
import { AcademicYearUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { redirect } from 'next/navigation'
import { GetCustomUserInter } from '@/NoDomain/Utils-H/userControl/userInter'
import { RiSearch2Fill } from 'react-icons/ri'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiLecturers = await getData( protocol + GetCustomUserUrl, { ...searchParams, role: "teacher", nopage: true, school__id: params.school_id, is_staff: false })
  const apiAdmins = await getData( protocol + GetCustomUserUrl, { ...searchParams, role: "admin", nopage: true, school__id: params.school_id, is_staff: false })

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Marks Entry Page"
          pageName1="Dashboard"
          link1="/Section-H/pageAdministration"
        />
        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiLecturers == "ECONNREFUSED" && <ServerError />}
        {apiLecturers && apiLecturers.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
        {apiLecturers && <SelectLecturer data={apiLecturers} params={params} apiAdmins={apiAdmins} />}


      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Marks Entry ",
  description: "This is Marks Entry  Page",
};

const SelectLecturer = async ({ data, params, apiAdmins }: any) => {

  const years = await getData(protocol + AcademicYearUrl, {})
  const sortYears = await years.results.sort((a: string, b: string) => a > b ? 1 : b > a ? -1 : 0)

  return (
    <div className='flex flex-col h-full'>

      <SearchLecturers params={params} />

      <div className="bg-bluedark dark:border-strokedark grid grid-cols-4 md:grid-cols-6 md:text-lg px-2 py-1 text-sm text-white tracking-wider">
        <div className="hidden items-center justify-between md:flex md:mx-4 mx-2">
          <span className="font-medium">No</span>
        </div>
        <div className="flex items-center justify-between md:mx-4 mx-2">
          <span className="font-medium">Username</span>
          <span className="font-medium hidden md:flex">Title</span>
        </div>
        <div className="col-span-2 flex items-center">
          <span className="font-medium">Full Name</span>
        </div>
        <div className="hidden items-center justify-center lg:flex">
          <span className="font-medium">Telephone</span>
        </div>
        <div className="flex items-center justify-center text-center">
          <span className="font-medium">Action</span>
        </div>
      </div>

      {apiAdmins && data ? (data.length > 0 && apiAdmins.length > 0 ? [...data, ...apiAdmins] : data.length > 0 ? data : apiAdmins).map((item: GetCustomUserInter, key: number) => (
        <div
          className="border-stroke border-t dark:border-strokedark grid grid-cols-4 md:grid-cols-6 md:px-4 odd:bg-slate-50 odd:dark:bg-slate-800 px-3 py-1"
          key={key}
        >
          <div className="hidden items-center justify-start md:flex md:mr-4 mx-2">
            <span className="dark:text-white text-black">{key + 1}</span>
          </div>
          <div className="flex items-center justify-between lg:mr-4 mx-2">
            <span className="dark:text-white text-black">{item.username}</span>
            <span className="dark:text-white hidden md:flex text-black">{item.title}</span>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="dark:text-white text-black">
              {item.full_name}
            </p>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <p className="dark:text-white text-black">
              {item.telephone}
            </p>
          </div>
          <div className="flex gap-2 items-center justify-center md:gap-2 md:px-2 md:text-md text-center text-sm">
            <button>
              <MyButtonCustom
                title='View'
                type='view'
                href={`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry/${item.id}?specialty__academic_year=${sortYears[sortYears.length - 1]}`}
              />
            </button>
          </div>
        </div>
      )) : <div className='bg-white flex font-medium items-center justify-center pb-72 pt-40 rounded text-[30px] tracking-widest'>No Lecturer Found</div>}

      <MyPagination
        prevLink={data.previous}
        nextLink={data.next}
        count={data.count}
        thisUrl={`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry?user__role=teacher`}
      />

    </div>
  )
}



const SearchLecturers = async ({ params }: any) => {
  const onSearchDrugServerAction = async (formData: FormData) => {
    'use server'

    var name = formData.get("name")

    if (name && name.toString().length > 1) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry?full_name=${name}`)
    }
    redirect(`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry`)

  }
  return (
      <form action={onSearchDrugServerAction} className='flex flex-row gap-2 items-center justify-center py-2 text-black'>

        <input name='name' placeholder='Search Lecturer ...' className='border-2 border-slate-700 flex px-2 py-1 rounded text-black w-full' />

        <button type='submit' className='hidden items-center justify-center md:flex ml-2'><RiSearch2Fill size={23} /></button>

      </form>
  )
}