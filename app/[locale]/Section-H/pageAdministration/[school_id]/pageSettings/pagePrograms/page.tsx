import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import MyPagination from '@/section-h/common/Pagination/MyPagination'
import { getData } from '@/functions'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import ServerError from '@/section-h/common/ServerError'
import NotificationError from '@/section-h/common/NotificationError'
import MyButtonCustom from '@/section-h/common/MyButtonCustom'
import { redirect } from 'next/navigation'
import { GetProgramInter } from '@/NoDomain/Utils-H/userControl/userInter'
import { GetProgramUrl } from '@/NoDomain/Utils-H/userControl/userConfig'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + GetProgramUrl, {...searchParams});
  
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Programs" 
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
  title: "Programs",
  description: "This is Programs Page",
};


const List = ( {apiData, params}: any ) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex justify-between md:px-6 px-4 py-6 xl:px-7.5">
        <h4 className="dark:text-white font-semibold text-black text-xl">
          Program-List ({apiData.count})
        </h4>
        <MyButtonCustom
          title="Add Program"
          href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms/create`} 
        />
      </div>

      <div></div>

      <div className="bg-bluedark border-stroke border-t dark:border-strokedark font-medium grid grid-cols-2 md:grid-cols-4 md:px-6 px-4 py-2 text-lg text-white">
        <div className="hidden items-center sm:flex">
          <p className="font-medium">No</p>
        </div>
        <div className="flex items-center">
          <p className="font-medium">Program Name</p>
        </div>
        <div className="hidden items-center md:flex">
          <p className="font-medium">Description</p>
        </div>
        <div className="flex items-center justify-end md:pr-6 pr-4 text-center">
          <span className="font-medium">Action</span>
        </div>
      </div>
      {apiData.results && apiData.results.length > 0 && apiData.results.map((item: GetProgramInter, key: number) => (
        <div
          className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-2 md:grid-cols-4 md:px-6 px-4 py-2"
          key={key}
        >
          <div className="hidden items-center sm:flex">
            <p className="dark:text-white text-black">
              {key + 1}
            </p>
          </div>
          <div className="flex items-center">
            <p className="dark:text-white text-black">
              {item.name}
            </p>
          </div>
          <div className="hidden items-center md:flex">
            <p className="dark:text-white text-black">
              {item.description}
            </p>
          </div>
          <div className="flex gap-2 items-center justify-end px-2 w-full">
            <MyButtonCustom
              type='edit'
              title="View"
              href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pagePrograms/details/${item.id}`}
            />
          </div>
        </div>
      ))}

      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={"/Section-H/pageAdministration/pageSettings/pagePrograms"}
      />
    
    </div>
  )
}