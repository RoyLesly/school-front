import { Metadata } from 'next'
import React from 'react'
import { DomainInter } from '@/NoDomain/Utils-H/appControl/appInter'
import { GetDomainUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import MyPagination from '@/section-h/common/Pagination/MyPagination'
import { getData } from '@/functions'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import MyButtonCustom from '@/section-h/common/MyButtonCustom'
import NotificationError from '@/section-h/common/NotificationError'
import ServerError from '@/section-h/common/ServerError'
import { redirect } from 'next/navigation'
import { protocol } from '@/config'
import Link from 'next/link'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: DomainInter[] | any = await getData(protocol + GetDomainUrl, { nopage: true });

  console.log(apiData, 25)
  
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Domains" 
          pageName1="Dashboard" 
          pageName2="Settings" 
          link1={`/Section-H/pageAdministration/${params.school_id}`}
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiData == "ECONNREFUSED" && <ServerError />}
        {apiData && apiData.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
        {apiData != "ECONNREFUSED" && apiData.length > 0 ? <List apiData={apiData} params={params} /> 
        : 
        <div className='flex flex-col gap-10 items-center justify-center pb-40 pt-32'>
          <div>No Domains</div>  
          <Link href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains/create`} className='bg-bluedark border px-6 py-2 rounded text-white'>Create Domain</Link>  
        </div>}
        
      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Domains",
  description: "This is Domains Page",
};


const List = ( {apiData, params}: any ) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex justify-between md:px-6 px-4 py-6 xl:px-7.5">
        <h4 className="dark:text-white font-semibold text-black text-xl">
          Domain List ({apiData.length})
        </h4>
        <MyButtonCustom
          title="Add Domain"
          href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains/create`} 
        />
      </div>

      <div></div>

      <div className="bg-bluedark border-stroke border-t dark:border-strokedark grid grid-cols-3 md:grid-cols-4 md:px-6 px-4 py-2 text-white">
        <div className="hidden items-center md:flex">
          <p className="font-medium">#</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Domain Name</p>
        </div>
        <div className="flex items-center justify-end md:pr-6 pr-4 text-center">
          <p className="font-medium">Action</p>
        </div>
      </div>
      {apiData && apiData.length > 0 && apiData.map((item: DomainInter, key: number) => (
        <div
          className="border-stroke border-t dark:border-strokedark grid grid-cols-3 md:grid-cols-4 md:px-6 px-4 py-2"
          key={key}
        >
          <div className="hidden items-center sm:flex">
            <p className="dark:text-white text-black text-sm">
              {key + 1}
            </p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="dark:text-white text-black text-sm">
              {item.domain_name}
            </p>
          </div>
          <div className="flex gap-2 items-center justify-end md:gap-6 px-2 w-full">
            <MyButtonCustom
              type='edit'
              title="View"
              href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains/details/${item.id}`}
            />
          </div>
        </div>
      ))}

      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageDomains`}
      />
    
    </div>
  )
}