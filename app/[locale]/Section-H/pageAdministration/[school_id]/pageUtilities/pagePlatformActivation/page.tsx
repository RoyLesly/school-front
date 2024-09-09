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
import Link from 'next/link'
import { GetSchoolFeesUrl } from '@/NoDomain/Utils-H/feesControl/feesConfig'
import { GetSchoolFeesInter } from '@/NoDomain/Utils-H/feesControl/feesInter'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiNotActiveAccounts: any = await getData(GetSchoolFeesUrl, { userprofile__specialty__school__id: params.school_id, platform_paid: false, userprofile__no_specialty: false, fieldList: [ 
    "id", "userprofile__id", "userprofile__user__full_name", "userprofile__user__username", "userprofile__user__matricle", "platform_charges", "balance",
    "userprofile__specialty__main_specialty__specialty_name", "userprofile__specialty__level__level"
  ] });
  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Pending Platform Charge Payment" 
          pageName1="Dashboard" 
          link1={`/Section-H/pageAdministration/${params.school_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiNotActiveAccounts == "ECONNREFUSED" && <ServerError />}
        {apiNotActiveAccounts && apiNotActiveAccounts.unauthorized && redirect(`/pageAuthentication/pageSessionExpired`)}
        {apiNotActiveAccounts && apiNotActiveAccounts != "ECONNREFUSED" && <List apiData={apiNotActiveAccounts} params={params} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Activation",
  description: "This is Activation Page",
};


const List = ( {apiData, params}: any ) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">
      <div className="flex justify-between md:px-6 px-4 py-6 xl:px-7.5">
        <h4 className="dark:text-white font-semibold text-black text-xl">
          {/* Program-List ({apiData.count}) */}
        </h4>
        <MyButtonCustom
          title="Pay All"
          href={`/Section-H/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/all`} 
        />
      </div>

      <div></div>

      <div className="bg-bluedark border-stroke border-t dark:border-strokedark font-medium grid grid-cols-2 md:grid-cols-7 md:px-6 px-4 py-2 text-lg text-white">
        <div className="hidden items-center sm:flex">
          <span className="font-medium">No</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium hidden md:flex">MATRICLE</span>
          <span className="font-medium md:hidden">ACCOUNT</span>
        </div>
        <div className="col-span-2 hidden items-center md:flex">
          <span className="font-medium">FULL NAME</span>
        </div>
        <div className="col-span-2 hidden items-center md:flex">
          <span className="font-medium">CLASS</span>
        </div>
        <div className="hidden items-center justify-between md:flex mx-4">
          <span className="font-medium">AMOUNT</span>
          <span className="font-medium">Action</span>
        </div>
      </div>
      {apiData.count && apiData.results.length > 0 ? apiData.results.map((item: GetSchoolFeesInter, key: number) => (
        <div
          className="2xl:px-6.5 border-stroke border-t dark:border-strokedark grid grid-cols-2 md:grid-cols-7 md:px-6 px-4 py-2"
          key={key}
        >
          <div className="hidden items-center sm:flex">
            <span className="dark:text-white text-black">
              {key + 1}
            </span>
          </div>
          <div className="flex items-center">
            <span className="dark:text-white hidden md:flex text-black">
              {item.userprofile__user__matricle}
            </span>
            <Link href={`/Section-H/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/${item.id}`} className='' >
            <span className="dark:text-white font-bold md:hidden text-bluedash">
              {item.userprofile__user__matricle}
            </span>
            </Link>
          </div>
          <div className="col-span-2 flex items-center">
            <span className="dark:text-white text-black">
              {item.userprofile__user__full_name}
            </span>
          </div>
          <div className="col-span-2 flex items-center">
            <span className="dark:text-white text-black">
            {item.userprofile__specialty__main_specialty__specialty_name} - L-{item.userprofile__specialty__level__level}
            </span>
          </div>
          <div className="hidden items-center justify-between md:flex mx-4">
            <span className="dark:text-white text-black">
              {item.platform_charges}
            </span>
            <MyButtonCustom
              type='edit'
              title="View"
              href={`/Section-H/pageAdministration/${params.school_id}/pageUtilities/pagePlatformActivation/${item.id}`} 
            />
          </div>
        </div>
      )) 
      : 
      <div className='flex items-center justify-center pb-60 pt-72 text-xl tracking-widest'>No Pending Platform Charges</div>
      }

      <MyPagination
        prevLink={apiData.previous}
        nextLink={apiData.next}
        count={apiData.count}
        thisUrl={`/Section-H/pageAdministration/${params.school_id}/pageSettings/pageUtilities/pagePlatformCharges`} 
        />
    
    </div>
  )
}