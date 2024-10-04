import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import Breadcrumb from '@/section-h/common/Breadcrumbs/Breadcrumb'
import NotificationError from '@/section-h/common/NotificationError'
import { AcademicYearUrl, GetSpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { protocol } from '@/config'
import ListTimeTableSpecialty from '@/componentsTwo/ListTimeTable/ListTimeTableSpecialty'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiYears: any = await getData(protocol + "api" + params.domain + AcademicYearUrl, { school: params.school_id });
  const apiData: any = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, { 
    ...searchParams, school__id: params.school_id, fieldList: [
   "id", "main_specialty__specialty_name", "main_specialty__id", "main_specialty__specialty_name", "academic_year", "registration",
   "tuition", "payment_one", "payment_two", "payment_three", "level__level", "level__id"
 ] })  

  return (
    <LayoutAdmin>
      <>
        <Breadcrumb
          pageName="Classes"
          pageName1="Dashboard"
          link1={`/${params.domain}/Section-H/pageAdministration/${params.school_id}`}
        />

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && apiYears && <ListTimeTableSpecialty apiYears={apiYears.results} params={params} data={apiData.results} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Classes",
  description: "This is Classes Page",
};