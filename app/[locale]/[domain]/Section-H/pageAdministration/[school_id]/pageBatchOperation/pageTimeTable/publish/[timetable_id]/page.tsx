import { Metadata } from 'next'
import React, { Suspense } from 'react';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import { getData, getStartEndOfWeek } from '@/functions';
import {  } from '@/schemas/schemas';
import { redirect } from 'next/navigation';
import { GetTimeTableWeekUrl, TimeTableWeekUrl } from '@/Domain/Utils-H/timeControl/timeConfig';
import { ActionEdit } from '@/serverActions/actionGeneral';
import { SchemaCreateEditTimeTableWeek } from '@/Domain/schemas/schemas';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, timetable_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData = await getData(protocol + "api" + params.domain + GetTimeTableWeekUrl, { id: params.timetable_id, fieldList: [
    "id", "specialty__id","specialty__level__level", "specialty__academic_year", "specialty__main_specialty__specialty_name", "year_week"
  ] })


  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Publish TimeTable Confirmation"
          pageName1="Main Dashboard"
          link1={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/publish`}
        />

        <div className='flex flex-col gap-4'>

          {apiData && apiData.count && <PublishConfirm params={params} apiData={apiData.results[0]} searchParams={searchParams} />}

        </div>

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "Publish",
  description: "This is Publish Page",
};


const PublishConfirm = ({ apiData, params, searchParams }: any) => {

  const k = Object.keys(searchParams)[0]
  const value = searchParams[k] == "false" ? false : true

  const onSubmitSearchAction = async () => {
    'use server';

    var d = {}
    console.log(apiData)
    // return

    if (searchParams.publish){ d = { publish: value } };

    const data = { ...apiData, ...d, specialty_id: apiData.specialty__id }
    console.log(data)
    // return

    const response = await ActionEdit(data, data.id.toString(), SchemaCreateEditTimeTableWeek, protocol + "api" + params.domain + TimeTableWeekUrl)
    console.log(70, response)

    if (response.id == apiData.id){
      if (value){
        redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/publish?success=Published Successfully`)
      } else {
        redirect(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/publish?success=Closed Successfully`)
      }
    }

  }

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div></div>
      <Suspense fallback={<div>Loading ...</div>}>
        <form className="flex flex-col gap-2 md:gap-4 md:text-lg p-4 text-sm" action={onSubmitSearchAction}>
          <div className='flex flex-col'>
            <div className='flex'>Class: {apiData.specialty__main_specialty__specialty_name}</div>
            <div className='flex'>Academic Year:{apiData.specialty__academic_year}</div>
            <div className='flex'>Level: {apiData.specialty__level__level}</div>
            <div className='flex gap-4'>Week: <span className="font-medium">{getStartEndOfWeek(apiData.year_week.slice(4, 5), apiData.year_week.slice(0, 4))[0].slice(0, 16)} - {getStartEndOfWeek(apiData.year_week.slice(4, 5), apiData.year_week.slice(0, 4))[1].slice(0, 16)}</span></div>
          </div>
          {value ?
            <button type='submit' className='bg-greendark flex font-medium items-center justify-center px-4 py-2 rounded-sm text-white'>Publish Time-Table</button>
            :
            <button type='submit' className='bg-red flex font-medium items-center justify-center px-4 py-2 rounded-sm text-white'>Close Time-Table</button>
          }        </form>
      </Suspense>


    </div>
  )
}