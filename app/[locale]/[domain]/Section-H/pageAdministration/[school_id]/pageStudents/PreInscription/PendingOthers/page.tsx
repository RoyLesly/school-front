import { Metadata } from 'next'
import React from 'react'
import LayoutAdmin from '@/section-h/compAdministration/LayoutAdmin'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import { AcademicYearUrl, GetDomainUrl, GetLevelUrl, GetSchoolInfoUrl } from '@/Domain/Utils-H/appControl/appConfig'
import ListPreInscriptionPage from '@/componentsTwo/ListProfiles/ListPreInscriptionPage'
import { GetDepartmentUrl, GetProgramUrl, OpenGetPreInscriptionUrl } from '@/Domain/Utils-H/userControl/userConfig'
import { GetPreInscriptionInter } from '@/Domain/Utils-H/userControl/userInter'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const apiSchool: any = await getData(protocol + "api" + params.domain + GetSchoolInfoUrl, {
    nopage: true, ...searchParams, id: params.school_id, fieldList: [
      "id", "campus__name",
    ]
  })

  const apiData: any = await getData(protocol + "api" + params.domain + OpenGetPreInscriptionUrl, {
    nopage: true, ...searchParams, status: "PENDING", fieldList: [
      "id", "registration_number", "status", "first_name", "last_name", "full_name", "telephone", "email", "sex", "dob", "pob",
      "specialty_one", "specialty_two", "academic_year", "address", "admission_status", "emergency_name", "emergency_telephone",
      "program", "session", "level", "campus"
    ]
  })

  const apiYears: any = await getData(protocol + "api" + params.domain + AcademicYearUrl, { school: params.school_id })
  const apiLevels: any = await getData(protocol + "api" + params.domain + GetLevelUrl, { nopage: true })
  const apiDomains: any = await getData(protocol + "api" + params.domain + GetDomainUrl, { nopage: true})
  const apiPrograms: any = await getData(protocol + "api" + params.domain + GetProgramUrl, { })
  const apiDepartments: any = await getData(protocol + "api" + params.domain + GetDepartmentUrl, { name: "stud" })
console.log(apiSchool[0].campus__name)
  return (
    <LayoutAdmin>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && <ListPreInscriptionPage
          params={params}
          data={apiData && apiData.filter((item: GetPreInscriptionInter) => item.campus != apiSchool[0].campus__name)}
          page={3}
          
          extra_data={
            { apiDomains: apiDomains, apiLevels: apiLevels, apiPrograms: apiPrograms.results, apiDepartments: apiDepartments.results, apiYears: apiYears.results }
          }
        />}

      </>
    </LayoutAdmin>
  )
}

export default page

export const metadata: Metadata = {
  title: "Pre-Inscription",
  description: "This is Pre-Inscription Page",
};
