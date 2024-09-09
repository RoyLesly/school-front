import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-s/common/NotificationError';
import ServerError from '@/section-s/common/ServerError';
import { getData } from '@/functions';
import { Metadata } from 'next';
import React, { FC } from 'react'
import MarksForm from './MarksForm';
import SessionExpired from '@/section-s/common/SessionExpired';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { GetResultUrl } from '@/NoDomain/Utils-H/appControl/appConfig';

const EditPage = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, lecturer_id: string, subject_id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(GetResultUrl, { ...searchParams, subject__id: params.subject_id, active: true, fieldList: [
    "id", 
    "student__id",
    "student__user__full_name",
    "subject__id",
    "subject__main_subject__subject_name",
    "student__classroom__level__option",
    "student__classroom__academic_year",
    "student__classroom__level__level",
    "seq_1", "seq_2", "seq_3", "seq_4", "seq_5", "seq_6",
    "active",
    "created_by__full_name", "created_by__id",
  ]});

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Exam Marks" 
          pageName1="Back" 
          link1={`/pageAdministration/${params.school_id}/pageBatchOperation/pageMarksEntry/details/${params.subject_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiData == "ECONNREFUSED" && <ServerError />}
        {apiData && apiData.count && <MarksPage apiData={apiData} params={params} searchParams={searchParams} />}
        {apiData && apiData["unauthorized"] && <SessionExpired />}

      </>
    </LayoutAdmin>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Exam-Marks-Fill",
  description: "This is Exam Marks Page",
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

            { apiData &&<MarksForm resultData={apiData} params={params} searchParams={searchParams} />}

          </div>
        </div>
      </div>
    
    </div>
  )
}