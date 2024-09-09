import { GetResultUrl } from '@/Domain/Utils-H/appControl/appConfig';
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import { getData } from '@/functions';
import { Metadata } from 'next';
import React, { FC } from 'react'
import MarksForm from './MarksForm';
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin';
import SessionExpired from '@/section-h/common/SessionExpired';
import { protocol } from '@/config';

const EditPage = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, lecturer_id: string, course_id: string, domain: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetResultUrl, { nopage: true, course__semester: searchParams?.resit, course__id: params.course_id, active: true, fieldList: [
    "id", 
    "student__id",
    "student__user__full_name",
    "course__id",
    "course__main_course__course_name",
    "student__specialty__academic_year",
    "student__specialty__level__level",
    "student__specialty__main_specialty__specialty_name",
    "ca", "exam", "resit",
    "active",
    "created_by__full_name", "created_by__id",
  ]});


  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="RESIT Marks" 
          pageName1="Back" 
          link1={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry/details/${params.course_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiData == "ECONNREFUSED" && <ServerError />}
        {apiData && apiData.length > 0 && <MarksPage apiData={apiData} params={params} searchParams={searchParams} />}
        {apiData && apiData["unauthorized"] && <SessionExpired />}

      </>
    </LayoutAdmin>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Resit-Marks-Fill",
  description: "This is RESIT Marks Page",
};


interface MarksPageProps {
  apiData: any
  params: any
  searchParams: any
}

const MarksPage:FC<MarksPageProps> = async ( { apiData, params, searchParams }) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-2">

            { apiData && apiData.length > 0 ? <MarksForm resultData={apiData} params={params} searchParams={searchParams} /> : <div className="bg-white flexjustify-center font-medium items-center pb-72 pt-40 rounded tracking-widest">No Students Found</div>}

          </div>
        </div>
      </div>
    
    </div>
  )
}