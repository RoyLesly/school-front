import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { redirect } from 'next/navigation'
import NotificationError from '@/section-h/common/NotificationError'
import ServerError from '@/section-h/common/ServerError'
import MyButtonCustom from '@/section-h/common/MyButtonCustom'
import { GetLevelUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { GetLevelInter } from '@/NoDomain/Utils-H/appControl/appInter'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + GetLevelUrl, searchParams);
  
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Levels" 
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
    "Levels",
  description: "This is Levels Page",
};


const List = ( {apiData, params}: any ) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex justify-between md:px-6 px-4 py-6 xl:px-7.5">
        <h4 className="dark:text-white font-semibold text-black text-xl">
          Level List ({apiData.count})
        </h4>
        <MyButtonCustom
          title="Add Level"
          href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageLevels/create`} 
        />
      </div>

      <div></div>

      <div className="bg-bluedark border-stroke border-t dark:border-strokedark font-medium grid grid-cols-2 md:grid-cols-3 md:px-6 px-6 py-2 text-lg text-white">
        <div className="hidden items-center sm:flex">
          <p className="font-medium">No</p>
        </div>
        <div className="flex items-center">
          <p className="font-medium">Level</p>
        </div>
        <div className="flex items-center justify-end mr-6 text-center">
          <p className="font-medium">Action</p>
        </div>
      </div>
      {apiData.results && apiData.results.length > 0 && apiData.results.map((item: GetLevelInter, key: number) => (
        <div
          className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-2 md:grid-cols-3 md:px-6 px-4 py-2"
          key={key}
        >
          <div className="hidden items-center sm:flex">
            <p className="dark:text-white text-black text-sm">
              {key + 1}
            </p>
          </div>
          <div className="flex items-center">
            <p className="dark:text-white text-black text-sm">
              {item.level}
            </p>
          </div>
          <div className="flex gap-2 items-center justify-end md:gap-6 md:text-md px-2 text-sm w-full">
            <MyButtonCustom
              type='edit'
              title="View"
              href={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageLevels/details/${item.id}`}
            />
          </div>
        </div>
      ))}
    
    </div>
  )
}