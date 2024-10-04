import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import SessionExpired from '@/section-h/common/SessionExpired'
// import CreateTimeTable from './CreateTimeTable'
import { GetCourseUrl, GetSpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
// import CreateTimeTable from '../CreateTimeTable'
import { GetTimeSlotUrl, GetTimeTableWeekUrl } from '@/Domain/Utils-H/timeControl/timeConfig'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, specialty_id: string, domain: string };
  searchParams: { tbw: number, session: string, weekNo: string };
}) => {

  const apiSpecialty: any = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, { ...searchParams, id: params.specialty_id, fieldList: ["id", "main_specialty__specialty_name", "academic_year", "level__level"] });
  const apiSpecialtyCourses: any = await getData(protocol + "api" + params.domain + GetCourseUrl, { specialty__id: params.specialty_id, fieldList: [ "id", "main_course__course_name", ]});
  const apiTBW: any = await getData(protocol + "api" + params.domain + GetTimeTableWeekUrl, { id: searchParams?.tbw, fieldList: [ "id", "publish", "year_week", "specialty__id", ]});
  const apiTimeSlots: any = await getData(protocol + "api" + params.domain + GetTimeSlotUrl, { timetableday__timetableweek__id: searchParams?.tbw, fieldList: [ "id", "start", "end", "course__id", "title", ]});

  console.log(apiTBW, 27)
  console.log(apiTimeSlots, 28)
  return (
    <LayoutAdmin>
      <>
        {searchParams && <NotificationError errorMessage={searchParams} />}
        
        {apiSpecialty && apiSpecialty.count && <Breadcrumb
          pageName={`Time-Table  - ${apiSpecialty?.results[0].main_specialty__specialty_name}  ${apiSpecialty?.results[0].academic_year} -  ${apiSpecialty?.results[0].level__level}`}
          pageName1="Back"
          link1={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable`}
        />}

        {apiSpecialty['unauthorized'] && <SessionExpired />}
        {/* {apiSpecialty && apiSpecialtyCourses.count ? <CreateTimeTable params={params} searchParams={searchParams} courses={apiSpecialtyCourses.results} /> : <div>No Assigned Courses</div>} */}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "TimeTable-Edit",
  description: "This is Time Edit  Page",
};
