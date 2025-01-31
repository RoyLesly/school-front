import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import SessionExpired from '@/section-h/common/SessionExpired'
import { GetCourseUrl, GetSpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { GetTimeSlotUrl } from '@/Domain/Utils-H/timeControl/timeConfig'
import ListData from './ListData'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, specialty_id: string, domain: string };
  searchParams: { month: string, year: string };
}) => {

  const apiTimeSlots: any = await getData(protocol + "api" + params.domain + GetTimeSlotUrl, { nopage: true,  course__specialty__id: params.specialty_id, fieldList: [ 
    "id", "title", "start", "end", "status", "start_time", "end_time", "timetableday__day", "timetableday__date", "timetableday__timetableweek__year_week", "timetableday__timetableweek__publish",
  ]});
  const apiSpecialty: any = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, { nopage: true,  id: params.specialty_id, fieldList: [ 
    "id", "main_specialty__specialty_name", "academic_year", "level__level",
  ]});

  const apiCourses = apiSpecialty && apiSpecialty.length && await getData(protocol + "api" + params.domain + GetCourseUrl, { specialty__id: apiSpecialty[0].id, nopage: true, fieldList: ["id", "main_course__course_name"] })


  return (
    <LayoutAdmin>
      <>
        {searchParams && <NotificationError errorMessage={searchParams} />}
        
        {apiTimeSlots['unauthorized'] && <SessionExpired />}

        {apiTimeSlots && apiTimeSlots.length ? <ListData params={params} searchParams={searchParams} apiTimeSlots={apiTimeSlots} apiSpecialty={apiSpecialty[0]} apiCourses={apiCourses} /> 
        : 
        <div className='flex font-medium items-center justify-center pt-20 text-[20px] w-full'>No Assigned Courses</div>}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "TimeTable-Class",
  description: "This is Time Table Class  Page",
};
