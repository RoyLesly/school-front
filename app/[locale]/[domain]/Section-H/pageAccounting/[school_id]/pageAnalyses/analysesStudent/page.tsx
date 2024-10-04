import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import LayoutAccounting from '@/section-h/compAccounting/LayoutAccounting'
import { GetStatsStudentsPendingFeesUrl } from '@/Domain/Utils-H/dashControl/dashConfig'
import { AcademicYearUrl, GetDomainUrl, GetLevelUrl } from '@/Domain/Utils-H/appControl/appConfig'
import ListAccStudentPage from '@/componentsTwo/ListAccounting/ListAccStudentPage'

const page = async ({
  params,
  searchParams,
}: {
  params: { school_id: string, domain: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {


  const acadYears: any = await getData(protocol + "api" + params.domain + AcademicYearUrl, { school: params.school_id })
  const apiDomains = await getData(protocol + "api" + params.domain + GetDomainUrl, { nopage: true })
  const apiLevels = await getData(protocol + "api" + params.domain + GetLevelUrl, { nopage: true })
  const filteredYear = await searchParams && Object.keys(searchParams).length && acadYears.count && searchParams.academic_year && acadYears && acadYears.count ? searchParams.academic_year : acadYears.results.sort((a: string, b: string) => a[3] < b[3] ? 1 : a[3] > b[3] ? -1 : 0)[0]

  const apiData: any = await getData(protocol + "api" + params.domain + GetStatsStudentsPendingFeesUrl, {
    school: params.school_id,
    academic_year: filteredYear,
    bal: 0,
    ...searchParams,
    fieldList: [ 
      "id", "userprofile__user__full_name", "userprofile__specialty__main_specialty__specialty_name", "userprofile__specialty__level__level", "userprofile__specialty__academic_year",
      "balance", "userprofile__specialty__tuition"
    ],
  })

  return (
    <LayoutAccounting>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && <ListAccStudentPage
          params={params} data={apiData} years={acadYears.results}
          thisYear={filteredYear}
          domains={apiDomains}
          levels={apiLevels}
          searchParams={searchParams}
        />}

      </>
    </LayoutAccounting>
  )
}

export default page

export const metadata: Metadata = {
  title: "Student-Accounting",
  description: "This is Student Accounting Page",
};
