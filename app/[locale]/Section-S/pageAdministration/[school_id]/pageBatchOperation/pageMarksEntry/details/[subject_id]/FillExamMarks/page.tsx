import { GetResultUrl } from '@/NoDomain/Utils-S/appControl/appConfig';
import { SubjectInter } from '@/NoDomain/Utils-S/appControl/appInter';
import Breadcrumb from '@/section-s/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-s/common/NotificationError';
import ServerError from '@/section-s/common/ServerError';
import { getData } from '@/functions';
import { Metadata } from 'next';
import React, { FC } from 'react'
// import MarksForm from './MarksForm';
import SessionExpired from '@/section-s/common/SessionExpired';
import LayoutAdmin from '@/section-s/compAdministration/LayoutAdmin';
import { protocol } from '@/config';

const EditPage = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, lecturer_id: string, id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  // const apiData: any = await fetchData({url: OptResultUrl, searchParams: { ...searchParams, course__id: params.id, fieldList: [
  const apiData: any = await getData(protocol + GetResultUrl, {...searchParams, nopage: true, course__id: params.id, fieldList: [
    "id", 
    "student__id",
    "student__user__full_name",
    "course__id",
    "course__main_course__course_name",
    "student__specialty__main_specialty__specialty_name",
    "student__specialty__academic_year",
    "student__specialty__level__level",
    "ca",
    "average",
    "validated",
    "publish_ca",
    "closed",
    "active",
    "created_by__full_name",
  ]});
  
  console.log(28, apiData)

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="CA Marks" 
          pageName1="Home" 
          pageName2="Courses" 
          link1={`/pageLecturer/${params.school_id}`}
          link2={`/pageLecturer/${params.school_id}/MarksUpload/${params.lecturer_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        {apiData == "ECONNREFUSED" && <ServerError />}
        {apiData && apiData != "ECONNREFUSED" && <MarksPage apiData={apiData} params={params} />}
        {apiData && apiData["unauthorized"] && <SessionExpired />}

      </>
    </LayoutAdmin>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "CA-Marks-Fill",
  description: "This is CA Marks Page",
};


interface MarksPageProps {
  apiData: SubjectInter
  params: any
}

const MarksPage:FC<MarksPageProps> = async ( { apiData, params }) => {

  return (
    <div className="bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default">

      <div className='md:p-6 p-2'>
        <div className="gap-9 grid grid-cols-1">
          <div className="flex flex-col gap-2">

            {/* { apiData &&<MarksForm resultData={apiData} params={params} />} */}

          </div>
        </div>
      </div>
    
    </div>
  )
}