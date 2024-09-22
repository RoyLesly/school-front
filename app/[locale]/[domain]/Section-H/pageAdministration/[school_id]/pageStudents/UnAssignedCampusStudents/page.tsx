import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { GetProgramUrl, GetUserProfileUrl } from '@/Domain/Utils-H/userControl/userConfig'
import ListStudUnAssCampusPage from '@/componentsTwo/ListProfiles/ListStudUnAssCampusPage'
import {GetDomainUrl, GetLevelUrl } from '@/Domain/Utils-H/appControl/appConfig'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiData: any = await getData(protocol + "api" + params.domain + GetUserProfileUrl, {
    user__role: "student", nospecialty: true, user__school__id: params.school_id, nopage: true, ...searchParams, fieldList: [
      "id", "user__id", "user__matricle", "user__full_name", "user__telephone", "user__email", "user__sex", "user__dob", "user__pob",
      "specialty__main_specialty__specialty_name", "specialty__academic_year", "specialty__level__level",
    ]
  })
  const apiLevels: any = await getData(protocol + "api" + params.domain + GetLevelUrl, { nopage: true })

  const apiDomains: any = await getData(protocol + "api" + params.domain + GetDomainUrl, {})
  
  const apiPrograms: any = await getData(protocol + "api" + params.domain + GetProgramUrl, {})


  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && apiDomains && apiLevels && <ListStudUnAssCampusPage
          params={params}
          data={apiData}
          extra_data={[apiDomains.results, apiLevels, apiPrograms, `/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/UnAssignedCampusStudents`]}
        />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Un-Assigned Student Settings",
  description: "This is Un-Assigned Student Settings Page",
};
