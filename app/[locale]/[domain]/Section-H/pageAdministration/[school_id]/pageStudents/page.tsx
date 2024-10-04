import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig'
import ListStudentsPage from '@/componentsTwo/ListProfiles/ListStudentsPage'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetUserProfileUrl, { 
    nopage: true, user__is_staff: false, role: "student", is_active: true,
    specialty__school__id: params.school_id, ...searchParams, fieldList: [
    "id", "user__matricle", "user__full_name", "user__telephone", "user__email", "user__sex", "user__dob", "user__pob",
    "specialty__main_specialty__specialty_name", "specialty__academic_year", "specialty__level__level", "user__address"
  ] })

  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && <ListStudentsPage params={params} data={apiData} searchParams={searchParams} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Student Settings",
  description: "This is Student Settings Page",
};
