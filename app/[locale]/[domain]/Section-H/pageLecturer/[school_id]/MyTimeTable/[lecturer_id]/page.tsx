import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb';
import LayoutLecturer from '@/section-h/compLecturer/LayoutLecturer';
import { getData } from '@/functions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'
import { RiSearch2Fill } from 'react-icons/ri';
import { AcademicYearUrl, GetLevelUrl } from '@/Domain/Utils-H/appControl/appConfig';
import { GetLevelInter } from '@/Domain/Utils-H/appControl/appInter';
import SearchData from './SearchData';
import { protocol } from '@/config';
import { GetTimeSlotUrl } from '@/Domain/Utils-H/timeControl/timeConfig';
import NotificationError from '@/section-h/common/NotificationError';

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string,  domain: string, lecturer_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiTimeSlot = await getData(protocol + "api" + params.domain + GetTimeSlotUrl, { 
    nopage: true,
    course__specialty__school__id: params.school_id,
    course__assigned_to__id: params.lecturer_id,
    timetableday__timetableweek__publish: true,
    fieldList: [ "id", "title", "start", "end", "start_time", "end_time", "hours", "course__id", "status", "timetableday__id", "status", "session", "hours",
      "timetableday__timetableweek__year_week", "timetableday__day", "timetableday__date", "course__main_course__course_name", "course__assigned_to__id"
    ]
  })
  
  return (
    <LayoutLecturer>
      <>
        <Breadcrumb
          pageName="My Time Table"
          pageName1="My Courses"
          link2={`/${params.domain}/Section-H/pageLecturer/${params.school_id}/MyCourses/${params.lecturer_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}
        <SearchData searchParams={searchParams} params={params} apiTimeSlot={apiTimeSlot} />

      </>
    </LayoutLecturer>
  )
}

export default page


export const metadata: Metadata = {
  title: "My Time Table",
  description: "This is My Table Page",
};