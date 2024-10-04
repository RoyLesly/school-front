import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import ListCoursePage from '@/componentsTwo/ListSettings/ListCoursePage'
import { GetCourseUrl } from '@/Domain/Utils-H/appControl/appConfig'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetCourseUrl, { nopage: true, specialty__school__id: params.school_id, ...searchParams, fieldList: [
    "id", "main_course__course_name", "main_course__id", "course_code", "course_type", "course_credit", "semester", "hours", "hours_left", 
    "assigned_to__full_name", "assigned_to__id", "assigned", "semester", "specialty__main_specialty__field__domain__domain_name", "specialty__main_specialty__field__domain__id",
    "specialty__id", "specialty__main_specialty__specialty_name", "specialty__academic_year", "specialty__level__level"
  ] })
  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && <ListCoursePage params={params} data={apiData} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Course Settings",
  description: "This is Course Settings Page",
};
