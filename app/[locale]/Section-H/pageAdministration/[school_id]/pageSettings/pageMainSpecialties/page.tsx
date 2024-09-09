import { Metadata } from 'next'
import React from 'react'
import MyPagination from '@/section-h/common/Pagination/MyPagination'
import { getData } from '@/functions'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import NotificationError from '@/section-h/common/NotificationError'
import ServerError from '@/section-h/common/ServerError'
import MyButtonCustom from '@/section-h/common/MyButtonCustom'
import { redirect } from 'next/navigation'
import { RiSearch2Fill } from 'react-icons/ri';
import { GetDomainUrl, GetMainSpecialtyUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { DomainInter, GetMainSpecialtyInter } from '@/NoDomain/Utils-H/appControl/appInter'
import { protocol } from '@/config'


const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + GetMainSpecialtyUrl, {...searchParams, fieldList: [ "id", "specialty_name", "field__domain__domain_name" ]});
  
  return (
    <LayoutAdmin>
      <>
       <Breadcrumb
          pageName="Specialty Titles" 
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
  title:"Main-Specialties",
  description: "This is Main Specialties Page",
};



const List = ( {apiData, params}: any ) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex justify-between md:px-6 px-4 py-6 xl:px-7.5">
        <div className="dark:text-white font-semibold md:text-xl text-black">
          <span className='flex'>Count ({apiData.count})</span>
        </div>

        <Search params={params} />

        
        <MyButtonCustom
          type='edit'
          title="See Classes"
          href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageSpecialties`}
        />
        
        <MyButtonCustom 
          title="Add Specialty Title"
          href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties/create`}
        />
      </div>

      <div></div>

      <div className="bg-bluedark border-stroke border-t dark:border-strokedark font-medium grid grid-cols-4 md:grid-cols-5 md:px-6 px-4 py-2 text-white">
        <div className="hidden items-center sm:flex">
          <p className="font-medium">#</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Specialty Name</p>
        </div>
        <div className="flex items-center">
          <p className="font-medium">Domain</p>
        </div>
        <div className="flex items-center justify-end pr-4 text-center">
          <p className="font-medium">Action</p>
        </div>
      </div>
      {apiData.results && apiData.results.length > 0 && apiData.results.map((item: GetMainSpecialtyInter, key: number) => (
        <div
          className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-4 md:grid-cols-5 md:px-6 px-4 py-2"
          key={key}
        >
          <div className="hidden items-center md:flex">
            <p className="dark:text-white text-black">
              {key + 1}
            </p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="dark:text-white text-black">
              {item.specialty_name}
            </p>
          </div>
          <div className="flex items-center">
            <p className="dark:text-white text-black">
              {item.field__domain__domain_name}
            </p>
          </div>
          <div className="flex gap-2 items-center justify-end md:gap-6 md:text-md text-sm w-full">
            <MyButtonCustom
              title="View" 
              href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties/details/${item.id}`}
            />
          </div>
        </div>
      ))}

      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties`}
      />
    
    </div>
  )
}

const Search = async ({params}: any) => {
  const domainData = await getData(GetDomainUrl, {});
  const onSearchServerAction = async (formData: FormData) => {
    'use server'

    var di = formData.get("domain_id")

    if (di) {
      redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties?field__domain__id=${di}`)
    } 

    redirect(`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageMainSpecialties`)

  }
  return (
    <>

      <form action={onSearchServerAction} className='flex flex-row gap-2 text-black'>

        <select 
          name='domain_id' 
          className='border-2 border-slate-700 flex md:w-32 px-2 py-1 rounded text-black'
        >
          <option value="">-------</option>
          {domainData && domainData.count && domainData.results.map((item: DomainInter) => (
            <option key={item.id} value={item.id} className='md:w-28'>{item.domain_name}</option>
          ))}
        </select>

        <button type='submit' className='flex items-center justify-center ml-2'>
          <RiSearch2Fill size={23} />
        </button>
      </form>

    </>
  )
}