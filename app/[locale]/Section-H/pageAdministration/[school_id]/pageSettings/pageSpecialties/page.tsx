import { Metadata } from 'next'
import React from 'react'
import MyPagination from '@/section-h/common/Pagination/MyPagination'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import NotificationError from '@/section-h/common/NotificationError'
import ServerError from '@/section-h/common/ServerError'
import MyButtonCustom from '@/section-h/common/MyButtonCustom'
import { RiSearch2Fill } from 'react-icons/ri';
import { redirect } from 'next/navigation'
import { getData } from '@/functions'
import { GetSpecialtyUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { GetSpecialtyInter } from '@/NoDomain/Utils-H/appControl/appInter'
import { protocol } from '@/config'


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + GetSpecialtyUrl, {...searchParams, school__id: params.school_id, fieldList: [ "id", "tuition", "main_specialty__specialty_name", "academic_year", "level__level" ]});
  
  return (
    <LayoutAdmin>
      <>
       <Breadcrumb
          pageName="Classes" 
          pageName1="Dashboard" 
          pageName2="Settings" 
          link1={`/Section-H/pageAdministration/${params.school_id}`}
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
    "Classes",
  description: "This is Classes Page",
};



const List = ( {apiData, params }: any ) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex gap-2 justify-between md:px-4 p-2">
        <h4 className="dark:text-white font-semibold md:text-xl text-black">
          Count ({apiData.count})
        </h4>

        <Search params={params} />
        
        <MyButtonCustom 
          type='edit'
          title="See Specialties"
          href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties`}
        />
        
        <MyButtonCustom 
          title="Add Class"
          href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/create`}
        />

      </div>

      <div className="bg-bluedark border-stroke border-t dark:border-strokedark font-medium grid grid-cols-4 md:grid-cols-6 md:px-4 md:py-2 md:text-lg px-2 text-white tracking-widest">
        <div className="hidden items-center md:flex">
          <span className="">#</span>
        </div>
        <div className="col-span-2 flex items-center">
          <span className="">Class Name</span>
        </div>
        <div className="flex items-center md:justify-center text-center text-wrap">
          <span className="flex">Year / Level</span>
        </div>
        <div className="hidden items-center md:flex">
          <span className="flex">Tuition</span>
        </div>
        <div className="flex items-center justify-end md:pr-4 pr-2 text-center">
          <span className="">Action</span>
        </div>
      </div>
      {apiData.results && apiData.results.length > 0 && apiData.results.map((item: GetSpecialtyInter, key: number) => (
        <div
          className="border-stroke border-t dark:border-strokedark dark:text-white even:bg-blue-50 even:dark:bg-slate-700 grid grid-cols-4 md:grid-cols-6 md:px-4 md:text-lg px-2 py-2 text-black text-sm"
          key={key}
        >
          <div className="hidden items-center md:flex">
            <p className="">
              {key + 1}
            </p>
          </div>
          <div className="col-span-2 flex items-center">
            <span className="">
              {item.main_specialty__specialty_name}
            </span>
          </div>
          <div className="flex flex-col gap-2 items-center md:flex-row md:justify-center text-wrap">
            <span className="flex">
              {item.academic_year}
            </span>
            <span className="flex">
              {item.level__level}
            </span>
          </div>
          <div className="hidden items-center md:flex">
            <span className="italic">
              {parseInt(item.tuition).toLocaleString()} FCFA
            </span>
          </div>
          <div className="flex gap-2 items-center justify-end md:gap-6 w-full">
            <MyButtonCustom
              title="View" 
              href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties/details/${item.id}`}
            />
          </div>
        </div>
      ))}

      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties`}
      />
    
    </div>
  )
}


const Search = async ({params}: any) => {
  const thisYear = new Date().getFullYear();

  const onSearchServerAction = async (formData: FormData) => {
    'use server'

    var year = formData.get("year")

    if (year) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties?academic_year=${year}`)
    } 

    redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties`)

  }
  return (
    <>

      <form action={onSearchServerAction} className='flex flex-row gap-2 text-black'>

        <select 
          name='year' 
          className='border-2 border-slate-700 flex md:w-32 px-2 py-1 rounded text-black'
        >
          <option value="">-------</option>
          {[ `${thisYear-3}/${thisYear-2}`, `${thisYear-2}/${thisYear-1}`, `${thisYear-1}/${thisYear}`, `${thisYear}/${thisYear+1}` ].map((item: string) => (
            <option key={item} value={item} className='md:w-32'>{item}</option>
          ))}
        </select>

        <button type='submit' className='flex items-center justify-center ml-2'>
          <RiSearch2Fill size={23} />
        </button>
      </form>

    </>
  )
}
