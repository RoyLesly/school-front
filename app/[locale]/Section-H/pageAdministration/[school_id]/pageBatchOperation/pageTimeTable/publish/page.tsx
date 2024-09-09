import { Metadata } from 'next'
import React from 'react'
import { getData, getStartEndOfWeek } from '@/functions'
import LayoutAdmin from '@/NoDomain/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/NoDomain/section-h/common/Breadcrumbs/Breadcrumb'
import Link from 'next/link'
import SessionExpired from '@/NoDomain/section-h/common/SessionExpired'
import NotificationError from '@/NoDomain/section-h/common/NotificationError'
import { GrStatusGood } from 'react-icons/gr'
import { GetTimeTableUrl } from '@/NoDomain/Utils-H/timeControl/timeConfig'
import { protocol } from '@/config'
import { GetTimeTableInter } from '@/NoDomain/Utils-H/timeControl/timeInter'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiTimeTables: any = await getData(protocol + GetTimeTableUrl, { specialty__school_campus__id: params.school_id, fieldList: [
    "id", "specialty__main_specialty__specialty_name", "specialty__academic_year", "specialty__level__level", "publish", "year_week",
  ] });

  console.log(apiTimeTables)

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Publish Time Table"
          pageName1="Dashboard"
          link1={`/pageAdministration/${params.school_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        <div className='flex-col gap-4 hidden md:flex'>
          {apiTimeTables && apiTimeTables.count && <List apiTimeTables={apiTimeTables} searchParams={searchParams} params={params} />}
          {apiTimeTables && apiTimeTables.unauthorized && <SessionExpired />}
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
    "Time Table",
  description: "This is Time Table  Page",
};


const List = async ({ apiTimeTables, params }: any) => {

  return <div className='flex flex-col flex-grow'>

    <div className="bg-bluedash dark:border-strokedark grid grid-cols-4 md:grid-cols-6 p-2 px-4 text-lg text-white tracking-wider">
      <div className="col-span-2 hidden items-center md:flex">
        <span className="font-medium">Class</span>
      </div>
      <div className="flex items-center">
        <span className="font-medium">Academic Year</span>
      </div>
      <div className="hidden items-center md:flex">
        <span className="font-medium">Level</span>
      </div>
      <div className="hidden items-center justify-center md:flex">
        <span className="font-medium">Period</span>
      </div>
      <div className="flex items-center justify-center text-center">
        <p className="font-medium">Published</p>
      </div>
    </div>

    {apiTimeTables || apiTimeTables.count ? apiTimeTables.results.map((item: GetTimeTableInter) => <div key={item.id} className="dark:border-strokedark dark:odd:bg-slate-600 dark:text-white grid grid-cols-4 md:grid-cols-6 odd:bg-notiblue p-2 px-4 text-black text-lg tracking-wider">
      <div className="col-span-2 hidden items-center md:flex">
        <span className="font-medium">{item.specialty__main_specialty__specialty_name}</span>
      </div>
      <div className="flex items-center">
        <span className="font-medium">{item.specialty__academic_year}</span>
      </div>
      <div className="hidden items-center md:flex">
        <span className="font-medium">{item.specialty__level__level}</span>
      </div>
      <div className="hidden items-center justify-center md:flex">
        <span className="font-medium">{getStartEndOfWeek(item.year_week.slice(4, 5), item.year_week.slice(0, 4))[0].slice(5, 16)} - {getStartEndOfWeek(item.year_week.slice(4, 5), item.year_week.slice(0, 4))[1].slice(5, 16)}</span>
      </div>
      <div className="hidden items-center justify-center md:flex">
        {item.publish ? 
        <Link href={`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/publish/${item.id}?publish=false`}><GrStatusGood color='green' size={30} /> </Link>
        : 
        <Link href={`/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/publish/${item.id}?publish=true`}>X</Link>}

      </div>
    </div>)

      :
      <div className='flex'>
        NO TIMETABLES FOR THIS ACADEMIC YEAR
        <div className='flex'>{apiTimeTables.results[apiTimeTables.results.length - 1]}</div>
      </div>}

  </div>
}