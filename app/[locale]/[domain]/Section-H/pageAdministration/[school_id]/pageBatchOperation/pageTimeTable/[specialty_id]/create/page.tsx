import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import SessionExpired from '@/section-h/common/SessionExpired'
import CreateTimeTable from './CreateTimeTable'
import { GetCourseUrl, GetSpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, specialty_id: string, domain: string };
  searchParams: { month: string, year: string };
}) => {

  const apiSpecialty: any = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, { ...searchParams, id: params.specialty_id, fieldList: ["id", "main_specialty__specialty_name", "academic_year", "level__level"] });
  const apiSpecialtyCourses: any = await getData(protocol + "api" + params.domain + GetCourseUrl, { specialty__id: params.specialty_id, fieldList: [ "id", "main_course__course_name", ]});

  return (
    <LayoutAdmin>
      <>
        {apiSpecialty && apiSpecialty.count && <Breadcrumb
          pageName={`Create Time-Table  - ${apiSpecialty?.results[0].main_specialty__specialty_name}  ${apiSpecialty?.results[0].academic_year} -  ${apiSpecialty?.results[0].level__level}`}
          pageName1="Classes"
          pageName2="Back"
          link1={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable`}
          link2={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageTimeTable/${params.specialty_id}/selectdate`}
        />}

        {apiSpecialty['unauthorized'] && <SessionExpired />}
        {apiSpecialty && apiSpecialtyCourses.count ? <CreateTimeTable params={params} searchParams={searchParams} courses={apiSpecialtyCourses.results} /> : <div>No Assigned Courses</div>}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title:
    "TimeTable-Create",
  description: "This is Time Table  Page",
};
