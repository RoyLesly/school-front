import { Metadata } from 'next'
import React, { Suspense } from 'react';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';import { getData } from '@/functions';
import { ActionEdit } from '@/serverActions/actionGeneral';
import { redirect } from 'next/navigation';
import { protocol } from '@/config';
import { GetPublishUrl } from '@/Domain/Utils-S/appControl/appConfig';
import { SchemaCreateEditPublish } from '@/NoDomain/Utils-S/schemas/schemas';
import { PublishUrl } from '@/NoDomain/Utils-S/appControl/appConfig';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, publish_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData = await getData(protocol + GetPublishUrl, {
    id: params.publish_id, fieldList: [
      "id", "portal_ca", "semester", "portal_exam", "portal_resit", "specialty__id", "specialty__level__level", "specialty__academic_year", "specialty__main_specialty__specialty_name"
    ]
  })


  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName={`Open Portals -  ${searchParams && Object.keys(searchParams)[0].toUpperCase()}`}
          pageName1="Main Dashboard"
          link1={`/Sectcion-S/pageAdministration/${params.school_id}/pageResults/pagePublish`}
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

    if (searchParams.ca) { d = { portal_ca: value } };
    if (searchParams.exam) { d = { portal_exam: value } };
    if (searchParams.resit) { d = { portal_resit: value } };

    const data = { ...apiData, ...d, specialty_id: apiData.specialty__id, semester: apiData.semester }

    const response = await ActionEdit(data, data.id.toString(), SchemaCreateEditPublish, protocol + PublishUrl)

    if (response.id == apiData.id) {
      if (value) {
        redirect(`/Section-S/pageAdministration/${params.school_id}/pageAdmin/pagePortals?success=Portal Openned Successfully`)
      }
      redirect(`/Section-S/pageAdministration/${params.school_id}/pageAdmin/pagePortals?success=Portal Closed Successfully`)

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
            <div className='flex'>Semester: {apiData.semester}</div>
          </div>

          {value ?
            <button type='submit' className='bg-greendark flex font-medium items-center justify-center px-4 py-2 rounded-sm text-white'>Open Portal</button>
            :
            <button type='submit' className='bg-red flex font-medium items-center justify-center px-4 py-2 rounded-sm text-white'>Close Portal</button>
          }

        </form>
      </Suspense>


    </div>
  )
}