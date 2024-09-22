import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import ListMainCoursePage from '@/componentsTwo/ListSettings/ListMainCoursePage'
import { GetMainCourseUrl } from '@/Domain/Utils-H/appControl/appConfig'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetMainCourseUrl, { ...searchParams, nopage: true, fieldList: [
    "id", "course_name",
  ] })
  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && <ListMainCoursePage params={params} data={apiData} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Main-Course Settings",
  description: "This is Main-Course Settings Page",
};
