import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import { redirect } from 'next/navigation'
import NotificationError from '@/section-s/common/NotificationError'
import ServerError from '@/section-s/common/ServerError'
import MyButtonCustom from '@/section-s/common/MyButtonCustom'
import { GetDepartmentUrl } from '@/NoDomain/Utils-S/userControl/userConfig'
import { GetDepartmentInter } from '@/NoDomain/Utils-S/userControl/userInter'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + GetDepartmentUrl, {...searchParams, nopage: true});

  
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Departments" 
          pageName1="Back" 
          link1={`/Section-S/pageAdministration/${params.school_id}/pageSettings`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiData == "ECONNREFUSED" && <ServerError />}
        {apiData && apiData.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
        {apiData && apiData.count != "ECONNREFUSED" && <List apiData={apiData} params={params} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Departments",
  description: "This is Departments Page",
};


const List = ( {apiData, params}: any ) => {

  console.log(apiData, 58)

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex justify-between md:px-6 px-4 py-6 xl:px-7.5">
        <h4 className="dark:text-white font-semibold text-black text-xl">
          Department List ({apiData.count})
        </h4>
        <MyButtonCustom
          title="Add Department"
          href={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageDepartment/create`} 
        />
      </div>

      <div></div>

      <div className="bg-bluedark border-stroke border-t dark:border-strokedark font-medium grid grid-cols-2 md:grid-cols-3 md:px-6 px-6 py-2 text-lg text-white">
        <div className="hidden items-center sm:flex">
          <span className="font-medium">No</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium">Department Name</span>
        </div>
        <div className="flex items-center justify-end mr-6 text-center">
          <span className="font-medium">Action</span>
        </div>
      </div>
      {apiData.count && apiData.results.map((item: GetDepartmentInter, key: number) => (
        <div
          className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-2 md:grid-cols-3 md:px-6 px-4 py-2"
          key={key}
        >
          <div className="hidden items-center sm:flex">
            <span className="dark:text-white text-black text-sm">
              {key + 1}
            </span>
          </div>
          <div className="flex items-center">
            <span className="dark:text-white text-black">
              {item.name}
            </span>
          </div>
          <div className="flex gap-2 items-center justify-end md:gap-6 md:text-md px-2 w-full">
            <MyButtonCustom
              type='edit'
              title="View"
              href={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pageDepartment/details/${item.id}`}
            />
          </div>
        </div>
      ))}
    
    </div>
  )
}