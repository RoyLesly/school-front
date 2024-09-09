import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import NotificationError from '@/section-h/common/NotificationError';
import ServerError from '@/section-h/common/ServerError';
import { getData } from '@/functions';
import { Metadata } from 'next';
import React, { FC } from 'react'
import MarksForm from './MarksForm';
import LayoutLecturer from '@/section-h/compLecturer/LayoutLecturer';
import SessionExpired from '@/section-h/common/SessionExpired';
import { GetResultUrl } from '@/NoDomain/Utils-H/appControl/appConfig';
import { CourseInter } from '@/NoDomain/Utils-H/appControl/appInter';

const EditPage = async ({
    params,
    searchParams,
}: {
    params: { school_id: string, lecturer_id: string, id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(GetResultUrl, { ...searchParams, nopage: true, course__id: params.id, fieldList: [
    "id", 
    "student__id",
    "student__user__first_name",
    "student__user__full_name",
    "course__id",
    "course__main_course__course_name",
    "student__specialty__main_specialty__specialty_name",
    "student__specialty__academic_year",
    "student__specialty__level__level",
    "exam",
    "average",
    "validated",
    "publish_exam",
    "closed",
    "active",
    "created_by__full_name",
  ]});

  return (
    <LayoutLecturer>
      <>
        <Breadcrumb
          pageName="Exam Marks" 
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
    </LayoutLecturer>
  )
}

export default EditPage



export const metadata: Metadata = {
  title:
    "Exam-Marks-Fill",
  description: "This is Exam Marks Page",
};


interface MarksPageProps {
  apiData: CourseInter
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