import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import ListSpecialtyPage from '@/componentsTwo/ListSettings/ListSpecialtyPage'
import { AcademicYearUrl, GetSpecialtyUrl } from '@/Domain/Utils-H/appControl/appConfig'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const apiYears: any = await getData(protocol + "api" + params.domain + AcademicYearUrl, { school: params.school_id })

  const apiData: any = await getData(protocol + "api" + params.domain + GetSpecialtyUrl, { 
     ...searchParams, school__id: params.school_id, fieldList: [
    "id", "main_specialty__specialty_name", "main_specialty__id", "main_specialty__specialty_name", "academic_year", "registration",
    "tuition", "payment_one", "payment_two", "payment_three", "level__level", "level__id"
  ] })
  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && apiYears && <ListSpecialtyPage apiYears={apiYears.results} params={params} data={apiData.results} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Specialty-Settings",
  description: "This is Specialty Settings Page",
};
