import { Metadata } from 'next'
import React from 'react'
import { getData } from '@/functions'
import { protocol } from '@/config'
import NotificationError from '@/section-h/common/NotificationError'
import LayoutAccounting from '@/section-h/compAccounting/LayoutAccounting'
import { GetStatsBySpecialtyUrl } from '@/Domain/Utils-H/dashControl/dashConfig'
import { AcademicYearUrl, GetDomainUrl, GetLevelUrl } from '@/Domain/Utils-H/appControl/appConfig'
import ListAccSpecialtyPage from '@/componentsTwo/ListAccounting/ListAccSpecialtyPage'

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

  const apiData: any = await getData(protocol + "api" + params.domain + GetStatsBySpecialtyUrl, {
    school: params.school_id,
    academic_year: filteredYear,
    ...searchParams
  })

  return (
    <LayoutAccounting>
      <>

        {searchParams && <NotificationError errorMessage={searchParams} />}

        {apiData && <ListAccSpecialtyPage
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
  title: "Class-Accounting",
  description: "This is Class Accounting Page",
};
