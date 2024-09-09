import { Metadata } from 'next'
import React from 'react'
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb'
import { ProgramInter } from '@/Domain/Utils-S/userControl/userInter'
import MyPagination from '@/section-s/common/Pagination/MyPagination'
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin'
import NotificationError from '@/section-s/common/NotificationError'
import MyButtonCustom from '@/section-s/common/MyButtonCustom'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  // const apiData: ProgramInter[] | any = await getData(ResetPasswordTokensUrl, {});
  // console.log(27, apiData)
  
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Password Tokens" 
          pageName1="Dashboard" 
          pageName2="Settings" 
          link1={`/Section-S/pageAdministration/${params.school_id}`}
          link2={`/Section-S/pageAdministration/${params.school_id}/pageUtilities`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {/* {apiData == "ECONNREFUSED" && <ServerError />} */}
        {/* {apiData && apiData.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)} */}
        {/* {apiData != "ECONNREFUSED" && <List apiData={apiData} params={params} />} */}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Password",
  description: "This is Password Page",
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
          href={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pagePrograms/create`} 
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
      {apiData.results && apiData.results.length > 0 && apiData.results.map((item: ProgramInter, key: number) => (
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
              href={`/Section-S/pageAdministration/${params.school_id}/pageSettings/pagePrograms/details/${item.id}`}
            />
          </div>
        </div>
      ))}

      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={"/Section-S/pageAdministration/pageSettings/pagePrograms"}
      />
    
    </div>
  )
}