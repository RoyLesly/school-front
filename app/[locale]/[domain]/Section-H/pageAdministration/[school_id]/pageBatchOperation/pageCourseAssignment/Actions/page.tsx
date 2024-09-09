import { Metadata } from 'next'
import React from 'react'
import CourseAssignAction from './CourseAssignAction'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import { getData } from '@/functions'
import NotificationError from '@/section-h/common/NotificationError'
import { GetMainCourseUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { GetCustomUserUrl } from '@/Domain/Utils-H/userControl/userConfig'
import { protocol } from '@/config'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetMainCourseUrl, { nopage: true });
  const apiLecturer: any = await getData(protocol + "api" + params.domain + GetCustomUserUrl, { role: "teacher", is_active: true, is_staff: false, nopage: true, school__id: params.school_id, fieldList: [ "id", "full_name" ] });
  const apiAdmin: any = await getData(protocol + "api" + params.domain + GetCustomUserUrl, { role: "admin", is_active: true, is_staff: false, nopage: true, school__id: params.school_id, fieldList: [ "id", "full_name" ] });

  return (
    <LayoutAdmin>
        <>
            <Breadcrumb
                pageName={`Set Course Properties`}
                pageName1="Dashboard" 
                link1={`${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageCourseAssignment`}
            />

            {searchParams && <NotificationError errorMessage={searchParams} />}

            {apiData && <CourseAssignAction apiData={apiData} searchParams={searchParams} apiAdmin={apiAdmin}  apiLecturer={apiLecturer} />}
            
        </>
    </LayoutAdmin>
  )
}

export default page;

export const metadata: Metadata = {
    title:
      "Course Assignment",
  };