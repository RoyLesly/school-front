import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { GetProgramUrl, GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig'
import ListStudsInfoPage from '@/componentsTwo/ListProfiles/ListStudsInfoPage'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string, student_id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetUserProfileUrl, { nopage: true, id: params.student_id, ...searchParams, fieldList: [
    "id", "user__first_name", "user__last_name", "user__matricle", "user__telephone", "user__username", "user__email", "user__sex", "user__dob", "user__pob",
    "specialty__main_specialty__specialty_name", "specialty__academic_year", "specialty__level__level", "program__name", "program__id", "session"
  ] });

  const apiProgram: any = await getData(protocol + "api" + params.domain + GetProgramUrl, {  })
  
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && apiProgram && <ListStudsInfoPage params={params} data={apiData[0]} apiProgram={apiProgram.results} />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Student Settings",
  description: "This is Student Settings Page",
};
