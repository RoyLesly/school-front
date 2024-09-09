import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb'
import Link from 'next/link'
import SessionExpired from '@/NoDomain/section-h/common/SessionExpired'
import NotificationError from '@/NoDomain/section-h/common/NotificationError'
import { AcademicYearUrl } from '@/NoDomain/Utils-H/appControl/appConfig'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiAcademicYear: any = await getData(protocol + AcademicYearUrl, {});

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Choose Action"
          pageName1="Dashboard"
          link1={`/pageAdministration/${params.school_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        <div className='flex-col gap-4 hidden md:flex'>
          {apiAcademicYear && apiAcademicYear.count && <Choose params={params} />}
          {apiAcademicYear && apiAcademicYear.unauthorized && <SessionExpired />}
        </div>
        <div className='flex flex-grow h-screen items-center justify-center md:hidden'>
          Available On Desktop Only
        </div>
      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Choose Action",
  description: "This is Time Table Page",
};


const Choose = async ({ params }: any) => {

  return <div className='flex flex-col flex-grow font-medium gap-20 h-full items-center justify-center md:pt-72 text-2xl tracking-widest'>

      <Link href={`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/selectclass`} className='bg-blue-950 flex items-center justify-center px-6 py-4 rounded text-center text-white w-96'>Create/Edit - Time Table</Link>

      <Link href={`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/publish`} className='bg-blue-950 flex items-center justify-center px-6 py-4 rounded text-center text-white w-96'>Publish Time - Table</Link>

  </div>
}