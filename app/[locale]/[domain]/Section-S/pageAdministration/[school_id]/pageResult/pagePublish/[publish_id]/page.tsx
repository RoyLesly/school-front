import { Metadata } from 'next'
import React, { Suspense } from 'react';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import { GetPublishUrl, PublishUrl } from '@/Domain/Utils-S/appControl/appConfig';
import { getData } from '@/functions';
import { ActionEdit } from '@/serverActions/actionGeneral';
import { SchemaCreateEditPublish } from '@/Domain/Utils-S/schemas/schemas';
import { redirect } from 'next/navigation';
import { protocol } from '@/config';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, publish_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData = await getData(protocol + GetPublishUrl, { id: params.publish_id, fieldList: [
    "id", "ca", "semester", "exam", "resit", "specialty__id", "specialty__level__level", "specialty__academic_year", "specialty__main_specialty__specialty_name"
  ] })


  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Publish Results Confirmation"
          pageName1="Main Dashboard"
          link1={`/pageAdministration/${params.school_id}/pageResults/pagePublish`}
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

  const onSubmitSearchAction = async () => {
    'use server';

    var d = {}

    if (searchParams.ca){ d = { ca: true } };
    if (searchParams.exam){ d = { exam: true } };
    if (searchParams.resit){ d = { resit: true } };

    const data = { ...apiData, ...d, specialty_id: apiData.specialty__id, semester: apiData.semester }
    console.log(data)
    // return

    const response = await ActionEdit(data, data.id.toString(), SchemaCreateEditPublish, PublishUrl)

    if (response.id == apiData.id){
      redirect(`/pageAdministration/${params.school_id}/pageResult/pagePublish?success=Published Successfully`)
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
          <button type='submit' className='bg-greendark flex font-medium items-center justify-center px-4 py-1 rounded-sm text-white'>Confirm</button>
        </form>
      </Suspense>


    </div>
  )
}