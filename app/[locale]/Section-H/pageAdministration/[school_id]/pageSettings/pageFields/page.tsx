import { Metadata } from 'next'
import React from 'react';
import MyPagination from '@/section-h/common/Pagination/MyPagination'
import { getData } from '@/functions'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import MyButtonCustom from '@/section-h/common/MyButtonCustom'
import NotificationError from '@/section-h/common/NotificationError'
import ServerError from '@/section-h/common/ServerError'
import { redirect } from 'next/navigation'
import { GetFieldUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { GetFieldInter } from '@/NoDomain/Utils-H/appControl/appInter';
import { protocol } from '@/config';
import Link from 'next/link';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + GetFieldUrl, { ...searchParams, fieldList: [ "id", "field_name", "domain__domain_name" ]});
  
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Fields" 
          pageName1="Dashboard" 
          pageName2="Settings" 
          link1={`/Section-H/pageAdministration/${params.school_id}/pageDashboard`}
          link2={`/Section-H/pageAdministration/${params.school_id}/pageSettings`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiData == "ECONNREFUSED" && <ServerError />}
        {apiData && apiData.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}


        {apiData != "ECONNREFUSED" && apiData.count ? <List apiData={apiData} params={params} /> 
        : 
        <div className='flex flex-col gap-10 items-center justify-center pb-40 pt-32'>
          <div>No Fields</div>
          <Link href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields/create`} className='bg-bluedark border px-6 py-2 rounded text-white'>No Fields</Link>
        </div>
        }

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Fields",
  description: "This is Fields Page",
};


const List = ( {apiData, params}: any ) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex justify-between p-4">
        <h4 className="dark:text-white font-semibold text-black text-xl">
          Field-List ({apiData.count})
        </h4>
        <MyButtonCustom
          title="Add Field"
          href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields/create`} 
        />
      </div>

      <div className="bg-bluedark border-stroke border-t dark:border-strokedark grid grid-cols-7 md:grid-cols-8 md:px-6 md:text-xl px-4 py-2 text-white">
        <div className="hidden items-center md:flex">
          <p className="col-span-1 font-medium">#</p>
        </div>
        <div className="col-span-4 flex items-center">
          <p className="font-medium">Field Name</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Domain</p>
        </div>
        <div className="col-span-1 flex items-center justify-end md:pr-6 pr-4 text-center">
          <p className="font-medium">Action</p>
        </div>
      </div>
      {apiData.results && apiData.results.length > 0 && apiData.results.map((item: GetFieldInter, key: number) => (
        <div
          className="border-stroke border-t dark:border-strokedark grid grid-cols-7 md:grid-cols-8 md:px-6 px-4 py-2"
          key={key}
        >
          <div className="hidden items-center sm:flex">
            <p className="dark:text-white text-black">
              {key + 1}
            </p>
          </div>
          <div className="col-span-4 flex items-center">
            <p className="dark:text-white text-black">
              {item.field_name}
            </p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="dark:text-white text-black">
              {item.domain__domain_name}
            </p>
          </div>
          <div className="flex gap-2 items-center justify-end md:gap-6 px-2 w-full">
            <MyButtonCustom
              type='edit'
              title="View"
              href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields/details/${item.id}`}
            />
          </div>
        </div>
      ))}

      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageFields`}
      />
    
    </div>
  )
}